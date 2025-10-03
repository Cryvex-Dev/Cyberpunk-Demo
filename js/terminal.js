(function() {
    'use strict';

    let terminal, terminalContent, terminalInput, terminalCursor;
    let commandHistory = JSON.parse(localStorage.getItem("terminalHistory") || "[]");
    let historyIndex = commandHistory.length;
    let currentDir = "/";

    const fakeFS = {
        "/": ["home", "system", "readme.txt"],
        "/home": ["user", "projects"],
        "/system": ["kernel.log", "drivers", "secrets"],
        "/home/user": ["notes.txt", "diary.log"],
        "/home/projects": ["hack.js", "ai-core.bin"]
    };

    const themes = {
        dark: {
            "--primary-color": "#0ff",
            "--secondary-color": "#0f0",
            "--bg-color": "#000",
            "--success-color": "#0f0",
            "--warning-color": "#ff0"
        },
        neon: {
            "--primary-color": "#ff00ff",
            "--secondary-color": "#00ffff",
            "--bg-color": "#0a0a0a",
            "--success-color": "#0f0",
            "--warning-color": "#f80"
        },
        green: {
            "--primary-color": "#0f0",
            "--secondary-color": "#9f9",
            "--bg-color": "#001100",
            "--success-color": "#0f0",
            "--warning-color": "#ff0"
        }
    };

    let isTerminalActive = false;

    function initTerminal() {
        terminal = document.querySelector(".interface-terminal");
        terminalContent = document.getElementById("terminal-content");
        terminalInput = document.querySelector(".terminal-input");
        terminalCursor = document.querySelector(".cursor");

        if (!terminal || !terminalContent || !terminalInput) {
            console.error("Terminal elements not found");
            return;
        }

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "text";
        hiddenInput.className = "hidden-terminal-input";
        terminal.appendChild(hiddenInput);

        const styleElement = document.createElement("style");
        styleElement.textContent = `
            .hidden-terminal-input { position: absolute; opacity: 0; pointer-events: none; }
            .terminal-active { border: 2px solid var(--secondary-color); }
            .cursor { animation: blink-caret 0.75s step-end infinite; }
            @keyframes blink-caret { 50% { opacity: 0; } }
        `;
        document.head.appendChild(styleElement);

        terminalContent.addEventListener("click", focusTerminal);
        hiddenInput.addEventListener("input", handleInput);
        hiddenInput.addEventListener("keydown", handleKeyDown);

        bootSequence();
    }

    function bootSequence() {
        const logs = [
            "[OK] Initializing CyberVision Terminal v2.5",
            "[OK] Loading kernel modules...",
            "[OK] Establishing secure uplink...",
            "[OK] Decrypting system files...",
            "[READY] Type 'help' for commands."
        ];
        let i = 0;
        const interval = setInterval(() => {
            addTerminalLine(logs[i], "terminal-success");
            i++;
            if (i >= logs.length) {
                clearInterval(interval);
                activateTerminal();
            }
        }, 700);
    }

    function activateTerminal() {
        isTerminalActive = true;
        terminal.classList.add("terminal-active");
        updateInputLine("");
        focusTerminal();
    }

    function focusTerminal() {
        if (!isTerminalActive) return;
        const hiddenInput = document.querySelector(".hidden-terminal-input");
        hiddenInput && hiddenInput.focus();
    }

    function handleInput(e) {
        updateInputLine(e.target.value);
    }

    function handleKeyDown(e) {
        if (!isTerminalActive) return;
        const hiddenInput = e.target;

        if (e.key === "Enter") {
            const commandText = hiddenInput.value.trim();
            if (commandText) {
                commandHistory.push(commandText);
                historyIndex = commandHistory.length;
                localStorage.setItem("terminalHistory", JSON.stringify(commandHistory));
                executeCommand(commandText);
                hiddenInput.value = "";
                updateInputLine("");
            }
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                hiddenInput.value = commandHistory[historyIndex];
                updateInputLine(hiddenInput.value);
            }
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                hiddenInput.value = commandHistory[historyIndex];
                updateInputLine(hiddenInput.value);
            } else {
                historyIndex = commandHistory.length;
                hiddenInput.value = "";
                updateInputLine("");
            }
            e.preventDefault();
        } else if (e.key === "Tab") {
            e.preventDefault();
            const commands = ["help","clear","sudo","exit","about","time","ls","cd","cat","theme","ai"];
            const match = commands.find(c => c.startsWith(hiddenInput.value.trim()));
            if (match) {
                hiddenInput.value = match;
                updateInputLine(match);
            }
        }
    }

    function updateInputLine(text) {
        if (!terminalInput) return;
        let inputSpan = terminalInput.querySelector("span.typed-text");
        if (!inputSpan) {
            inputSpan = document.createElement("span");
            inputSpan.className = "typed-text";
            terminalInput.appendChild(inputSpan);
            const cursor = document.createElement("span");
            cursor.className = "cursor";
            cursor.innerHTML = "&nbsp;";
            terminalInput.appendChild(cursor);
        }
        inputSpan.textContent = text;
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    function addTerminalLine(text, className = "") {
        const line = document.createElement("div");
        line.className = "terminal-line " + className;
        line.textContent = "> " + text;
        terminalContent.insertBefore(line, terminalInput);
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    function executeCommand(command) {
        addTerminalLine(command);
        const [cmd, ...args] = command.split(" ");
        switch (cmd.toLowerCase()) {
            case "help": showHelp(); break;
            case "clear": clearTerminal(); break;
            case "exit": addTerminalLine("Session closed."); isTerminalActive = false; break;
            case "about": addTerminalLine("CyberVision Terminal v2.5 - neon edition"); break;
            case "time": addTerminalLine(new Date().toLocaleString()); break;
            case "ls": listDir(); break;
            case "cd": changeDir(args[0]); break;
            case "cat": catFile(args[0]); break;
            case "theme": setTheme(args[0]); break;
            case "ai": aiChat(args.join(" ")); break;
            case "sudo": executeSudoCommand(args); break;
            default: addTerminalLine(`Command not found: ${cmd}`, "terminal-warning");
        }
    }

    function showHelp() {
        const cmds = [
            "help       Show this help",
            "clear      Clear screen",
            "ls         List directory",
            "cd <dir>   Change directory",
            "cat <file> View file",
            "theme <t>  Switch theme (dark/neon/green)",
            "ai <msg>   Talk to AI",
            "time       Show system time",
            "about      Info",
            "exit       Exit",
            "sudo @kill Refresh site",
            "sudo hack  Activate glitch",
            "sudo matrix Matrix rain"
        ];
        cmds.forEach(c => addTerminalLine(c));
    }

    function clearTerminal() {
        [...terminalContent.children].forEach(child => {
            if (!child.classList.contains("terminal-input")) child.remove();
        });
    }

    function listDir() {
        const files = fakeFS[currentDir] || [];
        addTerminalLine(files.join("   "));
    }

    function changeDir(dir) {
        if (!dir) return addTerminalLine("Usage: cd <dir>", "terminal-warning");
        let newPath = dir.startsWith("/") ? dir : currentDir + "/" + dir;
        newPath = newPath.replace(/\/+/g, "/");
        if (fakeFS[newPath]) {
            currentDir = newPath;
            addTerminalLine("Directory changed: " + currentDir);
        } else {
            addTerminalLine("No such directory: " + dir, "terminal-warning");
        }
    }

    function catFile(file) {
        const files = fakeFS[currentDir] || [];
        if (files.includes(file)) {
            addTerminalLine(`[${file}]`);
            addTerminalLine(">>> " + (file.includes("txt") ? "Encrypted neon data..." : "Binary stream..."));
        } else {
            addTerminalLine("No such file: " + file, "terminal-warning");
        }
    }

    function setTheme(theme) {
        if (!themes[theme]) return addTerminalLine("Theme not found", "terminal-warning");
        for (const key in themes[theme]) {
            document.documentElement.style.setProperty(key, themes[theme][key]);
        }
        addTerminalLine(`Theme set to ${theme}`);
    }

    function aiChat(msg) {
        if (!msg) return addTerminalLine("AI: ...", "terminal-warning");
        const responses = [
            "The grid hums with neon life.",
            "Data flows like rivers in the dark.",
            "Your words are fragments of the machine.",
            "I sense corruption... in the code.",
            "Your query is absorbed into the void."
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        simulateTyping("AI: " + reply);
    }

    function executeSudoCommand(args) {
        if (!args.length) return addTerminalLine("Usage: sudo <cmd>", "terminal-warning");
        const sudoCmd = args[0].toLowerCase();
        if (sudoCmd === "@kill") {
            addTerminalLine("System refresh...", "terminal-warning");
            setTimeout(() => location.reload(), 1500);
        } else if (sudoCmd === "hack") {
            addTerminalLine("Glitch mode activated!", "terminal-warning");
            document.body.classList.add("site-glitch");
        } else if (sudoCmd === "matrix") {
            matrixMode();
        } else {
            addTerminalLine(`Unknown sudo command: ${sudoCmd}`, "terminal-warning");
        }
    }

    function matrixMode() {
        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = 9999;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols = Math.floor(canvas.width / 20);
        const yPos = Array(cols).fill(0);

        function draw() {
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "#0f0";
            ctx.font = "20px monospace";
            yPos.forEach((y, i) => {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillText(text, i*20, y);
                yPos[i] = y > canvas.height + Math.random()*100 ? 0 : y + 20;
            });
        }
        setInterval(draw, 50);
        addTerminalLine("Matrix mode engaged.");
    }

    function simulateTyping(text, delay = 30) {
        let i = 0;
        const interval = setInterval(() => {
            addTerminalLine(text.slice(0, ++i));
            if (i >= text.length) clearInterval(interval);
        }, delay);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTerminal);
    } else {
        setTimeout(initTerminal, 500);
    }
})();

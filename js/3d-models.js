// 3D models handling using Three.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero section 3D
    initHero3D();
    
    // Initialize product 3D
    initProduct3D();
    
    // Initialize cyberspace 3D
    initCyberspace3D();
    
    // Add controls for product viewer
    setupProductControls();
});

function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x05d9e8, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff2a6d, 2, 50);
    pointLight.position.set(-2, 1, 3);
    scene.add(pointLight);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x05d9e8,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create floating spheres
    const sphereGeometry = new THREE.SphereGeometry(0.2, 24, 24);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff2a6d,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8
    });
    
    const spheres = [];
    
    for (let i = 0; i < 10; i++) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
        sphere.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        sphere.material.color.setHSL(Math.random(), 0.8, 0.5);
        sphere.userData = {
            speedX: (Math.random() - 0.5) * 0.01,
            speedY: (Math.random() - 0.5) * 0.01,
            speedZ: (Math.random() - 0.5) * 0.01
        };
        spheres.push(sphere);
        scene.add(sphere);
    }
    
    // Create wireframe brain model
    const brainGeometry = new THREE.IcosahedronGeometry(2, 3);
    const brainMaterial = new THREE.MeshBasicMaterial({
        color: 0x05d9e8,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    
    const brain = new THREE.Mesh(brainGeometry, brainMaterial);
    scene.add(brain);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate brain
        brain.rotation.x += 0.001;
        brain.rotation.y += 0.002;
        
        // Animate spheres
        spheres.forEach(sphere => {
            sphere.position.x += sphere.userData.speedX;
            sphere.position.y += sphere.userData.speedY;
            sphere.position.z += sphere.userData.speedZ;
            
            // Bounce off invisible boundaries
            if (Math.abs(sphere.position.x) > 4) sphere.userData.speedX *= -1;
            if (Math.abs(sphere.position.y) > 4) sphere.userData.speedY *= -1;
            if (Math.abs(sphere.position.z) > 4) sphere.userData.speedZ *= -1;
        });
        
        // Rotate particles
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function initProduct3D() {
    const container = document.getElementById('product-3d-container');
    if (!container) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff2a6d, 2, 50);
    pointLight.position.set(-2, 1, 3);
    scene.add(pointLight);
    
    // Create product model (NeuroLink X9 by default)
    const productGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const productMaterial = new THREE.MeshStandardMaterial({
        color: 0xff2a6d,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xff2a6d,
        emissiveIntensity: 0.3
    });
    
    const product = new THREE.Mesh(productGeometry, productMaterial);
    scene.add(product);
    
    // Add details to the product
    const detailGeometry1 = new THREE.TorusGeometry(0.6, 0.03, 16, 100);
    const detailMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x05d9e8,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x05d9e8,
        emissiveIntensity: 0.5
    });
    
    const detail1 = new THREE.Mesh(detailGeometry1, detailMaterial1);
    detail1.rotation.x = Math.PI / 2;
    product.add(detail1);
    
    const detailGeometry2 = new THREE.SphereGeometry(0.1, 16, 16);
    const detailMaterial2 = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x05d9e8,
        emissiveIntensity: 0.5
    });
    
    const detail2 = new THREE.Mesh(detailGeometry2, detailMaterial2);
    detail2.position.y = 0.15;
    product.add(detail2);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Make the product and models globally accessible
    window.productScene = scene;
    window.productCamera = camera;
    window.productRenderer = renderer;
    window.productModel = product;
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Slow rotation
        product.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function initCyberspace3D() {
    const container = document.getElementById('cyberspace-3d-container');
    if (!container) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x05d9e8, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a grid of lines to represent cyberspace
    const gridSize = 20;
    const gridDivisions = 20;
    const gridMaterial = new THREE.LineBasicMaterial({
        color: 0x05d9e8,
        transparent: true,
        opacity: 0.5
    });
    
    // Create horizontal grid
    for (let i = 0; i <= gridDivisions; i++) {
        const position = (i / gridDivisions) * gridSize - gridSize / 2;
        
        // X-axis line
        const geometryX = new THREE.BufferGeometry();
        const pointsX = [
            new THREE.Vector3(-gridSize / 2, position, 0),
            new THREE.Vector3(gridSize / 2, position, 0)
        ];
        geometryX.setFromPoints(pointsX);
        const lineX = new THREE.Line(geometryX, gridMaterial);
        scene.add(lineX);
        
        // Z-axis line
        const geometryZ = new THREE.BufferGeometry();
        const pointsZ = [
            new THREE.Vector3(position, -gridSize / 2, 0),
            new THREE.Vector3(position, gridSize / 2, 0)
        ];
        geometryZ.setFromPoints(pointsZ);
        const lineZ = new THREE.Line(geometryZ, gridMaterial);
        scene.add(lineZ);
    }
    
    // Create floating data nodes
    const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nodeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff2a6d,
        emissive: 0xff2a6d,
        emissiveIntensity: 0.5
    });
    
    const nodes = [];
    
    for (let i = 0; i < 50; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.set(
            (Math.random() - 0.5) * gridSize,
            (Math.random() - 0.5) * gridSize,
            (Math.random() - 0.5) * 5
        );
        node.material.color.setHSL(Math.random(), 0.8, 0.5);
        node.material.emissive.setHSL(Math.random(), 0.8, 0.5);
        node.userData = {
            pulseSpeed: Math.random() * 0.03 + 0.01,
            pulseMin: 0.7,
            pulseMax: 1.3,
            pulseDirection: 1,
            scale: 1
        };
        nodes.push(node);
        scene.add(node);
    }
    
    // Create data connections between random nodes
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x05d9e8,
        transparent: true,
        opacity: 0.3
    });
    
    const connections = [];
    
    for (let i = 0; i < 30; i++) {
        const node1 = nodes[Math.floor(Math.random() * nodes.length)];
        const node2 = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (node1 !== node2) {
            const geometry = new THREE.BufferGeometry();
            const points = [
                node1.position,
                node2.position
            ];
            geometry.setFromPoints(points);
            
            const line = new THREE.Line(geometry, connectionMaterial.clone());
            line.material.color.setHSL(Math.random(), 0.8, 0.5);
            connections.push({
                line: line,
                node1: node1,
                node2: node2,
                pulseSpeed: Math.random() * 0.05 + 0.02,
                pulseDirection: 1,
                opacity: 0.3
            });
            scene.add(line);
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate nodes (pulsing)
        nodes.forEach(node => {
            node.userData.scale += node.userData.pulseSpeed * node.userData.pulseDirection;
            
            if (node.userData.scale > node.userData.pulseMax) {
                node.userData.scale = node.userData.pulseMax;
                node.userData.pulseDirection = -1;
            } else if (node.userData.scale < node.userData.pulseMin) {
                node.userData.scale = node.userData.pulseMin;
                node.userData.pulseDirection = 1;
            }
            
            node.scale.set(node.userData.scale, node.userData.scale, node.userData.scale);
        });
        
        // Animate connections (pulsing opacity)
        connections.forEach(connection => {
            connection.opacity += connection.pulseSpeed * connection.pulseDirection;
            
            if (connection.opacity > 0.8) {
                connection.opacity = 0.8;
                connection.pulseDirection = -1;
            } else if (connection.opacity < 0.1) {
                connection.opacity = 0.1;
                connection.pulseDirection = 1;
            }
            
            connection.line.material.opacity = connection.opacity;
            
            // Update line positions to follow nodes
            const positions = connection.line.geometry.attributes.position;
            positions.setXYZ(0, connection.node1.position.x, connection.node1.position.y, connection.node1.position.z);
            positions.setXYZ(1, connection.node2.position.x, connection.node2.position.y, connection.node2.position.z);
            positions.needsUpdate = true;
        });
        
        // Rotate entire scene slowly
        scene.rotation.y += 0.002;
        scene.rotation.x += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function setupProductControls() {
    // Get control buttons
    const rotateLeft = document.getElementById('rotateLeft');
    const rotateRight = document.getElementById('rotateRight');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    
    if (!rotateLeft || !rotateRight || !zoomIn || !zoomOut) return;
    
    // Set up event listeners
    rotateLeft.addEventListener('click', () => {
        if (window.productModel) {
            window.productModel.rotation.y -= Math.PI / 6;
        }
    });
    
    rotateRight.addEventListener('click', () => {
        if (window.productModel) {
            window.productModel.rotation.y += Math.PI / 6;
        }
    });
    
    zoomIn.addEventListener('click', () => {
        if (window.productCamera) {
            window.productCamera.position.z = Math.max(2, window.productCamera.position.z - 0.5);
        }
    });
    
    zoomOut.addEventListener('click', () => {
        if (window.productCamera) {
            window.productCamera.position.z = Math.min(10, window.productCamera.position.z + 0.5);
        }
    });
}

// Function to update the product model based on the selected product
function updateProductModel(productId) {
    if (!window.productScene || !window.productModel) return;
    
    // Remove existing model
    window.productScene.remove(window.productModel);
    
    // Create new model based on product ID
    let newModel;
    
    switch (productId) {
        case 'neurolink':
            // Create NeuroLink X9 model
            const neurGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
            const neurMaterial = new THREE.MeshStandardMaterial({
                color: 0xff2a6d,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0xff2a6d,
                emissiveIntensity: 0.3
            });
            
            newModel = new THREE.Mesh(neurGeometry, neurMaterial);
            
            // Add details
            const detailGeometry1 = new THREE.TorusGeometry(0.6, 0.03, 16, 100);
            const detailMaterial1 = new THREE.MeshStandardMaterial({
                color: 0x05d9e8,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0x05d9e8,
                emissiveIntensity: 0.5
            });
            
            const detail1 = new THREE.Mesh(detailGeometry1, detailMaterial1);
            detail1.rotation.x = Math.PI / 2;
            newModel.add(detail1);
            
            const detailGeometry2 = new THREE.SphereGeometry(0.1, 16, 16);
            const detailMaterial2 = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0x05d9e8,
                emissiveIntensity: 0.5
            });
            
            const detail2 = new THREE.Mesh(detailGeometry2, detailMaterial2);
            detail2.position.y = 0.15;
            newModel.add(detail2);
            break;
            
        case 'holovisor':
            // Create HoloVisor Pro model
            const holoGeometry = new THREE.BoxGeometry(1.2, 0.5, 0.7);
            const holoMaterial = new THREE.MeshStandardMaterial({
                color: 0x05d9e8,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0x05d9e8,
                emissiveIntensity: 0.3
            });
            
            newModel = new THREE.Mesh(holoGeometry, holoMaterial);
            
            // Add details
            const lensGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
            const lensMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0xffffff,
                emissiveIntensity: 0.5
            });
            
            const lens1 = new THREE.Mesh(lensGeometry, lensMaterial);
            lens1.position.set(-0.25, 0, 0.36);
            lens1.rotation.x = Math.PI / 2;
            newModel.add(lens1);
            
            const lens2 = new THREE.Mesh(lensGeometry, lensMaterial);
            lens2.position.set(0.25, 0, 0.36);
            lens2.rotation.x = Math.PI / 2;
            newModel.add(lens2);
            break;
            
        case 'synthlimb':
            // Create SynthLimb Elite model
            const armGroup = new THREE.Group();
            
            const upperArmGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 16);
            const armMaterial = new THREE.MeshStandardMaterial({
                color: 0xd300c5,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0xd300c5,
                emissiveIntensity: 0.2
            });
            
            const upperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
            upperArm.position.y = 0.6;
            armGroup.add(upperArm);
            
            const elbowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
            const elbowMaterial = new THREE.MeshStandardMaterial({
                color: 0x999999,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const elbow = new THREE.Mesh(elbowGeometry, elbowMaterial);
            elbow.position.y = 0;
            armGroup.add(elbow);
            
            const forearmGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1.2, 16);
            const forearm = new THREE.Mesh(forearmGeometry, armMaterial);
            forearm.position.y = -0.6;
            armGroup.add(forearm);
            
            const handGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.2);
            const hand = new THREE.Mesh(handGeometry, armMaterial);
            hand.position.y = -1.3;
            armGroup.add(hand);
            
            // Fingers
            for (let i = 0; i < 5; i++) {
                const fingerGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.3, 8);
                const finger = new THREE.Mesh(fingerGeometry, armMaterial);
                finger.position.set((i - 2) * 0.07, -1.6, 0);
                finger.rotation.x = Math.PI / 2;
                armGroup.add(finger);
            }
            
            // Rotate the arm to display better
            armGroup.rotation.x = Math.PI / 4;
            
            newModel = armGroup;
            break;
            
        case 'nanodrone':
            // Create NanoDrone Swarm model
            const swarmGroup = new THREE.Group();
            
            // Create multiple small drones
            for (let i = 0; i < 30; i++) {
                const droneGeometry = new THREE.TetrahedronGeometry(0.1, 0);
                const droneMaterial = new THREE.MeshStandardMaterial({
                    color: 0xfee440,
                    metalness: 0.9,
                    roughness: 0.1,
                    emissive: 0xfee440,
                    emissiveIntensity: 0.5
                });
                
                const drone = new THREE.Mesh(droneGeometry, droneMaterial);
                
                // Position in a swarm pattern
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const radius = Math.random() * 1.5 + 0.5;
                
                drone.position.x = radius * Math.sin(phi) * Math.cos(theta);
                drone.position.y = radius * Math.sin(phi) * Math.sin(theta);
                drone.position.z = radius * Math.cos(phi);
                
                drone.rotation.x = Math.random() * Math.PI;
                drone.rotation.y = Math.random() * Math.PI;
                drone.rotation.z = Math.random() * Math.PI;
                
                drone.userData = {
                    orbitSpeed: (Math.random() * 0.02) + 0.01,
                    orbitRadius: radius,
                    orbitTheta: theta,
                    orbitPhi: phi
                };
                
                swarmGroup.add(drone);
            }
            
            // Animation function for the swarm
            swarmGroup.userData = {
                animate: function() {
                    swarmGroup.children.forEach(drone => {
                        drone.userData.orbitTheta += drone.userData.orbitSpeed;
                        
                        drone.position.x = drone.userData.orbitRadius * Math.sin(drone.userData.orbitPhi) * Math.cos(drone.userData.orbitTheta);
                        drone.position.y = drone.userData.orbitRadius * Math.sin(drone.userData.orbitPhi) * Math.sin(drone.userData.orbitTheta);
                        drone.position.z = drone.userData.orbitRadius * Math.cos(drone.userData.orbitPhi);
                        
                        drone.rotation.x += 0.01;
                        drone.rotation.y += 0.01;
                    });
                }
            };
            
            newModel = swarmGroup;
            break;
            
        default:
            // Default model if no match
            const defaultGeometry = new THREE.SphereGeometry(1, 32, 32);
            const defaultMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.5,
                roughness: 0.5
            });
            newModel = new THREE.Mesh(defaultGeometry, defaultMaterial);
            break;
    }
    
    // Add the new model to the scene
    window.productScene.add(newModel);
    window.productModel = newModel;
}

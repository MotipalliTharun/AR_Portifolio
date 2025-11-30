// Portfolio Models Configuration
const portfolioModels = {
    model1: {
        name: "3D Character Model",
        type: "box", // Can be 'box', 'sphere', 'gltf', or 'custom'
        color: 0x6366f1,
        size: { x: 0.5, y: 1, z: 0.5 },
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    model2: {
        name: "Architectural Design",
        type: "box",
        color: 0x8b5cf6,
        size: { x: 1, y: 1, z: 1 },
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    model3: {
        name: "Vehicle Model",
        type: "box",
        color: 0xec4899,
        size: { x: 1.5, y: 0.5, z: 0.8 },
        position: { x: 0, y: 0.25, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    model4: {
        name: "Art Sculpture",
        type: "sphere",
        color: 0x10b981,
        size: { radius: 0.5 },
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    model5: {
        name: "Product Design",
        type: "box",
        color: 0xf59e0b,
        size: { x: 0.6, y: 0.6, z: 0.6 },
        position: { x: 0, y: 0.3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    model6: {
        name: "Nature Scene",
        type: "box",
        color: 0x06b6d4,
        size: { x: 1, y: 0.3, z: 1 },
        position: { x: 0, y: 0.15, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    }
};

// Global AR variables
let arViewer = null;
let currentModel = null;
let currentModelData = null;
let scene = null;
let camera = null;
let renderer = null;
let arSystem = null;
let arSource = null;
let arToolkitContext = null;
let modelGroup = null;
let isRotating = false;
let modelScale = 1;

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// AR Modal Management
const arModal = document.getElementById('ar-modal');
const closeArBtn = document.querySelector('.close-ar-btn');
const viewArBtns = document.querySelectorAll('.view-ar-btn');

// Open AR Viewer
viewArBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectCard = btn.closest('.project-card');
        const modelId = projectCard.getAttribute('data-model');
        openARViewer(modelId);
    });
});

// Close AR Viewer
if (closeArBtn) {
    closeArBtn.addEventListener('click', () => {
        closeARViewer();
    });
}

if (arModal) {
    arModal.addEventListener('click', (e) => {
        if (e.target === arModal) {
            closeARViewer();
        }
    });
}

// Open AR Viewer Function
function openARViewer(modelId) {
    if (!arModal) return;
    
    currentModelData = portfolioModels[modelId];
    if (!currentModelData) return;
    
    arModal.style.display = 'flex';
    arModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize AR after a short delay to ensure modal is visible
    setTimeout(() => {
        initAR();
    }, 100);
}

// Close AR Viewer Function
function closeARViewer() {
    if (!arModal) return;
    
    arModal.style.display = 'none';
    arModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clean up AR resources
    cleanupAR();
}

// Initialize AR Experience
function initAR() {
    const arViewerElement = document.getElementById('ar-viewer');
    if (!arViewerElement) return;
    
    // Check for WebXR support first (better experience)
    if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported('immersive-ar').then(supported => {
            if (supported) {
                initWebXR();
            } else {
                initMarkerlessAR();
            }
        }).catch(() => {
            initMarkerlessAR();
        });
    } else {
        // Fallback to markerless AR simulation
        initMarkerlessAR();
    }
}

// Initialize WebXR (preferred method)
function initWebXR() {
    const arViewerElement = document.getElementById('ar-viewer');
    
    // Create Three.js scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(arViewerElement.clientWidth, arViewerElement.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    arViewerElement.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Create model group
    modelGroup = new THREE.Group();
    createModel(currentModelData);
    scene.add(modelGroup);
    
    // Request AR session
    navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking']
    }).then(session => {
        renderer.xr.setSession(session);
        session.addEventListener('end', cleanupAR);
        
        // Hide loading, show instructions
        const loading = arViewerElement.querySelector('.ar-loading');
        if (loading) loading.style.display = 'none';
        
        // Start render loop
        renderer.setAnimationLoop(() => {
            if (isRotating && modelGroup) {
                modelGroup.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        });
    }).catch(err => {
        console.log('WebXR not available, falling back to AR.js:', err);
        initARjs();
    });
}

// Initialize Markerless AR (using device camera)
function initMarkerlessAR() {
    const arViewerElement = document.getElementById('ar-viewer');
    
    // Create Three.js scene
    scene = new THREE.Scene();
    scene.background = null;
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        arViewerElement.clientWidth / arViewerElement.clientHeight,
        0.1,
        1000
    );
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(arViewerElement.clientWidth, arViewerElement.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    arViewerElement.appendChild(renderer.domElement);
    
    // Request camera access
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        } 
    }).then(stream => {
        // Create video element for camera feed
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        
        // Create video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        
        // Create plane for video background
        const videoPlane = new THREE.PlaneGeometry(2, 2);
        const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            side: THREE.DoubleSide
        });
        const videoMesh = new THREE.Mesh(videoPlane, videoMaterial);
        videoMesh.position.z = -1;
        scene.add(videoMesh);
        
        // Update camera aspect when video is ready
        video.addEventListener('loadedmetadata', () => {
            const aspect = video.videoWidth / video.videoHeight;
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            renderer.setSize(arViewerElement.clientWidth, arViewerElement.clientHeight);
        });
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Create model
        modelGroup = new THREE.Group();
        createModel(currentModelData);
        
        // Position model in front of camera (will be placed on tap)
        modelGroup.position.set(0, 0, -2);
        modelGroup.visible = false;
        scene.add(modelGroup);
        
        // Hide loading
        const loading = arViewerElement.querySelector('.ar-loading');
        if (loading) loading.style.display = 'none';
        
        // Place model on tap/click
        let modelPlaced = false;
        arViewerElement.addEventListener('click', (e) => {
            if (!modelPlaced) {
                // Calculate position based on click
                const rect = arViewerElement.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                
                // Raycast to place model
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
                
                // Place model at fixed distance
                const distance = 1.5;
                modelGroup.position.set(
                    x * distance,
                    y * distance,
                    -distance
                );
                modelGroup.visible = true;
                modelPlaced = true;
                
                // Update instructions
                const instructions = arViewerElement.querySelector('.ar-instructions');
                if (instructions) {
                    instructions.innerHTML = '<p>✅ Model placed! Use controls below to interact</p>';
                }
            }
        });
        
        // Store video stream for cleanup
        arSource = { stream, video };
        
        // Render loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (videoTexture) {
                videoTexture.needsUpdate = true;
            }
            
            if (isRotating && modelGroup && modelGroup.visible) {
                modelGroup.rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
    }).catch(err => {
        console.error('Error accessing camera:', err);
        const loading = arViewerElement.querySelector('.ar-loading');
        if (loading) {
            loading.innerHTML = `
                <p style="color: #ef4444;">⚠️ Camera access denied</p>
                <p style="font-size: 0.9rem; margin-top: 1rem;">Please allow camera access to use AR features</p>
            `;
        }
    });
}

// Create 3D Model
function createModel(modelData) {
    if (!modelData || !modelGroup) return;
    
    let geometry, material, mesh;
    
    switch (modelData.type) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(
                modelData.size.radius || 0.5,
                32,
                32
            );
            break;
        case 'box':
        default:
            geometry = new THREE.BoxGeometry(
                modelData.size.x || 1,
                modelData.size.y || 1,
                modelData.size.z || 1
            );
            break;
    }
    
    // Create material with gradient effect
    material = new THREE.MeshStandardMaterial({
        color: modelData.color || 0x6366f1,
        metalness: 0.7,
        roughness: 0.3,
        emissive: modelData.color || 0x6366f1,
        emissiveIntensity: 0.2
    });
    
    mesh = new THREE.Mesh(geometry, material);
    
    // Set position and rotation
    if (modelData.position) {
        mesh.position.set(
            modelData.position.x || 0,
            modelData.position.y || 0,
            modelData.position.z || 0
        );
    }
    
    if (modelData.rotation) {
        mesh.rotation.set(
            modelData.rotation.x || 0,
            modelData.rotation.y || 0,
            modelData.rotation.z || 0
        );
    }
    
    modelGroup.add(mesh);
    currentModel = mesh;
    
    // Add wireframe for visual interest
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(
        wireframe,
        new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
    );
    mesh.add(line);
}

// AR Controls
const rotateBtn = document.getElementById('rotate-btn');
const scaleBtn = document.getElementById('scale-btn');
const resetBtn = document.getElementById('reset-btn');

if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        isRotating = !isRotating;
        rotateBtn.textContent = isRotating ? '⏸️ Pause' : '🔄 Rotate';
    });
}

if (scaleBtn) {
    scaleBtn.addEventListener('click', () => {
        if (modelGroup) {
            modelScale = modelScale === 1 ? 1.5 : modelScale === 1.5 ? 0.5 : 1;
            modelGroup.scale.set(modelScale, modelScale, modelScale);
        }
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (modelGroup) {
            modelGroup.rotation.set(0, 0, 0);
            modelGroup.scale.set(1, 1, 1);
            modelGroup.position.set(0, 0, 0);
            isRotating = false;
            modelScale = 1;
            if (rotateBtn) rotateBtn.textContent = '🔄 Rotate';
        }
    });
}

// Cleanup AR resources
function cleanupAR() {
    if (renderer) {
        renderer.dispose();
        const canvas = renderer.domElement;
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    }
    
    if (scene) {
        scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
    
    if (arSource) {
        if (arSource.stream) {
            arSource.stream.getTracks().forEach(track => track.stop());
        }
        if (arSource.video) {
            arSource.video.srcObject = null;
        }
    }
    
    scene = null;
    camera = null;
    renderer = null;
    arSystem = null;
    arSource = null;
    arToolkitContext = null;
    modelGroup = null;
    currentModel = null;
    isRotating = false;
    modelScale = 1;
    
    // Show loading again
    const arViewerElement = document.getElementById('ar-viewer');
    if (arViewerElement) {
        const loading = arViewerElement.querySelector('.ar-loading');
        if (loading) loading.style.display = 'flex';
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (renderer && camera) {
        const arViewerElement = document.getElementById('ar-viewer');
        if (arViewerElement) {
            camera.aspect = arViewerElement.clientWidth / arViewerElement.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(arViewerElement.clientWidth, arViewerElement.clientHeight);
        }
    }
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(99, 102, 241, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Prevent default on touch devices for better AR experience
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.ar-viewer')) {
        e.preventDefault();
    }
}, { passive: false });

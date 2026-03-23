class InfinityGauntlet {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.gauntlet = null;
        this.stones = {};
        this.activeStones = new Set();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.settings = {
            autoRotate: true,
            audioVolume: 0.5,
            effectIntensity: 1.0
        };
        
        // Stone configurations - positioned exactly like the reference photo
        this.stoneConfigs = {
            mind: { color: 0xffdd00, position: new THREE.Vector3(0, 0.2, 0.4), power: 'mind_control', size: 0.18 }, // Largest, center of hand
            time: { color: 0x44ff44, position: new THREE.Vector3(-0.1, 0.1, 0.3), power: 'time_control', size: 0.12 }, // Thumb
            space: { color: 0x0066ff, position: new THREE.Vector3(-0.25, 0.2, 0.4), power: 'teleportation', size: 0.15 }, // Index finger
            power: { color: 0xaa44ff, position: new THREE.Vector3(0, 0.2, 0.4), power: 'destructive_force', size: 0.15 }, // Middle finger
            reality: { color: 0xff4444, position: new THREE.Vector3(0.25, 0.2, 0.4), power: 'matter_manipulation', size: 0.15 }, // Ring finger
            soul: { color: 0xff8844, position: new THREE.Vector3(0.1, 0.1, 0.3), power: 'soul_manipulation', size: 0.12 } // Pinky
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.createGauntlet();
        this.createStones();
        this.setupLighting();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Add fog for atmospheric effect
        this.scene.fog = new THREE.Fog(0x0a0a0a, 5, 20);
        
        // Camera - positioned for better viewing of the gauntlet
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(2, 1, 4);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = this.settings.autoRotate;
        this.controls.autoRotateSpeed = 0.5;
    }
    
    createGauntlet() {
        // Create gauntlet group
        this.gauntlet = new THREE.Group();
        
        // Create the exact replica based on reference photo
        this.createHandBase();
        this.createDetailedFingers();
        this.createOrnateWristGuard();
        this.createDecorativeElements();
        this.createStoneMounts();
        this.addWeatheringEffects();
        
        this.scene.add(this.gauntlet);
    }
    
    createHandBase() {
        // Create the main hand structure with proper proportions
        const palmGeometry = new THREE.BoxGeometry(1.4, 0.4, 0.9);
        const palmMaterial = new THREE.MeshStandardMaterial({
            color: 0xD4AF37, // Rich gold color
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 0.8
        });
        
        const palm = new THREE.Mesh(palmGeometry, palmMaterial);
        palm.position.set(0, 0, 0.2);
        palm.castShadow = true;
        palm.receiveShadow = true;
        this.gauntlet.add(palm);
        
        // Back of hand with curved surface
        const backGeometry = new THREE.BoxGeometry(1.6, 0.25, 1.0);
        const backMaterial = new THREE.MeshStandardMaterial({
            color: 0xE6C200, // Brighter gold
            metalness: 0.95,
            roughness: 0.15
        });
        
        const back = new THREE.Mesh(backGeometry, backMaterial);
        back.position.set(0, 0.15, 0.2);
        back.castShadow = true;
        this.gauntlet.add(back);
        
        // Add palm details
        this.addPalmDetails();
    }
    
    addPalmDetails() {
        // Add the intricate palm details from the reference
        const palmLines = [
            { start: [-0.4, 0, 0.1], end: [0.4, 0, 0.1] },
            { start: [-0.3, -0.1, 0.05], end: [0.3, -0.1, 0.05] },
            { start: [-0.2, -0.2, 0], end: [0.2, -0.2, 0] }
        ];
        
        palmLines.forEach(line => {
            const lineGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                line.start[0], line.start[1], line.start[2],
                line.end[0], line.end[1], line.end[2]
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x8B4513,
                linewidth: 2
            });
            
            const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
            this.gauntlet.add(lineMesh);
        });
    }
    
    createDetailedFingers() {
        // Create highly detailed finger segments with proper articulation
        const fingerData = [
            { name: 'thumb', segments: 3, startPos: [-0.5, 0.05, 0.2], angle: -0.4, length: 0.2 },
            { name: 'index', segments: 3, startPos: [-0.25, 0.2, 0.35], angle: -0.1, length: 0.25 },
            { name: 'middle', segments: 3, startPos: [0, 0.2, 0.35], angle: 0, length: 0.28 },
            { name: 'ring', segments: 3, startPos: [0.25, 0.2, 0.35], angle: 0.1, length: 0.25 },
            { name: 'pinky', segments: 3, startPos: [0.5, 0.05, 0.2], angle: 0.4, length: 0.2 }
        ];
        
        fingerData.forEach(finger => {
            for (let i = 0; i < finger.segments; i++) {
                const segmentLength = finger.length * (0.4 - i * 0.1);
                const segmentRadius = 0.08 - (i * 0.015);
                
                // Create more detailed segment geometry
                const segmentGeometry = new THREE.CylinderGeometry(
                    segmentRadius, 
                    segmentRadius * 1.05, 
                    segmentLength, 
                    16
                );
                const segmentMaterial = new THREE.MeshStandardMaterial({
                    color: 0xD4AF37,
                    metalness: 0.9,
                    roughness: 0.2,
                    envMapIntensity: 0.6
                });
                
                const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
                segment.position.set(
                    finger.startPos[0] + (i * 0.08),
                    finger.startPos[1] + (i * 0.12),
                    finger.startPos[2] + (i * 0.25)
                );
                segment.rotation.x = Math.PI / 2;
                segment.rotation.z = finger.angle;
                segment.castShadow = true;
                segment.receiveShadow = true;
                this.gauntlet.add(segment);
                
                // Add joint details
                if (i > 0) {
                    this.addJointDetails(segment.position, segmentRadius);
                }
            }
        });
    }
    
    addJointDetails(position, radius) {
        // Add joint articulation details
        const jointGeometry = new THREE.TorusGeometry(radius * 0.8, 0.01, 8, 16);
        const jointMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const joint = new THREE.Mesh(jointGeometry, jointMaterial);
        joint.position.copy(position);
        joint.rotation.x = Math.PI / 2;
        joint.castShadow = true;
        this.gauntlet.add(joint);
    }
    
    createOrnateWristGuard() {
        // Create the elaborate wrist guard with all decorative elements
        const wristGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.0, 20);
        const wristMaterial = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            metalness: 0.95,
            roughness: 0.15,
            envMapIntensity: 0.8
        });
        
        const wrist = new THREE.Mesh(wristGeometry, wristMaterial);
        wrist.position.set(0, 0, -0.4);
        wrist.rotation.x = Math.PI / 2;
        wrist.castShadow = true;
        wrist.receiveShadow = true;
        this.gauntlet.add(wrist);
        
        // Add all the ornate details
        this.addWristOrnaments();
        this.addWristEngravings();
        this.addWristTrim();
    }
    
    addWristOrnaments() {
        // Add the decorative ornaments from the reference photo
        const ornamentPositions = [
            { pos: [0, 0, -0.2], size: [0.3, 0.05, 0.1], rot: [0, 0, 0] },
            { pos: [-0.2, 0, -0.3], size: [0.15, 0.04, 0.08], rot: [0, 0, -0.2] },
            { pos: [0.2, 0, -0.3], size: [0.15, 0.04, 0.08], rot: [0, 0, 0.2] }
        ];
        
        ornamentPositions.forEach(ornament => {
            const ornamentGeometry = new THREE.BoxGeometry(ornament.size[0], ornament.size[1], ornament.size[2]);
            const ornamentMaterial = new THREE.MeshStandardMaterial({
                color: 0xE6C200,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const ornamentMesh = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
            ornamentMesh.position.set(ornament.pos[0], ornament.pos[1], ornament.pos[2]);
            ornamentMesh.rotation.set(ornament.rot[0], ornament.rot[1], ornament.rot[2]);
            ornamentMesh.castShadow = true;
            this.gauntlet.add(ornamentMesh);
        });
    }
    
    addWristEngravings() {
        // Add the intricate engravings from the reference
        const engravingLines = [
            { start: [-0.3, 0, -0.1], end: [0.3, 0, -0.1] },
            { start: [-0.2, 0, -0.2], end: [0.2, 0, -0.2] },
            { start: [-0.1, 0, -0.3], end: [0.1, 0, -0.3] }
        ];
        
        engravingLines.forEach(line => {
            const lineGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                line.start[0], line.start[1], line.start[2],
                line.end[0], line.end[1], line.end[2]
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x8B4513,
                linewidth: 1
            });
            
            const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
            this.gauntlet.add(lineMesh);
        });
    }
    
    addWristTrim() {
        // Add the decorative trim around the wrist guard
        const trimGeometry = new THREE.TorusGeometry(0.6, 0.02, 8, 32);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const trim = new THREE.Mesh(trimGeometry, trimMaterial);
        trim.position.set(0, 0, -0.4);
        trim.rotation.x = Math.PI / 2;
        trim.castShadow = true;
        this.gauntlet.add(trim);
    }
    
    createDecorativeElements() {
        // Add all the ornate decorative elements from the reference photo
        this.addArmorPlates();
        this.addRivetsAndBolts();
        this.addTribalEngravings();
        this.addEnergyConduits();
    }
    
    addArmorPlates() {
        // Add the overlapping armor plates with proper details
        const plateData = [
            { size: [0.4, 0.12, 0.5], pos: [0, 0.2, 0.15], rot: [0, 0, 0] },
            { size: [0.25, 0.1, 0.35], pos: [-0.35, 0.15, 0.1], rot: [0, 0, -0.15] },
            { size: [0.25, 0.1, 0.35], pos: [0.35, 0.15, 0.1], rot: [0, 0, 0.15] },
            { size: [0.2, 0.08, 0.3], pos: [-0.2, 0.1, 0.05], rot: [0, 0, -0.25] },
            { size: [0.2, 0.08, 0.3], pos: [0.2, 0.1, 0.05], rot: [0, 0, 0.25] }
        ];
        
        plateData.forEach(plate => {
            const armorGeometry = new THREE.BoxGeometry(plate.size[0], plate.size[1], plate.size[2]);
            const armorMaterial = new THREE.MeshStandardMaterial({
                color: 0xD4AF37,
                metalness: 0.9,
                roughness: 0.2,
                envMapIntensity: 0.7
            });
            
            const armor = new THREE.Mesh(armorGeometry, armorMaterial);
            armor.position.set(plate.pos[0], plate.pos[1], plate.pos[2]);
            armor.rotation.set(plate.rot[0], plate.rot[1], plate.rot[2]);
            armor.castShadow = true;
            armor.receiveShadow = true;
            this.gauntlet.add(armor);
        });
    }
    
    addRivetsAndBolts() {
        // Add all the rivets and bolts from the reference
        const rivetPositions = [
            [-0.4, 0.25, 0.1], [0.4, 0.25, 0.1],
            [-0.3, 0.2, 0.15], [0.3, 0.2, 0.15],
            [-0.2, 0.15, 0.1], [0.2, 0.15, 0.1],
            [0, 0.1, 0.05], [0, 0.3, 0.2],
            [-0.15, 0.05, 0], [0.15, 0.05, 0]
        ];
        
        rivetPositions.forEach(pos => {
            const rivetGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12);
            const rivetMaterial = new THREE.MeshStandardMaterial({
                color: 0x2F4F4F,
                metalness: 0.95,
                roughness: 0.05
            });
            
            const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
            rivet.position.set(pos[0], pos[1], pos[2]);
            rivet.rotation.x = Math.PI / 2;
            rivet.castShadow = true;
            this.gauntlet.add(rivet);
        });
    }
    
    addTribalEngravings() {
        // Add the tribal-like engravings from the reference photo
        const engravingData = [
            { pos: [0, 0.25, 0.15], size: [0.5, 0.03, 0.12], rot: [0, 0, 0] },
            { pos: [-0.3, 0.2, 0.1], size: [0.3, 0.02, 0.1], rot: [0, 0, -0.2] },
            { pos: [0.3, 0.2, 0.1], size: [0.3, 0.02, 0.1], rot: [0, 0, 0.2] },
            { pos: [-0.2, 0.15, 0.05], size: [0.2, 0.02, 0.08], rot: [0, 0, -0.3] },
            { pos: [0.2, 0.15, 0.05], size: [0.2, 0.02, 0.08], rot: [0, 0, 0.3] }
        ];
        
        engravingData.forEach(engraving => {
            const engravingGeometry = new THREE.BoxGeometry(engraving.size[0], engraving.size[1], engraving.size[2]);
            const engravingMaterial = new THREE.MeshStandardMaterial({
                color: 0x8B4513,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const engravingMesh = new THREE.Mesh(engravingGeometry, engravingMaterial);
            engravingMesh.position.set(engraving.pos[0], engraving.pos[1], engraving.pos[2]);
            engravingMesh.rotation.set(engraving.rot[0], engraving.rot[1], engraving.rot[2]);
            engravingMesh.castShadow = true;
            this.gauntlet.add(engravingMesh);
        });
    }
    
    addEnergyConduits() {
        // Add the energy conduits with subtle glow
        const conduitGeometry = new THREE.TorusGeometry(0.7, 0.03, 12, 24);
        const conduitMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x001100,
            emissiveIntensity: 0.1
        });
        
        const conduit = new THREE.Mesh(conduitGeometry, conduitMaterial);
        conduit.position.set(0, 0, 0.15);
        conduit.castShadow = true;
        this.gauntlet.add(conduit);
    }
    
    createStoneMounts() {
        // Create the ornate stone mounting settings exactly like the reference
        const mountData = [
            { pos: [0, 0.2, 0.4], size: 0.2, isMain: true }, // Mind Stone - largest, center
            { pos: [-0.1, 0.1, 0.3], size: 0.12, isMain: false }, // Time Stone - thumb
            { pos: [-0.25, 0.2, 0.4], size: 0.15, isMain: false }, // Space Stone - index
            { pos: [0, 0.2, 0.4], size: 0.15, isMain: false }, // Power Stone - middle
            { pos: [0.25, 0.2, 0.4], size: 0.15, isMain: false }, // Reality Stone - ring
            { pos: [0.1, 0.1, 0.3], size: 0.12, isMain: false } // Soul Stone - pinky
        ];
        
        mountData.forEach((mount, index) => {
            // Create the ornate bezel
            const bezelGeometry = new THREE.TorusGeometry(mount.size, 0.04, 12, 24);
            const bezelMaterial = new THREE.MeshStandardMaterial({
                color: 0x2F4F4F,
                metalness: 0.95,
                roughness: 0.05
            });
            
            const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
            bezel.position.set(mount.pos[0], mount.pos[1], mount.pos[2]);
            bezel.rotation.x = Math.PI / 2;
            bezel.castShadow = true;
            this.gauntlet.add(bezel);
            
            // Add decorative details around the setting
            this.addMountDetails(mount.pos, mount.size, mount.isMain);
        });
    }
    
    addMountDetails(pos, size, isMain) {
        // Add the ornate decorative details around stone mounts
        const detailCount = isMain ? 8 : 6;
        const detailSize = isMain ? 0.02 : 0.015;
        
        for (let i = 0; i < detailCount; i++) {
            const angle = (i / detailCount) * Math.PI * 2;
            const detailGeometry = new THREE.CylinderGeometry(detailSize, detailSize, 0.08, 8);
            const detailMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.95,
                roughness: 0.05
            });
            
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            detail.position.set(
                pos[0] + Math.cos(angle) * (size + 0.08),
                pos[1] + Math.sin(angle) * (size + 0.08),
                pos[2]
            );
            detail.rotation.z = angle;
            detail.castShadow = true;
            this.gauntlet.add(detail);
        }
        
        // Add radiating patterns for main stone
        if (isMain) {
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const patternGeometry = new THREE.BoxGeometry(0.15, 0.01, 0.03);
                const patternMaterial = new THREE.MeshStandardMaterial({
                    color: 0x8B4513,
            metalness: 0.9,
            roughness: 0.1
        });
        
                const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
                pattern.position.set(
                    pos[0] + Math.cos(angle) * 0.3,
                    pos[1] + Math.sin(angle) * 0.3,
                    pos[2]
                );
                pattern.rotation.z = angle;
                pattern.castShadow = true;
                this.gauntlet.add(pattern);
            }
        }
    }
    
    addWeatheringEffects() {
        // Add weathering and wear effects for realism
        this.addScratches();
        this.addWearPatterns();
        this.addPatina();
    }
    
    addScratches() {
        // Add subtle scratches and wear marks
        const scratchPositions = [
            { start: [-0.3, 0.1, 0.1], end: [-0.1, 0.15, 0.12] },
            { start: [0.1, 0.15, 0.12], end: [0.3, 0.1, 0.1] },
            { start: [-0.2, 0.05, 0.05], end: [0.2, 0.05, 0.05] }
        ];
        
        scratchPositions.forEach(scratch => {
            const scratchGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                scratch.start[0], scratch.start[1], scratch.start[2],
                scratch.end[0], scratch.end[1], scratch.end[2]
            ]);
            scratchGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const scratchMaterial = new THREE.LineBasicMaterial({
                color: 0x654321,
                linewidth: 1,
                transparent: true,
                opacity: 0.3
            });
            
            const scratchLine = new THREE.Line(scratchGeometry, scratchMaterial);
            this.gauntlet.add(scratchLine);
        });
    }
    
    addWearPatterns() {
        // Add wear patterns on high-contact areas
        const wearAreas = [
            { pos: [0, 0.1, 0.1], size: [0.2, 0.05, 0.1] },
            { pos: [-0.2, 0.15, 0.15], size: [0.1, 0.03, 0.08] },
            { pos: [0.2, 0.15, 0.15], size: [0.1, 0.03, 0.08] }
        ];
        
        wearAreas.forEach(area => {
            const wearGeometry = new THREE.BoxGeometry(area.size[0], area.size[1], area.size[2]);
            const wearMaterial = new THREE.MeshStandardMaterial({
                color: 0x8B4513,
            metalness: 0.8,
                roughness: 0.6,
                transparent: true,
                opacity: 0.4
            });
            
            const wear = new THREE.Mesh(wearGeometry, wearMaterial);
            wear.position.set(area.pos[0], area.pos[1], area.pos[2]);
            wear.castShadow = true;
            this.gauntlet.add(wear);
        });
    }
    
    addPatina() {
        // Add subtle patina effects
        const patinaGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const patinaMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B7355,
            metalness: 0.3,
            roughness: 0.8,
            transparent: true,
            opacity: 0.1
        });
        
        const patina = new THREE.Mesh(patinaGeometry, patinaMaterial);
        patina.position.set(0, 0, 0.1);
        this.gauntlet.add(patina);
    }
    
    addRivets() {
        const rivetPositions = [
            [-0.3, 0.2, 0.1], [0.3, 0.2, 0.1],
            [-0.2, 0.4, 0.2], [0.2, 0.4, 0.2],
            [0, 0.1, -0.2], [0, 0.3, 0.3],
            [-0.1, 0.15, 0.05], [0.1, 0.15, 0.05]
        ];
        
        rivetPositions.forEach(pos => {
            const rivetGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8);
            const rivetMaterial = new THREE.MeshStandardMaterial({
                color: 0x2F4F4F,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
            rivet.position.set(pos[0], pos[1], pos[2]);
            rivet.rotation.x = Math.PI / 2;
            rivet.castShadow = true;
            this.gauntlet.add(rivet);
        });
    }
    
    addDecorativePatterns() {
        // Add the tribal-like engravings from the reference photo
        const patternPositions = [
            { pos: [0, 0.2, 0.1], size: [0.4, 0.02, 0.1], rot: [0, 0, 0] },
            { pos: [-0.2, 0.15, 0.05], size: [0.2, 0.02, 0.08], rot: [0, 0, -0.2] },
            { pos: [0.2, 0.15, 0.05], size: [0.2, 0.02, 0.08], rot: [0, 0, 0.2] }
        ];
        
        patternPositions.forEach(pattern => {
            const patternGeometry = new THREE.BoxGeometry(pattern.size[0], pattern.size[1], pattern.size[2]);
            const patternMaterial = new THREE.MeshStandardMaterial({
                color: 0x8B4513,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const patternMesh = new THREE.Mesh(patternGeometry, patternMaterial);
            patternMesh.position.set(pattern.pos[0], pattern.pos[1], pattern.pos[2]);
            patternMesh.rotation.set(pattern.rot[0], pattern.rot[1], pattern.rot[2]);
            patternMesh.castShadow = true;
            this.gauntlet.add(patternMesh);
        });
    }
    
    addEnergyConduits() {
        // Add subtle energy conduits
        const conduitGeometry = new THREE.TorusGeometry(0.6, 0.02, 8, 16);
        const conduitMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x001100,
            emissiveIntensity: 0.05
        });
        
        const conduit = new THREE.Mesh(conduitGeometry, conduitMaterial);
        conduit.position.set(0, 0, 0.1);
        conduit.castShadow = true;
        this.gauntlet.add(conduit);
    }
    
    createStoneSettings() {
        // Create the ornate settings for the stones
        const settingPositions = [
            { pos: [-0.2, 0.2, 0.4], size: 0.15 }, // Index finger
            { pos: [0, 0.2, 0.4], size: 0.18 },    // Middle finger (largest)
            { pos: [0.2, 0.2, 0.4], size: 0.15 }, // Ring finger
            { pos: [-0.1, 0.1, 0.3], size: 0.12 }, // Thumb
            { pos: [0.1, 0.1, 0.3], size: 0.12 },  // Pinky
            { pos: [0, 0.05, 0.2], size: 0.12 }    // Palm center
        ];
        
        settingPositions.forEach((setting, index) => {
            // Create the ornate bezel
            const bezelGeometry = new THREE.TorusGeometry(setting.size, 0.03, 8, 16);
            const bezelMaterial = new THREE.MeshStandardMaterial({
                color: 0x2F4F4F,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
            bezel.position.set(setting.pos[0], setting.pos[1], setting.pos[2]);
            bezel.rotation.x = Math.PI / 2;
            bezel.castShadow = true;
            this.gauntlet.add(bezel);
            
            // Add decorative details around the setting
            this.addSettingDetails(setting.pos, setting.size);
        });
    }
    
    addSettingDetails(pos, size) {
        // Add decorative details around stone settings
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const detailGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.05, 8);
            const detailMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.9,
                roughness: 0.1
            });
            
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            detail.position.set(
                pos[0] + Math.cos(angle) * (size + 0.05),
                pos[1] + Math.sin(angle) * (size + 0.05),
                pos[2]
            );
            detail.rotation.z = angle;
            detail.castShadow = true;
            this.gauntlet.add(detail);
        }
    }
    
    createStones() {
        Object.keys(this.stoneConfigs).forEach(stoneName => {
            const config = this.stoneConfigs[stoneName];
            
            // Create stone geometry with exact sizes from config
            const stoneGeometry = new THREE.SphereGeometry(config.size, 32, 24);
            const stoneMaterial = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.color,
                emissiveIntensity: 0.4,
                metalness: 0.2,
                roughness: 0.05,
                transparent: true,
                opacity: 0.98,
                envMapIntensity: 0.8
            });
            
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            stone.position.copy(config.position);
            stone.userData = { stoneName, power: config.power };
            stone.castShadow = true;
            stone.receiveShadow = true;
            
            // Add enhanced glow effect
            this.addStoneGlow(stone, config.color, config.size);
            
            this.stones[stoneName] = stone;
            this.gauntlet.add(stone);
        });
    }
    
    
    addStoneGlow(stone, color, size) {
        // Create glow effect proportional to stone size
        const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        stone.add(glow);
        
        // Store glow reference for animation
        stone.userData.glow = glow;
    }
    
    setupLighting() {
        // Ambient light - reduced for more dramatic lighting
        const ambientLight = new THREE.AmbientLight(0x202020, 0.2);
        this.scene.add(ambientLight);
        
        // Main directional light - positioned to highlight the gauntlet
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(3, 3, 3);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Fill light from the opposite side
        const fillLight = new THREE.DirectionalLight(0x4444ff, 0.3);
        fillLight.position.set(-2, 1, -2);
        this.scene.add(fillLight);
        
        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0xffaa44, 0.4);
        rimLight.position.set(0, -2, 2);
        this.scene.add(rimLight);
        
        // Point lights for each stone - will be added after stones are created
        this.setupStoneLights();
    }
    
    setupStoneLights() {
        Object.keys(this.stoneConfigs).forEach(stoneName => {
            const config = this.stoneConfigs[stoneName];
            
            const pointLight = new THREE.PointLight(config.color, 0.8, 3);
            pointLight.position.copy(config.position);
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = 1024;
            pointLight.shadow.mapSize.height = 1024;
            this.scene.add(pointLight);
            
            // Store light reference for animation
            if (this.stones[stoneName]) {
                this.stones[stoneName].userData.light = pointLight;
            }
        });
    }
    
    setupControls() {
        // Mouse controls for stone interaction
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });
        
        // UI controls
        document.querySelectorAll('.stone-toggle').forEach(toggle => {
            toggle.addEventListener('click', (event) => {
                const stoneName = event.target.dataset.stone;
                this.toggleStone(stoneName);
            });
        });
        
        document.getElementById('snap-button').addEventListener('click', () => {
            this.performSnap();
        });
        
        // Settings panel controls
        document.getElementById('auto-rotate').addEventListener('change', (e) => {
            this.settings.autoRotate = e.target.checked;
            this.controls.autoRotate = this.settings.autoRotate;
        });
        
        document.getElementById('audio-volume').addEventListener('input', (e) => {
            this.settings.audioVolume = parseFloat(e.target.value);
        });
        
        document.getElementById('effect-intensity').addEventListener('input', (e) => {
            this.settings.effectIntensity = parseFloat(e.target.value);
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(
            Object.values(this.stones), true
        );
        
        if (intersects.length > 0) {
            const stone = intersects[0].object;
            const stoneName = stone.userData.stoneName;
            this.activateStone(stoneName);
        }
    }
    
    toggleStone(stoneName) {
        const toggle = document.querySelector(`[data-stone="${stoneName}"]`);
        const stone = this.stones[stoneName];
        
        if (this.activeStones.has(stoneName)) {
            this.activeStones.delete(stoneName);
            toggle.classList.remove('active');
            stone.userData.light.intensity = 0;
        } else {
            this.activeStones.add(stoneName);
            toggle.classList.add('active');
            stone.userData.light.intensity = 0.5;
        }
    }
    
    activateStone(stoneName) {
        const stone = this.stones[stoneName];
        const config = this.stoneConfigs[stoneName];
        
        // Visual effect
        this.triggerStoneEffect(stoneName, config.power);
        
        // Audio feedback
        this.playStoneSound(stoneName);
        
        // Light up the stone
        stone.userData.light.intensity = 1.0;
        setTimeout(() => {
            stone.userData.light.intensity = 0.5;
        }, 500);
    }
    
    triggerStoneEffect(stoneName, power) {
        switch (power) {
            case 'teleportation':
                this.createPortalEffect();
                break;
            case 'mind_control':
                this.createMindControlEffect();
                break;
            case 'matter_manipulation':
                this.createRealityWarpEffect();
                break;
            case 'destructive_force':
                this.createShockwaveEffect();
                break;
            case 'time_control':
                this.createTimeEffect();
                break;
            case 'soul_manipulation':
                this.createSoulEffect();
                break;
        }
    }
    
    createPortalEffect() {
        // Create portal-like particle effect
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x0066ff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles
        const animate = () => {
            particleSystem.rotation.y += 0.01;
            particleSystem.rotation.x += 0.005;
            
            if (particleSystem.material.opacity > 0) {
                particleSystem.material.opacity -= 0.01;
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particleSystem);
            }
        };
        animate();
    }
    
    createMindControlEffect() {
        // Create telepathic ping effect
        const ringGeometry = new THREE.RingGeometry(0.5, 2, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd00,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(this.stones.mind.position);
        this.scene.add(ring);
        
        // Animate ring expansion
        const animate = () => {
            ring.scale.multiplyScalar(1.1);
            ring.material.opacity -= 0.05;
            
            if (ring.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(ring);
            }
        };
        animate();
    }
    
    createRealityWarpEffect() {
        // Create reality distortion effect
        const distortionGeometry = new THREE.PlaneGeometry(10, 10);
        const distortionMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const distortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
        distortion.position.z = -2;
        this.scene.add(distortion);
        
        // Animate distortion
        const animate = () => {
            distortion.rotation.z += 0.1;
            distortion.material.opacity -= 0.02;
            
            if (distortion.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(distortion);
            }
        };
        animate();
    }
    
    createShockwaveEffect() {
        // Create shockwave effect
        const shockwaveGeometry = new THREE.RingGeometry(0.1, 3, 32);
        const shockwaveMaterial = new THREE.MeshBasicMaterial({
            color: 0xaa44ff,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
        shockwave.position.copy(this.stones.power.position);
        this.scene.add(shockwave);
        
        // Animate shockwave
        const animate = () => {
            shockwave.scale.multiplyScalar(1.2);
            shockwave.material.opacity -= 0.05;
            
            if (shockwave.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(shockwave);
            }
        };
        animate();
    }
    
    createTimeEffect() {
        // Create time rewind effect
        const timeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const timeMaterial = new THREE.MeshBasicMaterial({
            color: 0x44ff44,
            transparent: true,
            opacity: 0.8
        });
        
        const timeSpheres = [];
        for (let i = 0; i < 20; i++) {
            const sphere = new THREE.Mesh(timeGeometry, timeMaterial);
            sphere.position.set(
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                Math.random() * 4 - 2
            );
            this.scene.add(sphere);
            timeSpheres.push(sphere);
        }
        
        // Animate time spheres
        const animate = () => {
            timeSpheres.forEach((sphere, index) => {
                sphere.rotation.y += 0.1;
                sphere.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
                sphere.material.opacity -= 0.02;
            });
            
            if (timeSpheres[0].material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                timeSpheres.forEach(sphere => this.scene.remove(sphere));
            }
        };
        animate();
    }
    
    createSoulEffect() {
        // Create soul realm effect
        const soulGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const soulMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8844,
            transparent: true,
            opacity: 0.6
        });
        
        const soulParticles = [];
        for (let i = 0; i < 50; i++) {
            const particle = new THREE.Mesh(soulGeometry, soulMaterial);
            particle.position.set(
                Math.random() * 6 - 3,
                Math.random() * 6 - 3,
                Math.random() * 6 - 3
            );
            this.scene.add(particle);
            soulParticles.push(particle);
        }
        
        // Animate soul particles
        const animate = () => {
            soulParticles.forEach((particle, index) => {
                particle.position.y += Math.sin(Date.now() * 0.002 + index) * 0.02;
                particle.rotation.x += 0.05;
                particle.rotation.y += 0.05;
                particle.material.opacity -= 0.01;
            });
            
            if (soulParticles[0].material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                soulParticles.forEach(particle => this.scene.remove(particle));
            }
        };
        animate();
    }
    
    performSnap() {
        // Disable auto-rotation during snap
        this.controls.autoRotate = false;
        
        // Animate gauntlet snap gesture
        this.animateSnapGesture();
        
        // Trigger full-screen effect
        this.createSnapEffect();
        
        // Play snap sound
        this.playSnapSound();
        
        // Re-enable auto-rotation after effect
        setTimeout(() => {
            this.controls.autoRotate = true;
        }, 3000);
    }
    
    animateSnapGesture() {
        const startRotation = this.gauntlet.rotation.clone();
        const snapRotation = startRotation.clone();
        snapRotation.z += Math.PI / 4;
        
        // Animate to snap position
        const animateToSnap = () => {
            this.gauntlet.rotation.lerp(snapRotation, 0.1);
            if (this.gauntlet.rotation.z < snapRotation.z - 0.01) {
                requestAnimationFrame(animateToSnap);
            } else {
                // Return to original position
                const animateBack = () => {
                    this.gauntlet.rotation.lerp(startRotation, 0.1);
                    if (this.gauntlet.rotation.z > startRotation.z + 0.01) {
                        requestAnimationFrame(animateBack);
                    }
                };
                setTimeout(animateBack, 500);
            }
        };
        animateToSnap();
    }
    
    createSnapEffect() {
        // Create full-screen particle explosion
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Random positions
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            // Random colors (infinity stone colors)
            const stoneColors = [0x0066ff, 0xffdd00, 0xff4444, 0xaa44ff, 0x44ff44, 0xff8844];
            const color = new THREE.Color(stoneColors[Math.floor(Math.random() * stoneColors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1.0
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles
        const animate = () => {
            particleSystem.rotation.x += 0.01;
            particleSystem.rotation.y += 0.01;
            particleSystem.material.opacity -= 0.01;
            
            if (particleSystem.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particleSystem);
            }
        };
        animate();
    }
    
    playStoneSound(stoneName) {
        // Create audio context for stone sounds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different stones
        const frequencies = {
            space: 440,
            mind: 523,
            reality: 659,
            power: 784,
            time: 880,
            soul: 1047
        };
        
        oscillator.frequency.setValueAtTime(frequencies[stoneName], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1 * this.settings.audioVolume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.settings.audioVolume, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    playSnapSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3 * this.settings.audioVolume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.settings.audioVolume, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Animate stone glows
        Object.values(this.stones).forEach(stone => {
            if (stone.userData.glow) {
                stone.userData.glow.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.1);
                stone.userData.glow.material.opacity = 0.3 + Math.sin(elapsedTime * 3) * 0.1;
            }
        });
        
        // Update controls
        this.controls.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the Infinity Gauntlet when the page loads
window.addEventListener('load', () => {
    new InfinityGauntlet();
});

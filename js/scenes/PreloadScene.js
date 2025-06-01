class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Set up loading bar
        this.setupLoadingBar();
        
        // Try to load assets, but handle missing files gracefully
        this.handleAssetLoading();
    }
    
    setupLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Add loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5);
        
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);
        
        // Register progress event
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 10);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
    
    handleAssetLoading() {
        // Set up error handling for missing files
        this.load.on('loaderror', (fileObj) => {
            console.log('Error loading asset:', fileObj.key);
            // We'll create placeholder assets in create() for any missing files
        });
        
        // Try to load external assets (these might not exist yet)
        this.load.path = 'assets/';
        
        // UI assets
        this.load.image('background', 'images/background.png');
        this.load.image('logo', 'images/logo.png');
        this.load.image('button', 'images/button.png');
        
        // Audio - we'll use silent audio if these don't exist
        this.load.audio('bgm', 'audio/background_music.mp3');
        this.load.audio('collect', 'audio/collect.wav');
        this.load.audio('button_click', 'audio/button_click.wav');
    }

    create() {
        // Create placeholder assets
        this.createPlaceholderAssets();
        
        // Create placeholder audio
        this.createPlaceholderAudio();
        
        // Start with the menu scene
        this.scene.start('MenuScene');
    }
    
    createPlaceholderAssets() {
        // Create placeholder background if not loaded
        if (!this.textures.exists('background')) {
            const bgGraphics = this.add.graphics();
            bgGraphics.fillStyle(0x2c3e50);
            bgGraphics.fillRect(0, 0, 800, 600);
            
            // Add some design elements
            bgGraphics.fillStyle(0x3498db);
            bgGraphics.fillRect(0, 0, 800, 80);
            bgGraphics.fillRect(0, 520, 800, 80);
            
            // Create texture from the graphics
            bgGraphics.generateTexture('background', 800, 600);
            bgGraphics.clear();
        }
        
        // Create placeholder button if not loaded
        if (!this.textures.exists('button')) {
            const buttonGraphics = this.add.graphics();
            buttonGraphics.fillStyle(0x3498db);
            buttonGraphics.fillRect(0, 0, 200, 50);
            buttonGraphics.fillStyle(0x2980b9);
            buttonGraphics.fillRect(5, 5, 190, 40);
            
            // Create texture from the graphics
            buttonGraphics.generateTexture('button', 200, 50);
            buttonGraphics.clear();
        }
        
        // Create placeholder logo if not loaded
        if (!this.textures.exists('logo')) {
            const logoGraphics = this.add.graphics();
            logoGraphics.fillStyle(0xecf0f1);
            logoGraphics.fillRect(0, 0, 400, 100);
            logoGraphics.fillStyle(0x2c3e50);
            logoGraphics.fillRect(10, 10, 380, 80);
            
            // Add text to logo
            const logoText = this.add.text(200, 50, 'DevCollect', {
                font: 'bold 36px Arial',
                fill: '#ecf0f1'
            });
            logoText.setOrigin(0.5);
            
            // Create texture from the graphics
            logoGraphics.generateTexture('logo', 400, 100);
            logoGraphics.clear();
        }
    }
    
    createPlaceholderAudio() {
        // Create silent audio for any missing audio files
        const audioKeys = ['bgm', 'collect', 'button_click'];
        
        audioKeys.forEach(key => {
            if (!this.cache.audio.exists(key)) {
                // Create a silent audio context
                const audioContext = this.sound.context;
                if (audioContext) {
                    const buffer = audioContext.createBuffer(1, 1, 22050);
                    const source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    
                    // Add to cache
                    this.cache.audio.add(key, buffer);
                    console.log(`Created placeholder silent audio for: ${key}`);
                }
            }
        });
    }
}

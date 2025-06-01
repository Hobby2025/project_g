class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load loading screen assets
        this.load.image('loading-background', 'assets/images/loading-background.png');
        
        // Create loading bar
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

    create() {
        this.scene.start('PreloadScene');
    }
}

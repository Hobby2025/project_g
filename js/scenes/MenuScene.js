class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');
        
        // Add logo
        const logo = this.add.image(400, 150, 'logo');
        logo.setScale(1.2);
        
        // Add menu buttons
        this.createButton(400, 300, 'Start Game', () => {
            this.scene.start('GameScene');
        });
        
        this.createButton(400, 370, 'Collection', () => {
            this.scene.start('CollectionScene');
        });
        
        this.createButton(400, 440, 'About', () => {
            this.showAboutPopup();
        });
        
        // Add background music if not already playing
        if (!this.sound.get('bgm')) {
            const music = this.sound.add('bgm', {
                volume: 0.5,
                loop: true
            });
            music.play();
        }
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.image(x, y, 'button');
        button.setInteractive();
        
        const buttonText = this.add.text(x, y, text, {
            font: '24px Arial',
            fill: '#ffffff'
        });
        buttonText.setOrigin(0.5);
        
        button.on('pointerdown', () => {
            this.sound.play('button_click');
            callback();
        });
        
        button.on('pointerover', () => {
            button.setTint(0xcccccc);
        });
        
        button.on('pointerout', () => {
            button.clearTint();
        });
        
        return { button, text: buttonText };
    }
    
    showAboutPopup() {
        // Create a semi-transparent background
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        overlay.setInteractive();
        
        // Create popup
        const popup = this.add.rectangle(400, 300, 600, 400, 0x2c3e50);
        
        // Add title
        const title = this.add.text(400, 150, 'About DevCollect', {
            font: 'bold 32px Arial',
            fill: '#ffffff'
        });
        title.setOrigin(0.5);
        
        // Add description
        const description = this.add.text(400, 250, 
            'DevCollect is a fun collection game where you\n' +
            'collect programming language characters by\n' +
            'making contributions like commits and PRs.\n\n' +
            'Each language has unique attributes and abilities.\n\n' +
            'Collect them all and become a master developer!', {
            font: '20px Arial',
            fill: '#ffffff',
            align: 'center'
        });
        description.setOrigin(0.5);
        
        // Add close button
        const closeButton = this.createButton(400, 400, 'Close', () => {
            overlay.destroy();
            popup.destroy();
            title.destroy();
            description.destroy();
            closeButton.button.destroy();
            closeButton.text.destroy();
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');
        
        // Add header
        this.add.rectangle(400, 40, 800, 80, 0x34495e);
        this.add.text(20, 20, 'DevCollect - Contribution Simulator', {
            font: 'bold 24px Arial',
            fill: '#ffffff'
        });
        
        // Initialize character factory
        this.characterFactory = new CharacterFactory(this);
        
        // Initialize game variables
        this.contributions = 0;
        this.contributionText = this.add.text(20, 60, `Contributions: ${this.contributions}`, {
            font: '18px Arial',
            fill: '#ffffff'
        });
        
        // Create contribution buttons
        this.createContributionButtons();
        
        // Create character display area
        this.createCharacterDisplay();
        
        // Create collection button
        this.createButton(700, 550, 'Collection', () => {
            this.scene.start('CollectionScene');
        });
        
        // Create back button
        this.createButton(100, 550, 'Back to Menu', () => {
            this.scene.start('MenuScene');
        });
        
        // Initialize pending spawns array for character animations
        this.pendingSpawns = [];
        
        // Timer for spawning characters
        this.waveSpawnTimer = 0;
        
        // Listen for spawn events
        this.events.on('spawn_character', this.spawnCharacter, this);
    }
    
    update(time, delta) {
        // Update spawn timer
        if (this.pendingSpawns.length > 0 && this.waveSpawnTimer <= 0) {
            const spawn = this.pendingSpawns.shift();
            this.spawnCharacter(spawn.character, spawn.x, spawn.y);
            
            // Set timer for next spawn based on delay
            // Make sure we properly convert milliseconds to game time
            this.waveSpawnTimer = spawn.delay;
        } else if (this.waveSpawnTimer > 0) {
            this.waveSpawnTimer -= delta;
        }
    }
    
    createContributionButtons() {
        const types = [
            { name: 'Commit Code', type: 'commit' },
            { name: 'Create PR', type: 'pull_request' },
            { name: 'Report Issue', type: 'issue' },
            { name: 'Review Code', type: 'code_review' }
        ];
        
        const startY = 150;
        const spacing = 70;
        
        types.forEach((item, index) => {
            const button = this.createButton(400, startY + (spacing * index), item.name, () => {
                this.makeContribution(item.type);
            });
        });
    }
    
    createCharacterDisplay() {
        // Create a display area for collected characters
        this.characterDisplayArea = this.add.container(600, 300);
        
        // Add background for the display area
        const displayBg = this.add.rectangle(0, 0, 300, 300, 0x2c3e50, 0.7);
        this.characterDisplayArea.add(displayBg);
        
        // Add title
        const title = this.add.text(0, -130, 'Recent Collection', {
            font: 'bold 18px Arial',
            fill: '#ffffff'
        });
        title.setOrigin(0.5);
        this.characterDisplayArea.add(title);
    }
    
    makeContribution(type) {
        // Increment contribution counter
        this.contributions++;
        this.contributionText.setText(`Contributions: ${this.contributions}`);
        
        // Get a character based on contribution type
        const character = this.characterFactory.getCharacterByContribution(type);
        
        // Add to global collection if not already collected
        if (!game.globals.collectedCharacters.some(c => c.name === character.name)) {
            game.globals.collectedCharacters.push(character);
            character.unlock();
        }
        
        // Display animation of collecting the character
        this.showCollectionAnimation(character);
        
        // Play collection sound
        this.sound.play('collect');
    }
    
    showCollectionAnimation(character) {
        // Generate random position for character to appear
        const randomX = Phaser.Math.Between(100, 500);
        const randomY = Phaser.Math.Between(100, 400);
        
        // Use Phaser's time events for more reliable timing
        // This is an alternative approach to the pendingSpawns array
        this.time.addEvent({
            delay: 500, // 500ms delay
            callback: () => {
                this.spawnCharacter(character, randomX, randomY);
            },
            callbackScope: this
        });
        
        // We'll keep the pendingSpawns approach as an alternative
        // This demonstrates two different ways to handle delayed spawning
        this.pendingSpawns.push({
            character: character,
            x: Phaser.Math.Between(100, 500), // Different position for variety
            y: Phaser.Math.Between(100, 400),
            delay: 1000 // 1000ms delay for the second approach
        });
    }
    
    spawnCharacter(character, x, y) {
        // Create a container for the character
        const container = this.add.container(x, y);
        
        // Render the pixel art character
        const charGraphics = character.renderPixelArt(this, 0, 0, 3);
        container.add(charGraphics);
        
        // Add name label
        const nameLabel = this.add.text(0, 30, character.name, {
            font: '16px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000'
        });
        nameLabel.setOrigin(0.5);
        container.add(nameLabel);
        
        // Add animation
        this.tweens.add({
            targets: container,
            y: y - 50,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            onComplete: () => {
                container.destroy();
            }
        });
        
        // Update character display
        this.updateCharacterDisplay(character);
    }
    
    updateCharacterDisplay(character) {
        // Clear previous display
        const displayItems = this.characterDisplayArea.getAll();
        for (let i = 2; i < displayItems.length; i++) {
            displayItems[i].destroy();
        }
        
        // Get last 3 collected characters
        const recentCharacters = game.globals.collectedCharacters.slice(-3);
        
        // Display characters
        recentCharacters.forEach((char, index) => {
            const yPos = -50 + (index * 70);
            
            // Render character
            const charGraphics = char.renderPixelArt(this, -70, yPos, 2);
            this.characterDisplayArea.add(charGraphics);
            
            // Add name and info
            const nameText = this.add.text(0, yPos, char.name, {
                font: 'bold 16px Arial',
                fill: '#ffffff'
            });
            nameText.setOrigin(0, 0.5);
            this.characterDisplayArea.add(nameText);
            
            // Add rarity
            const rarityText = this.add.text(0, yPos + 20, `Rarity: ${char.rarity}`, {
                font: '12px Arial',
                fill: '#cccccc'
            });
            rarityText.setOrigin(0, 0.5);
            this.characterDisplayArea.add(rarityText);
        });
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.image(x, y, 'button');
        button.setInteractive();
        
        const buttonText = this.add.text(x, y, text, {
            font: '18px Arial',
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
}

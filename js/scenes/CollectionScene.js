class CollectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CollectionScene' });
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');
        
        // Add header
        this.add.rectangle(400, 40, 800, 80, 0x34495e);
        this.add.text(20, 20, 'Your Programming Language Collection', {
            font: 'bold 24px Arial',
            fill: '#ffffff'
        });
        
        // Initialize character factory if not already done
        if (!this.characterFactory) {
            this.characterFactory = new CharacterFactory(this);
        }
        
        // Create back button
        this.createButton(100, 550, 'Back to Game', () => {
            this.scene.start('GameScene');
        });
        
        // Create menu button
        this.createButton(700, 550, 'Main Menu', () => {
            this.scene.start('MenuScene');
        });
        
        // Display collection
        this.displayCollection();
        
        // Add pagination if needed
        this.currentPage = 0;
        this.itemsPerPage = 8;
        this.updatePagination();
    }
    
    displayCollection() {
        // Clear any existing display
        if (this.collectionContainer) {
            this.collectionContainer.destroy();
        }
        
        // Create a container for the collection
        this.collectionContainer = this.add.container(0, 0);
        
        // Get all characters
        const allCharacters = this.characterFactory.getAllCharacters();
        
        // Calculate start and end indices for pagination
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, allCharacters.length);
        
        // Display characters for current page
        const charactersToShow = allCharacters.slice(startIndex, endIndex);
        
        // Calculate grid layout
        const itemsPerRow = 4;
        const startX = 150;
        const startY = 130;
        const xSpacing = 180;
        const ySpacing = 200;
        
        // Display each character
        charactersToShow.forEach((character, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            
            const x = startX + (col * xSpacing);
            const y = startY + (row * ySpacing);
            
            this.createCharacterCard(x, y, character);
        });
    }
    
    createCharacterCard(x, y, character) {
        // Create card container
        const card = this.add.container(x, y);
        this.collectionContainer.add(card);
        
        // Add card background
        const isUnlocked = game.globals.collectedCharacters.some(c => c.name === character.name);
        const bgColor = isUnlocked ? 0x3498db : 0x7f8c8d;
        const cardBg = this.add.rectangle(0, 0, 150, 180, bgColor, 0.8);
        card.add(cardBg);
        
        if (isUnlocked) {
            // Render character pixel art
            const charGraphics = character.renderPixelArt(this, 0, -40, 2);
            card.add(charGraphics);
            
            // Add character name
            const nameText = this.add.text(0, 40, character.name, {
                font: 'bold 16px Arial',
                fill: '#ffffff'
            });
            nameText.setOrigin(0.5);
            card.add(nameText);
            
            // Add rarity
            const rarityText = this.add.text(0, 60, `Rarity: ${character.rarity}`, {
                font: '12px Arial',
                fill: '#ffffff'
            });
            rarityText.setOrigin(0.5);
            card.add(rarityText);
            
            // Add view details button
            const detailsButton = this.add.text(0, 80, 'View Details', {
                font: '12px Arial',
                fill: '#ffffff',
                backgroundColor: '#2c3e50',
                padding: { x: 10, y: 5 }
            });
            detailsButton.setOrigin(0.5);
            detailsButton.setInteractive();
            
            detailsButton.on('pointerdown', () => {
                this.showCharacterDetails(character);
            });
            
            card.add(detailsButton);
        } else {
            // Show locked state
            const lockIcon = this.add.text(0, -20, '🔒', {
                font: '40px Arial'
            });
            lockIcon.setOrigin(0.5);
            card.add(lockIcon);
            
            // Add character name (still visible when locked)
            const nameText = this.add.text(0, 40, character.name, {
                font: 'bold 16px Arial',
                fill: '#ffffff'
            });
            nameText.setOrigin(0.5);
            card.add(nameText);
            
            // Add "locked" text
            const lockedText = this.add.text(0, 70, 'Locked', {
                font: '14px Arial',
                fill: '#ffffff'
            });
            lockedText.setOrigin(0.5);
            card.add(lockedText);
        }
    }
    
    showCharacterDetails(character) {
        // Create a semi-transparent background
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        overlay.setInteractive();
        
        // Create popup
        const popup = this.add.rectangle(400, 300, 600, 400, 0x2c3e50);
        
        // Add character name
        const title = this.add.text(400, 150, character.name, {
            font: 'bold 32px Arial',
            fill: '#ffffff'
        });
        title.setOrigin(0.5);
        
        // Render character
        const charGraphics = character.renderPixelArt(this, 250, 300, 4);
        
        // Add description
        const description = this.add.text(450, 250, character.description, {
            font: '18px Arial',
            fill: '#ffffff',
            wordWrap: { width: 300 }
        });
        
        // Add attributes
        let attributeText = 'Attributes:\n';
        for (const [key, value] of Object.entries(character.attributes)) {
            attributeText += `${key}: ${value}/10\n`;
        }
        
        const attributes = this.add.text(450, 320, attributeText, {
            font: '16px Arial',
            fill: '#ffffff'
        });
        
        // Add rarity
        const rarity = this.add.text(450, 400, `Rarity: ${character.rarity}`, {
            font: 'bold 18px Arial',
            fill: '#ffffff'
        });
        
        // Add close button
        const closeButton = this.createButton(400, 480, 'Close', () => {
            overlay.destroy();
            popup.destroy();
            title.destroy();
            charGraphics.destroy();
            description.destroy();
            attributes.destroy();
            rarity.destroy();
            closeButton.button.destroy();
            closeButton.text.destroy();
        });
    }
    
    updatePagination() {
        // Remove existing pagination buttons
        if (this.prevButton) {
            this.prevButton.button.destroy();
            this.prevButton.text.destroy();
        }
        
        if (this.nextButton) {
            this.nextButton.button.destroy();
            this.nextButton.text.destroy();
        }
        
        if (this.pageText) {
            this.pageText.destroy();
        }
        
        // Get total number of characters
        const allCharacters = this.characterFactory.getAllCharacters();
        const totalPages = Math.ceil(allCharacters.length / this.itemsPerPage);
        
        // Add page text
        this.pageText = this.add.text(400, 550, `Page ${this.currentPage + 1}/${totalPages}`, {
            font: '18px Arial',
            fill: '#ffffff'
        });
        this.pageText.setOrigin(0.5);
        
        // Add previous page button if not on first page
        if (this.currentPage > 0) {
            this.prevButton = this.createButton(300, 550, 'Previous', () => {
                this.currentPage--;
                this.displayCollection();
                this.updatePagination();
            });
        }
        
        // Add next page button if not on last page
        if (this.currentPage < totalPages - 1) {
            this.nextButton = this.createButton(500, 550, 'Next', () => {
                this.currentPage++;
                this.displayCollection();
                this.updatePagination();
            });
        }
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

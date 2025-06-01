class Character {
    constructor(config) {
        this.name = config.name;
        this.sprite = config.sprite;
        this.rarity = config.rarity || 'common';
        this.attributes = config.attributes || {};
        this.description = config.description || '';
        this.unlocked = config.unlocked || false;
        this.pixelArt = config.pixelArt || [];
    }

    unlock() {
        this.unlocked = true;
        console.log(`Unlocked ${this.name} character!`);
        return this;
    }

    getStats() {
        return {
            name: this.name,
            rarity: this.rarity,
            attributes: this.attributes,
            unlocked: this.unlocked
        };
    }

    // Method to render the pixel art character to a canvas
    renderPixelArt(scene, x, y, scale = 4) {
        if (!this.pixelArt || this.pixelArt.length === 0) {
            console.error(`No pixel art defined for ${this.name}`);
            return null;
        }

        const width = this.pixelArt[0].length;
        const height = this.pixelArt.length;
        
        // Create a graphics object
        const graphics = scene.add.graphics({ x: x, y: y });
        
        // Draw each pixel
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const colorCode = this.pixelArt[row][col];
                if (colorCode && colorCode !== '0') {
                    // Convert color code to actual color (implement your color mapping)
                    const color = this.getColorFromCode(colorCode);
                    graphics.fillStyle(color, 1);
                    graphics.fillRect(col * scale, row * scale, scale, scale);
                }
            }
        }
        
        return graphics;
    }
    
    getColorFromCode(code) {
        // Map color codes to actual colors
        const colorMap = {
            '1': 0x000000, // Black
            '2': 0xFFFFFF, // White
            '3': 0xFF0000, // Red
            '4': 0x00FF00, // Green
            '5': 0x0000FF, // Blue
            '6': 0xFFFF00, // Yellow
            '7': 0xFF00FF, // Magenta
            '8': 0x00FFFF, // Cyan
            '9': 0xFFA500, // Orange
            'A': 0x800080, // Purple
            'B': 0x008000, // Dark Green
            'C': 0x800000, // Maroon
            'D': 0x808080, // Gray
            'E': 0xC0C0C0, // Silver
            'F': 0xA52A2A  // Brown
        };
        
        return colorMap[code] || 0x000000;
    }
}

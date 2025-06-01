const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        MenuScene,
        GameScene,
        CollectionScene
    ]
};

const game = new Phaser.Game(config);

// Global game variables
game.globals = {
    characters: [],
    collectedCharacters: [],
    contributions: 0
};

import Phaser from "phaser";
import BootScene from "./scenes/BootScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  backgroundColor: "#181825",
  parent: "game-container",
  scene: [BootScene, GameScene, UIScene],
};

window.game = new Phaser.Game(config);

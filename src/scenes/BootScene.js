import Phaser from "phaser";
export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }
  preload() {
    // 효과음, 파티클 등 리소스 로드
    this.load.audio("shoot", "assets/audio/shoot.mp3");
    this.load.image("spark", "assets/particles/spark.png");
  }
  create() {
    this.scene.start("GameScene");
  }
}

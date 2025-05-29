import Phaser from "phaser";
export default class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
    this.goldText = null;
    this.waveText = null;
    this.messageText = null;
    this.scoreText = null;
    this.upgradeBtn = null;
    this.upgradeBtnText = null;
    this.upgradeCostText = null;
  }
  create() {
    this.goldText = this.add.text(20, 20, "", {
      font: "20px Arial",
      fill: "#fff",
    });
    this.waveText = this.add.text(20, 50, "", {
      font: "20px Arial",
      fill: "#fff",
    });
    this.scoreText = this.add.text(20, 110, "", {
      font: "20px Arial",
      fill: "#fff",
    });
    this.messageText = this.add.text(20, 80, "", {
      font: "18px Arial",
      fill: "#ff8080",
    });
    // 업그레이드 버튼
    this.upgradeBtn = this.add
      .rectangle(700, 30, 140, 40, 0x219ebc, 0.8)
      .setInteractive();
    this.upgradeBtnText = this.add
      .text(700, 30, "타워 업그레이드", { font: "16px Arial", fill: "#fff" })
      .setOrigin(0.5);
    this.upgradeCostText = this.add
      .text(700, 55, "", { font: "14px Arial", fill: "#fff" })
      .setOrigin(0.5);
    this.upgradeBtn.on("pointerdown", () => {
      this.scene.get("GameScene").events.emit("upgrade-tower");
    });
    // 이벤트 구독
    this.scene.get("GameScene").events.on("update-ui", this.updateUI, this);
    this.scene
      .get("GameScene")
      .events.on("show-message", this.showMessage, this);
  }
  updateUI({ gold, wave, waveMax, score, upgradeCost, towerLevel }) {
    this.goldText.setText(`Gold: ${gold}`);
    this.waveText.setText(`Wave: ${wave}/${waveMax}`);
    this.scoreText.setText(`Score: ${score ?? 0}`);
    this.upgradeCostText.setText(
      `Lv.${towerLevel ?? 1} / 업그레이드 비용: ${upgradeCost ?? "-"}G`
    );
  }
  showMessage(msg) {
    this.messageText.setText(msg);
    this.time.delayedCall(1000, () => {
      this.messageText.setText("");
    });
  }
}

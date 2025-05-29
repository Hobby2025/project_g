// Basic Tower entity (template)
import Entity from "../../core/ecs/Entity.js";
import PositionComponent from "../../core/ecs/components/PositionComponent.js";
import HealthComponent from "../../core/ecs/components/HealthComponent.js";
import SpriteComponent from "../../core/ecs/components/SpriteComponent.js";

export default class BasicTower extends Entity {
  constructor(x, y, config = {}, scene, level = 1) {
    super(`tower_${Date.now()}_${Math.random()}`);
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new HealthComponent(100));
    this.damage = config.damage ?? 1;
    this.range = config.range ?? 120;
    this.attackSpeed = config.attackSpeed ?? 600;
    // 색상은 레벨별로 다르게
    const colorArr = [
      0x8ecae6, 0x219ebc, 0x023047, 0xffb703, 0xfb8500, 0xff4d6d,
    ];
    const color = colorArr[Math.min(level - 1, colorArr.length - 1)];
    const size = 40 + (level - 1) * 8;
    const sprite = scene.add.rectangle(x, y, size, size, color);
    this.addComponent(new SpriteComponent(sprite));
    this.level = level;
  }

  setLevel(level, scene) {
    this.level = level;
    const colorArr = [
      0x8ecae6, 0x219ebc, 0x023047, 0xffb703, 0xfb8500, 0xff4d6d,
    ];
    const color = colorArr[Math.min(level - 1, colorArr.length - 1)];
    const size = 40 + (level - 1) * 8;
    const spriteComp = this.getComponent("SpriteComponent");
    if (spriteComp && spriteComp.sprite) {
      spriteComp.sprite.setFillStyle(color);
      spriteComp.sprite.width = size;
      spriteComp.sprite.height = size;
      spriteComp.sprite.displayWidth = size;
      spriteComp.sprite.displayHeight = size;
    }
  }
}

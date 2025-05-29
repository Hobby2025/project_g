// 다양한 적 타입 정의 및 팩토리 함수
import BasicEnemy from "./BasicEnemy.js";

const ENEMY_TYPES = {
  Basic: {
    hp: 6,
    speed: 0.5,
    reward: 10,
    color: 0xffb703,
    size: 32,
  },
  Fast: {
    hp: 4,
    speed: 1.2,
    reward: 12,
    color: 0x00b4d8,
    size: 28,
  },
  Tank: {
    hp: 16,
    speed: 0.3,
    reward: 24,
    color: 0x6a4c93,
    size: 40,
  },
  Gold: {
    hp: 5,
    speed: 0.6,
    reward: 30,
    color: 0xffe066,
    size: 34,
    bonus: true, // 처치 시 추가 보상
  },
  Splitter: {
    hp: 8,
    speed: 0.5,
    reward: 14,
    color: 0x43aa8b,
    size: 30,
    split: true, // 처치 시 작은 적 2마리로 분열
  },
};

export function createEnemy(type, x, y, scene) {
  const config = ENEMY_TYPES[type] || ENEMY_TYPES.Basic;
  const enemy = new BasicEnemy(x, y, config, scene);
  // 색상/크기 적용
  const spriteComp = enemy.getComponent("SpriteComponent");
  if (spriteComp && spriteComp.sprite) {
    spriteComp.sprite.setFillStyle(config.color);
    spriteComp.sprite.width = config.size;
    spriteComp.sprite.height = config.size;
    spriteComp.sprite.displayWidth = config.size;
    spriteComp.sprite.displayHeight = config.size;
  }
  enemy.type = type;
  if (config.bonus) enemy.bonus = true;
  if (config.split) enemy.split = true;
  return enemy;
}

export { ENEMY_TYPES };

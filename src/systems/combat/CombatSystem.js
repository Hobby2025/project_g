import System from "../../core/ecs/System.js";
export default class CombatSystem extends System {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
  }
  update(entities) {
    // 샘플: 타워와 적이 겹치면 적 HP 감소
    const towers = entities.filter((e) => e.id.startsWith("tower"));
    const enemies = entities.filter((e) => e.id.startsWith("enemy"));
    for (const tower of towers) {
      const towerPos = tower.getComponent("PositionComponent");
      for (const enemy of enemies) {
        const enemyPos = enemy.getComponent("PositionComponent");
        const enemyHealth = enemy.getComponent("HealthComponent");
        if (
          towerPos &&
          enemyPos &&
          enemyHealth &&
          Math.abs(towerPos.x - enemyPos.x) < 40 &&
          Math.abs(towerPos.y - enemyPos.y) < 40
        ) {
          enemyHealth.hp -= 0.2;
          if (enemyHealth.hp <= 0 && this.eventBus) {
            this.eventBus.emit("enemyKilled", { entity: enemy });
          }
        }
      }
    }
  }
}

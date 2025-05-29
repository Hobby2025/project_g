import System from "../../core/ecs/System.js";

export default class TowerAttackSystem extends System {
  constructor() {
    super();
    this.lastAttackTimes = new Map();
  }
  update(entities, scene) {
    const towers = entities.filter((e) => e.id.startsWith("tower"));
    const enemies = entities.filter((e) => e.id.startsWith("enemy"));
    const now = scene.time.now;
    for (const tower of towers) {
      const pos = tower.getComponent("PositionComponent");
      if (!pos) continue;
      // 쿨다운 체크
      const last = this.lastAttackTimes.get(tower.id) || 0;
      if (now - last < 600) continue;
      // 사거리 내 가장 가까운 적 찾기
      let closest = null,
        minDist = 99999;
      for (const enemy of enemies) {
        const epos = enemy.getComponent("PositionComponent");
        if (!epos) continue;
        const dist = Math.hypot(epos.x - pos.x, epos.y - pos.y);
        const range = tower.range || 120;
        if (dist < range && dist < minDist) {
          closest = enemy;
          minDist = dist;
        }
      }
      if (closest) {
        // 투사체 색상/크기: 타워 레벨/속성 반영
        let color = tower.projectileColor || 0xffffff;
        let size = 16 + ((tower.level || 1) - 1) * 3;
        const damage = tower.damage || 1;
        // 타워 레벨 5 이상일 때 20% 확률로 공격 시 광역(주변 적 전체 피해) 기능은 GameScene에서 처리됨
        if (tower.level >= 5 && Math.random() < 0.2) {
          scene.createProjectile(
            pos.x,
            pos.y,
            closest,
            damage,
            color,
            size,
            true
          );
        } else {
          scene.createProjectile(pos.x, pos.y, closest, damage, color, size);
        }
        // 이펙트/사운드 (리소스 존재 시에만 실행)
        if (scene && scene.sound && scene.cache.audio.exists("shoot")) {
          scene.sound.play("shoot", { volume: 0.2 });
        }
        if (
          scene &&
          scene.textures &&
          scene.textures.exists("spark") &&
          scene.add &&
          scene.add.particles
        ) {
          const emitter = scene.add.particles("spark").createEmitter({
            x: pos.x,
            y: pos.y,
            speed: { min: 50, max: 120 },
            lifespan: 200,
            quantity: 5,
            scale: { start: 0.3, end: 0 },
            tint: tower.projectileColor || 0x8ecae6,
          });
          scene.time.delayedCall(250, () => emitter.stop());
        }
        this.lastAttackTimes.set(tower.id, now);
      }
    }
  }
}

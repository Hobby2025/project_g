import System from "../../core/ecs/System.js";

export default class ProjectileMovementSystem extends System {
  update(entities, scene) {
    const projectiles = entities.filter((e) => e.id.startsWith("projectile"));
    for (const proj of projectiles) {
      const pos = proj.getComponent("PositionComponent");
      const target = proj.targetEntity;
      if (!pos || !target) continue;
      const tpos = target.getComponent("PositionComponent");
      if (!tpos) continue;
      // 이동
      const dx = tpos.x - pos.x,
        dy = tpos.y - pos.y;
      const dist = Math.hypot(dx, dy);
      const speed = 6;
      if (dist < speed) {
        // 명중 처리
        scene.hitEnemyWithProjectile(proj, target);
      } else {
        pos.x += (dx / dist) * speed;
        pos.y += (dy / dist) * speed;
        // 스프라이트 이동
        const sprite = proj.getComponent("SpriteComponent");
        if (sprite) {
          sprite.sprite.x = pos.x;
          sprite.sprite.y = pos.y;
        }
      }
    }
  }
}

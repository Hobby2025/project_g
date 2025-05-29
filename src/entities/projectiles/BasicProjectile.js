// Basic Projectile entity (template)
import Entity from "../../core/ecs/Entity.js";
import PositionComponent from "../../core/ecs/components/PositionComponent.js";
import SpriteComponent from "../../core/ecs/components/SpriteComponent.js";

export default class BasicProjectile extends Entity {
  constructor(x, y, targetEntity, damage, scene, color = 0xffffff, size = 16) {
    super(`projectile_${Date.now()}_${Math.random()}`);
    this.addComponent(new PositionComponent(x, y));
    this.targetEntity = targetEntity;
    this.damage = damage || 1;
    const sprite = scene.add.ellipse(x, y, size, size, color);
    this.addComponent(new SpriteComponent(sprite));
  }
}

// Basic Enemy entity (template)
import Entity from "../../core/ecs/Entity.js";
import PositionComponent from "../../core/ecs/components/PositionComponent.js";
import HealthComponent from "../../core/ecs/components/HealthComponent.js";
import SpriteComponent from "../../core/ecs/components/SpriteComponent.js";

export default class BasicEnemy extends Entity {
  constructor(x, y, config, scene) {
    super(`enemy_${Date.now()}_${Math.random()}`);
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new HealthComponent(config.hp || 5));
    this.speed = config.speed || 0.5;
    this.reward = config.reward || 10;
    const sprite = scene.add.ellipse(x, y, 32, 32, 0xffb703);
    this.addComponent(new SpriteComponent(sprite));
  }
}

import System from "../../core/ecs/System.js";
export default class RenderingSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }
  update(entities) {
    for (const entity of entities) {
      const pos = entity.getComponent("PositionComponent");
      const sprite = entity.getComponent("SpriteComponent");
      if (pos && sprite) {
        sprite.sprite.x = pos.x;
        sprite.sprite.y = pos.y;
      }
    }
  }
}

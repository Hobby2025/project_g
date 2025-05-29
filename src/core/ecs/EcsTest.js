import Entity from "./Entity.js";
import Component from "./Component.js";
import System from "./System.js";

class PositionComponent extends Component {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}
class HealthComponent extends Component {
  constructor(hp) {
    super();
    this.hp = hp;
  }
}
class MoveSystem extends System {
  update(entities) {
    entities.forEach((entity) => {
      const pos = entity.getComponent("PositionComponent");
      if (pos) pos.x += 1;
    });
  }
}

// 테스트 실행
const player = new Entity("player");
player.addComponent(new PositionComponent(0, 0));
player.addComponent(new HealthComponent(10));

const moveSystem = new MoveSystem();
console.log("Before:", player.getComponent("PositionComponent"));
moveSystem.update([player]);
console.log("After:", player.getComponent("PositionComponent"));

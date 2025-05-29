import System from "../../core/ecs/System.js";
export default class MovementSystem extends System {
  update(entities) {
    // 적을 원형 궤도로 이동 (중심: 400, 300, 반지름: 120)
    const cx = 400,
      cy = 300,
      r = 120;
    for (const entity of entities) {
      if (entity.id.startsWith("enemy")) {
        const pos = entity.getComponent("PositionComponent");
        if (!pos) continue;
        // 이미 중앙 도달한 적은 무시
        if (entity.reachedCenter) continue;
        // 돌진 상태면 직선 이동
        if (entity.rush) {
          const dx = cx - pos.x;
          const dy = cy - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speed = (entity.speed || 0.5) * 2; // 돌진은 빠르게
          if (dist < speed) {
            pos.x = cx;
            pos.y = cy;
            entity.reachedCenter = true;
          } else {
            pos.x += (dx / dist) * speed;
            pos.y += (dy / dist) * speed;
          }
          continue;
        }
        // 각도 상태가 없으면 초기화 (생성 위치 기준)
        if (typeof entity.angle === "undefined") {
          // 생성 위치에서 각도 계산
          entity.angle = Math.atan2(pos.y - cy, pos.x - cx);
        }
        // 일정 확률로 돌진 시작(프레임당 0.2%)
        if (Math.random() < 0.002) {
          entity.rush = true;
          continue;
        }
        // speed를 각속도로 사용 (radian per frame)
        const angularSpeed = (entity.speed || 0.5) * 0.01; // 속도 조절
        entity.angle += angularSpeed; // 시계방향
        pos.x = cx + r * Math.cos(entity.angle);
        pos.y = cy + r * Math.sin(entity.angle);
      }
    }
  }
}

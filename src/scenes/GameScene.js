import Phaser from "phaser";
import Entity from "../core/ecs/Entity.js";
import Component from "../core/ecs/Component.js";
import MovementSystem from "../systems/movement/MovementSystem.js";
import CombatSystem from "../systems/combat/CombatSystem.js";
import RenderingSystem from "../systems/rendering/RenderingSystem.js";
import TowerAttackSystem from "../systems/combat/TowerAttackSystem.js";
import ProjectileMovementSystem from "../systems/movement/ProjectileMovementSystem.js";
import EventBus from "../core/events/EventBus.js";
import { waves } from "../config/mapConfig.js";
import { towers as towerDefs } from "../config/towerConfig.js";
import { createEnemy, ENEMY_TYPES } from "../entities/enemies/EnemyTypes.js";
import PositionComponent from "../core/ecs/components/PositionComponent.js";
import HealthComponent from "../core/ecs/components/HealthComponent.js";
import SpriteComponent from "../core/ecs/components/SpriteComponent.js";
import BasicTower from "../entities/towers/BasicTower.js";
import BasicProjectile from "../entities/projectiles/BasicProjectile.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.entities = [];
    this.systems = [];
    this.eventBus = new EventBus();
    this.currentWaveIndex = 0;
    this.waveInProgress = false;
    this.pendingSpawns = [];
    this.gold = 100;
    this.score = 0;
    this.towerLevel = 1;
    this.upgradeCost = 50;
    this.gameOver = false;
  }

  create() {
    // UI 표시
    // UI는 UIScene에서 표시. 최초 갱신
    this.updateUI();

    // 적 처치 이벤트 구독
    this.eventBus.on("enemyKilled", ({ entity }) => {
      // 골드 획득 및 특수 효과
      let reward = entity.reward || 10;
      if (entity.bonus) reward += 20; // Gold enemy: 추가 골드
      // 20% 확률 추가 골드(10~30)
      if (Math.random() < 0.2) {
        const bonus = 10 + Math.floor(Math.random() * 21);
        reward += bonus;
        this.showMessage(`추가 골드 +${bonus}!`);
      }
      this.gold += reward;
      this.score++;
      // 10% 확률로 10초간 타워 공격속도 2배 버프
      if (!this.towerBuff && Math.random() < 0.1) {
        this.towerBuff = true;
        const tower = this.entities.find((e) => e.id.startsWith("tower"));
        if (tower)
          tower.attackSpeed = Math.max(
            60,
            Math.round((tower.attackSpeed || 600) * 0.5)
          );
        this.showMessage("타워 공격속도 2배! (10초)");
        if (this.towerBuffTimer) this.towerBuffTimer.remove();
        this.towerBuffTimer = this.time.delayedCall(10000, () => {
          this.towerBuff = false;
          const tower = this.entities.find((e) => e.id.startsWith("tower"));
          if (tower)
            tower.attackSpeed = Math.round((tower.attackSpeed || 600) * 2);
          this.showMessage("공격속도 버프 종료");
        });
      }
      // Splitter: 처치 시 작은 적 2마리 생성
      if (entity.split) {
        for (let i = 0; i < 2; i++) {
          this.spawnEnemy(
            entity.getComponent("PositionComponent").x + (i === 0 ? -16 : 16),
            entity.getComponent("PositionComponent").y,
            "Fast"
          );
        }
      }
      this.updateUI();
      console.log(`[EVENT] Enemy killed: ${entity.id}`);
      this.entities = this.entities.filter((e) => e !== entity);
      const sprite = entity.getComponent("SpriteComponent");
      if (sprite) sprite.sprite.destroy();
    });

    // 업그레이드 버튼 이벤트
    this.events.on("upgrade-tower", () => {
      if (this.gold < this.upgradeCost) {
        this.showMessage("Not enough gold for upgrade!");
        return;
      }
      this.upgradeTower();
    });

    // 30초마다 자동 업그레이드 타이머
    this.time.addEvent({
      delay: 30000,
      loop: true,
      callback: () => {
        if (this.towerLevel < 10) {
          this.upgradeTower(true);
        }
      },
    });

    // 타워 버프 상태
    this.towerBuff = false;
    this.towerBuffTimer = null;

    // 시스템 등록 (이벤트 버스 전달)
    this.systems = [
      new MovementSystem(),
      new ProjectileMovementSystem(),
      new TowerAttackSystem(),
      new CombatSystem(this.eventBus),
      new RenderingSystem(this),
    ];

    // 원형 맵(경로) 시각화
    this.add.circle(400, 300, 120, 0x8ecae6, 0.15).setStrokeStyle(2, 0x219ebc);

    // 중앙에 타워 배치 (레벨 인자 포함)
    this.placeTower(400, 300, this.towerLevel);

    // 웨이브 자동 진행 시작
    this.startNextWave();
    // 타워 배치 클릭 이벤트 제거 (중앙 고정)
    // this.input.on('pointerdown', ...) 제거
  }

  startNextWave() {
    // 난이도 자동 상승: 웨이브 번호에 따라 적 속도/체력/등장 수 증가 및 특수 적 등장
    const waveNum = this.currentWaveIndex + 1;
    const count = 6 + Math.floor(waveNum * 1.5);
    const types = ["Basic", "Fast", "Tank"];
    if (waveNum > 2) types.push("Gold");
    if (waveNum > 3) types.push("Splitter");
    this.waveInProgress = true;
    for (let i = 0; i < count; i++) {
      let type = types[Math.floor(Math.random() * types.length)];
      if (type === "Gold" && Math.random() < 0.7) type = "Basic";
      if (type === "Splitter" && Math.random() < 0.6) type = "Fast";
      // 각도에 따라 원형 경로 위에 분산 배치
      const angle = (2 * Math.PI * i) / count;
      const spawnX = 400 + 120 * Math.cos(angle);
      const spawnY = 300 + 120 * Math.sin(angle);
      this.time.addEvent({
        delay: i * 600, // 0.6초 간격
        callback: () => {
          this.spawnEnemy(spawnX, spawnY, type);
        },
        callbackScope: this,
      });
    }
    this.updateUI();
  }

  spawnEnemy(x, y, type = "Basic") {
    // type: 'Basic', 'Fast', 'Tank', 'Gold', 'Splitter' 등
    const enemy = createEnemy(type, x, y, this);
    this.entities.push(enemy);
  }

  // 타워 수동/자동 업그레이드 공통 함수
  upgradeTower(auto = false) {
    if (!auto) this.gold -= this.upgradeCost;
    this.towerLevel++;
    if (!auto) this.upgradeCost = Math.floor(this.upgradeCost * 1.7);
    // 중앙 타워의 damage, attackSpeed 업그레이드 및 외형 반영
    const tower = this.entities.find((e) => e.id.startsWith("tower"));
    if (tower) {
      tower.damage = Math.round((tower.damage || 1) * 1.25);
      tower.attackSpeed = Math.max(
        100,
        Math.round((tower.attackSpeed || 600) * 0.85)
      );
      if (typeof tower.setLevel === "function")
        tower.setLevel(this.towerLevel, this);
      // projectileColor도 레벨별로 변경(추후 사용)
      const colorArr = [
        0x8ecae6, 0x219ebc, 0x023047, 0xffb703, 0xfb8500, 0xff4d6d,
      ];
      tower.projectileColor =
        colorArr[Math.min(this.towerLevel - 1, colorArr.length - 1)];
      // 버프 적용
      if (this.towerBuff) {
        tower.attackSpeed = Math.max(60, Math.round(tower.attackSpeed * 0.5));
      }
    }
    this.updateUI();
    this.showMessage(
      auto
        ? `타워 자동 Lv.${this.towerLevel} 업그레이드!`
        : `타워가 Lv.${this.towerLevel}로 업그레이드!`
    );
  }

  update() {
    if (this.gameOver) return;
    // 적이 중앙에 도달했는지 체크
    const reached = this.entities.find(
      (e) => e.id.startsWith("enemy") && e.reachedCenter
    );
    if (reached) {
      this.gameOver = true;
      this.scene
        .get("UIScene")
        .events.emit(
          "show-message",
          `Game Over! 적이 중앙에 도달했습니다.\n최종 점수: ${this.score}`
        );
      // R키로 재시작 안내
      this.input.keyboard.once("keydown-R", () => {
        this.scene.restart();
        this.scene.get("UIScene").scene.restart();
      });
      return;
    }
    for (const system of this.systems) {
      // 일부 시스템은 scene(this)도 전달
      if (
        system instanceof TowerAttackSystem ||
        system instanceof ProjectileMovementSystem
      ) {
        system.update(this.entities, this);
      } else {
        system.update(this.entities);
      }
    }
    // 웨이브 종료 체크만 (적이 모두 사라졌을 때)
    if (this.waveInProgress) {
      const enemiesLeft = this.entities.filter(
        (e) => e.id && e.id.startsWith("enemy")
      );
      if (enemiesLeft.length === 0) {
        this.waveInProgress = false;
        this.currentWaveIndex++;
        this.time.delayedCall(1000, () => this.startNextWave());
      }
    }
  }

  // 씬 재시작 시 상태 초기화
  init() {
    this.entities = [];
    this.systems = [];
    this.eventBus = new EventBus();
    this.currentWaveIndex = 0;
    this.waveInProgress = false;
    this.pendingSpawns = [];
    this.gold = 100;
    this.score = 0;
    this.towerLevel = 1;
    this.upgradeCost = 50;
    this.gameOver = false;
  }

  placeTower(x, y, level = 1) {
    // 이미 중앙에 있으면 추가 배치 불가
    const exists = this.entities.find((e) => e.id.startsWith("tower"));
    if (exists) {
      this.showMessage("Tower is already placed!");
      return;
    }
    if (x !== 400 || y !== 300) {
      this.showMessage("You can only place the tower at the center!");
      return;
    }
    // 타워 생성 (레벨 인자)
    const tower = new BasicTower(x, y, towerDefs.BasicTower, this, level);
    // projectileColor도 레벨별로 지정
    const colorArr = [
      0x8ecae6, 0x219ebc, 0x023047, 0xffb703, 0xfb8500, 0xff4d6d,
    ];
    tower.projectileColor = colorArr[Math.min(level - 1, colorArr.length - 1)];
    this.entities.push(tower);
  }

  updateUI() {
    // UIScene에 이벤트로 전달
    this.scene.get("UIScene").events.emit("update-ui", {
      gold: this.gold,
      wave: this.currentWaveIndex + 1,
      waveMax: waves.length,
      score: this.score,
      upgradeCost: this.upgradeCost,
      towerLevel: this.towerLevel,
    });
  }

  showMessage(msg) {
    this.scene.get("UIScene").events.emit("show-message", msg);
  }

  createProjectile(x, y, targetEntity, damage = 1) {
    const projectile = new BasicProjectile(x, y, targetEntity, damage, this);
    this.entities.push(projectile);
  }

  hitEnemyWithProjectile(projectile, enemy) {
    // 데미지 적용
    const enemyHealth = enemy.getComponent("HealthComponent");
    if (enemyHealth) {
      enemyHealth.hp -= projectile.damage || 1;
    }
    // 투사체 제거
    this.entities = this.entities.filter((e) => e !== projectile);
    const sprite = projectile.getComponent("SpriteComponent");
    if (sprite) sprite.sprite.destroy();
  }

  update() {
    if (this.gameOver) return;
    // 적이 중앙에 도달했는지 체크
    const reached = this.entities.find(
      (e) => e.id.startsWith("enemy") && e.reachedCenter
    );
    if (reached) {
      this.gameOver = true;
      this.scene
        .get("UIScene")
        .events.emit(
          "show-message",
          `Game Over! 적이 중앙에 도달했습니다.\n최종 점수: ${this.score}`
        );
      // R키로 재시작 안내
      this.input.keyboard.once("keydown-R", () => {
        this.scene.restart();
        this.scene.get("UIScene").scene.restart();
      });
      return;
    }
    for (const system of this.systems) {
      // 일부 시스템은 scene(this)도 전달
      if (
        system instanceof TowerAttackSystem ||
        system instanceof ProjectileMovementSystem
      ) {
        system.update(this.entities, this);
      } else {
        system.update(this.entities);
      }
    }
  }

  // 씬 재시작 시 상태 초기화
  init() {
    this.entities = [];
    this.systems = [];
    this.eventBus = new EventBus();
    this.currentWaveIndex = 0;
    this.waveInProgress = false;
    this.pendingSpawns = [];
    this.gold = 100;
    this.score = 0;
    this.towerLevel = 1;
    this.upgradeCost = 50;
    this.gameOver = false;
  }
}

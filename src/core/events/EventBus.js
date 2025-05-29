// Simple event bus for decoupling
export default class EventBus {
  constructor() {
    this.listeners = {};
  }
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback
    );
  }
  emit(event, data) {
    (this.listeners[event] || []).forEach((cb) => cb(data));
  }
}
// Usage Example:
// import EventBus from './EventBus.js';
// const bus = new EventBus();
// bus.on('enemyKilled', (data) => { ... });
// bus.emit('enemyKilled', { enemyId: 1 });

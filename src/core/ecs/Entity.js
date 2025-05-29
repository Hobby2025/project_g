// Entity base class
export default class Entity {
  constructor(id) {
    this.id = id;
    this.components = {};
  }
  addComponent(component) {
    this.components[component.constructor.name] = component;
  }
  getComponent(name) {
    return this.components[name];
  }
}

class Keyboard {
  keys = {};

  constructor() {
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
  }

  init() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  }

  keyDown(event) {
    this.keys[event.key] = true;
  }

  keyUp(event) {
    this.keys[event.key] = false;
  }

  pressed(key) {
    return !!this.keys[key];
  }
}

export default new Keyboard();

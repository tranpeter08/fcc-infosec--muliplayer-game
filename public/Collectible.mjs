const collectibleSize = 20;

class Collectible {
  constructor({ x, y, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }

  /**
   *
   * @param {Axis} axis
   */
  maxAxis(axis) {
    return this[axis] + collectibleSize;
  }
}

export default Collectible;

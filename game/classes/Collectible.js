const { v4: uuidv4 } = require('uuid');
const { collectibleSize, canvas } = require('../settings');

class Collectible {
  x = 80;
  y = 80;

  /**
   *
   * @param {Position?} pos
   */
  constructor(pos) {
    this.id = uuidv4();

    if (pos) {
      this.x = pos.x;
      this.y = pos.y;
    }
  }

  /**
   *
   * @param {Axis} axis
   */
  maxAxis(axis) {
    return this[axis] + collectibleSize;
  }

  createRandomPosition() {
    const { width, height } = canvas;
    this.x = this.randomPosition(width);
    this.y = this.randomPosition(height);
  }

  /**
   * @param {number} dimSize
   */
  randomPosition(dimSize) {
    const min = 0;
    const max = dimSize - collectibleSize;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = Collectible;

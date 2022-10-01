const Collectible = require('./Collectible');
const { playerSize } = require('../settings');

class Player {
  score = 0;
  x = 0;
  y = 0;
  color = null;
  width = 40;

  constructor(id) {
    this.id = id;
  }

  /**
   *
   * @param {Position} position
   */
  updatePosition({ x = 0, y = 0 }) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Axis} axis
   */
  maxAxis(axis) {
    return this[axis] + playerSize;
  }

  /**
   *
   * @param {Collectible} collectible
   */
  hasCollision(collectible) {
    const axes = ['x', 'y'];
    const collision = { x: false, y: false };

    for (const axis of axes) {
      const boundaries = [collectible[axis], collectible.maxAxis(axis)];
      for (const boundary of boundaries) {
        const breaks = this.breaksThreshold(
          boundary,
          this[axis],
          this.maxAxis(axis)
        );

        if (breaks) {
          collision[axis] = true;
        }
      }
    }

    return collision.x && collision.y;
  }

  /**
   *
   * @param {number} collLimit
   * @param {number} playerMin
   * @param {number} playerMax
   */
  breaksThreshold(collBoundry, playerMin, playerMax) {
    return collBoundry > playerMin && collBoundry < playerMax;
  }

  updateScore() {
    this.score += 1;
  }
}

module.exports = Player;

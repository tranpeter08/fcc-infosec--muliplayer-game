import Collectible from './Collectible.mjs';
import { playerSize, yAxis, xAxis, vectors, canvasMax } from './settings.mjs';

class Player {
  constructor({ x, y, score, id, color }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.color = color;
  }

  nextPos(dir, speed) {
    let axis = null;

    if (xAxis.includes(dir)) {
      axis = 'x';
    } else if (yAxis.includes(dir)) {
      axis = 'y';
    }

    const vector = vectors[dir];

    return { axis, newPos: this[axis] + vector * speed };
  }

  /**
   *
   * @param {string} dir
   * @param {number} speed
   * @returns
   */
  movePlayer(dir, speed) {
    let axis = null;

    if (xAxis.includes(dir)) {
      axis = 'x';
    } else if (yAxis.includes(dir)) {
      axis = 'y';
    }

    const vector = vectors[dir];
    const newPos = this[axis] + vector * speed;
    // const { newPos } = this.nextPos(dir, speed);
    const maxPos = canvasMax[axis] - playerSize;

    if (newPos < 0 || newPos > maxPos) {
      return;
    }

    this[axis] = newPos;
  }

  updateScore(score) {
    this.score = score;
  }

  /**
   *
   * @param {Player[]} arr
   */
  calculateRank(arr) {
    const players = [...arr];
    let rank = null;

    players.sort((a, b) => {
      return b.score - a.score;
    });

    for (let i = 0; i < players.length; i++) {
      const { id } = players[i];
      if (this.id === id) {
        rank = i + 1;
      }
    }

    return `Rank: ${rank}/${players.length}`;
  }

  updatePos({ x, y }) {
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
  collision(collectible) {
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
}

export default Player;

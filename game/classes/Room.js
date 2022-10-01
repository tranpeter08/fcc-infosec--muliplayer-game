const { v4: uuidv4 } = require('uuid');
const Collectible = require('./Collectible');
const Player = require('./Player');

class Room {
  /**
   * @type {Map<string, Player>}
   */
  players = new Map();

  /**
   * @type {string[]}
   */
  colors = ['red', 'green', 'blue', 'orange'];

  canvas = {
    width: 640,
    height: 480,
  };

  constructor() {
    this.id = uuidv4();
    this.collectible = new Collectible();
  }

  /**
   *
   * @param {Player} player
   */
  addPlayer(player) {
    player.color = this.colors.pop();
    this.players.set(player.id, player);
  }

  /**
   *
   * @param {string} playerId
   */
  removePlayer(playerId) {
    const player = this.players.get(playerId);

    if (!player) return;

    this.colors.push(player.color);
    player.color = null;
    this.players.delete(playerId);

    if (this.players.size === 0) {
      this.collectible = new Collectible();
    }
  }

  /**
   *
   * @param {string} playerId
   *
   */
  hasPlayer(playerId) {
    return this.players.has(playerId);
  }

  /**
   *
   * @param {Collectible} collectible
   */
  createCollectible(collectible = null) {
    let isValidPos = true;

    if (!collectible) {
      collectible = new Collectible();
    }

    collectible.createRandomPosition();

    for (const player of this.players.values()) {
      if (player.hasCollision(collectible)) {
        isValidPos = false;
        break;
      }
    }

    if (isValidPos) {
      this.collectible = collectible;
      return;
    } else {
      return this.createCollectible(collectible);
    }
  }

  createRandomPosition() {
    const { width, height } = this.canvas;
    return { x: this.randomPosition(width), y: this.randomPosition(height) };
  }

  /**
   *
   * @param {number} dimSize width or height of canvas
   * @returns
   */
  randomPosition(dimSize) {
    const min = 0;
    const max = dimSize - this.collectible.width;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = Room;

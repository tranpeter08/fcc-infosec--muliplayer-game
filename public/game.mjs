import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io({ timeout: 5 * 60 * 1000 });

const emitCodes = {
  PLAYER_MOVE: 'PLAYER_MOVE',
  CONNECTED: 'CONNECTED',
  PLAYER_DISCONNECT: 'PLAYER_DISCONNECT',
  COLLISION: 'COLLISION',
  JOINED: 'JOINED',
  SCORED: 'SCORED',
};

const keyCodes = {
  ArrowLeft: { pressed: false, velocityData: ['x', -1], dir: 'left' },
  ArrowUp: { pressed: false, velocityData: ['y', -1], dir: 'up' },
  ArrowRight: { pressed: false, velocityData: ['x', 1], dir: 'right' },
  ArrowDown: { pressed: false, velocityData: ['y', 1], dir: 'down' },
  KeyA: { pressed: false, velocityData: ['x', -1], dir: 'left' },
  KeyW: { pressed: false, velocityData: ['y', -1], dir: 'up' },
  KeyD: { pressed: false, velocityData: ['x', 1], dir: 'right' },
  KeyS: { pressed: false, velocityData: ['y', 1], dir: 'down' },
};

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('game-window');
const scoreLabel = document.querySelector('#score');
const ranklabel = document.querySelector('#rank');

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

/**
 * @type {Map<string, Player>}
 */
const players = new Map();
const playerSize = 40;
const collectibleWidth = 20;

const velocity = { left: 0, right: 0, up: 0, down: 0 };
const playerSpeed = 5;

/**
 * @type {{x: number, y: number}}
 */
let collectible = null;

/**
 * @type {string}
 */
let myId = null;

/**
 * @type {Player}
 */
let me = null;

let connected = false;
let animationId = null;

/**
 * @callback socketCallback
 * @param {Object} gameData
 */
socket.on(emitCodes.CONNECTED, (gameData) => {
  console.log('connected', gameData);
  const { playerId, collectibleData, playerDataList } = gameData;
  collectible = new Collectible(collectibleData);

  for (const data of playerDataList) {
    const player = new Player(data);

    if (playerId === player.id) {
      me = player;
    }

    players.set(player.id, player);
  }

  connected = true;
});

socket.on(emitCodes.SCORED, (msg) => {
  console.log(msg);
});

socket.on('announcement', (msg) => {
  console.log(msg);
});

socket.on(emitCodes.PLAYER_MOVE, (playerData) => {
  const { id, ...pos } = playerData;
  const player = players.get(id);

  if (!player) {
    console.error('no player found');
    return;
  }

  player.updatePos(pos);
});

socket.on(emitCodes.JOINED, (playerData) => {
  console.log('player joined', playerData);
  const player = new Player(playerData);

  // add to player list
  players.set(player.id, player);
});

socket.on(emitCodes.COLLISION, (coll) => {
  collectible = coll;
});

socket.on(emitCodes.SCORED, ({ id, score }) => {
  updateScore(id, score);
  updateRank();
});

function updateScore(id, score) {
  const player = players.get(id);

  if (!player) {
    console.log('player not found to update score');
    return;
  }

  player.updateScore(score);

  if (me.id === id) {
    scoreLabel.textContent = score;
  }
}

function updateRank() {
  const rank = me.calculateRank(players.values());
  ranklabel.textContent = rank;
}

socket.on(emitCodes.PLAYER_DISCONNECT, (playerId) => {
  console.log('player left', playerId);
  players.delete(playerId);
});

// draw object on canvas
window.addEventListener('keydown', (e) => {
  const { code } = e;

  if (code in keyCodes && !keyCodes[code].pressed) {
    const { dir } = keyCodes[code];
    keyCodes[code].pressed = true;
    velocity[dir] += 1;
  }
});

// remove interval
window.addEventListener('keyup', (e) => {
  const { code } = e;

  if (code in keyCodes) {
    const { dir } = keyCodes[code];

    keyCodes[code].pressed = false;
    velocity[dir] -= 1;
  }
});

// move object on canvas
function updatePos() {
  const oldPos = { x: me.x, y: me.y };

  for (const dir in velocity) {
    if (velocity[dir] > 0) {
      me.movePlayer(dir, playerSpeed);
    }
  }

  // if new position is same as old position do nothing
  if (me.x === oldPos.x && me.y == oldPos.y) {
    return;
  }

  socket.emit(emitCodes.PLAYER_MOVE, me);
}

/**
 *
 * @param {Player} player
 */
function renderSquare(player) {
  const { x, y, color } = player;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, playerSize, playerSize);
}

function renderCollectible() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.roundRect(
    collectible.x,
    collectible.y,
    collectibleWidth,
    collectibleWidth,
    collectibleWidth / 2
  );
  ctx.stroke();
  ctx.fill();
}

function paint() {
  if (connected) {
    updatePos();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    for (const player of players.values()) {
      renderSquare(player);
    }

    renderCollectible();

    ctx.restore();
  }

  animationId = requestAnimationFrame(paint);
}

animationId = requestAnimationFrame(paint);

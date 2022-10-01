const Room = require('./classes/Room');
const Player = require('./classes/Player');

/**
 * @type {Map<string, Player>}
 */
const players = new Map();

/**
 * @type {Map<string, Room>}
 */
const rooms = new Map();

const newRoom = new Room();
rooms.set(newRoom.id, newRoom);

/**
 *
 * @param {string} sockId
 * @returns
 */
function initializePlayer(sockId) {
  /**
   * @type {Room}
   */
  let gameRoom = null;
  let noVacancy = true;
  const player = new Player(sockId);

  // check rooms for vacancy
  for (const room of rooms.values()) {
    const hasVacancy = room.players.size < 4;
    if (hasVacancy) {
      gameRoom = room;
      noVacancy = false;
      break;
    }
  }

  // if no current rooms are available, create a room
  if (noVacancy) {
    gameRoom = new Room();
    rooms.set(gameRoom.id, gameRoom);
  }

  // assign player to a room
  gameRoom.addPlayer(player);
  players.set(player.id, player);

  // provide all player positions when client connects
  /**
   * @type {PlayerData[]}
   */
  const playersInGame = [];

  gameRoom.players.forEach((p, id) => {
    playersInGame.push(p);
  });

  return { player, gameRoom, playersInGame };
}

/**
 *
 * @param {Player} player
 * @param {{x: number, y: number}} pos
 * @returns
 */
function updatePlayerPos(player, pos) {
  try {
    // const player = players.get(socket.id);

    if (!player) return;

    player.updatePosition(pos);
    // io.to(player.roomId).emit(emitCodes.PLAYER_MOVE, player);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { players, rooms, initializePlayer, updatePlayerPos };

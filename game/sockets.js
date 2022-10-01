const Server = require('socket.io');
const { emitCodes } = require('./constants');
const {
  initializePlayer,
  updatePlayerPos,
  players,
  rooms,
} = require('./index');

/**
 *
 * @param {Server} io
 */
function gameSockets(io) {
  io.on('connect', (socket) => {
    const { player, gameRoom, playersInGame } = initializePlayer(socket.id);

    socket.join(gameRoom.id).emit(emitCodes.CONNECTED, {
      playerId: player.id,
      collectibleData: gameRoom.collectible,
      playerDataList: playersInGame,
    });

    socket.to(gameRoom.id).emit(emitCodes.JOINED, player);

    socket.on(emitCodes.PLAYER_MOVE, (pos) => {
      player.updatePosition(pos);
      const hasCollision = player.hasCollision(gameRoom.collectible);

      io.to(gameRoom.id).emit(emitCodes.PLAYER_MOVE, player);

      if (hasCollision) {
        gameRoom.createCollectible();
        player.updateScore();
        io.to(gameRoom.id).emit(emitCodes.SCORED, {
          id: player.id,
          score: player.score,
        });

        io.to(gameRoom.id).emit(emitCodes.COLLISION, gameRoom.collectible);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(reason);
      const { id } = player;

      gameRoom.removePlayer(id);
      players.delete(id);

      socket.to(gameRoom.id).emit(emitCodes.PLAYER_DISCONNECT, id);
    });
  });
}

module.exports = gameSockets;

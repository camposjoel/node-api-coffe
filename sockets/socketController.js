const { Socket } = require('socket.io')
const { testJwt } = require('../helpers/generateJwt')
const { ChatMessages } = require('../models')


const chatMessage = new ChatMessages()

/**
 * 
 * @param {Socket} socket 
 */
const socketController = async (socket, io) => {
  const user = await testJwt(socket.handshake.headers['x-token'])

  if (!user) {
    return socket.disconnect()
  }

  // Agregar el usuario conectado
  chatMessage.connectUser(user)

  io.emit('active-users', chatMessage.usersList)

  // Limpiar cuando alguien se desconecta
  socket.on('disconnect', () => {
    chatMessage.disconnectUser(user.id)
    io.emit('active-users', chatMessage.usersList)
  })

  socket.on('send-message', ({ uid, msg }) => {
    chatMessage.sendMessage(uid, user.name, msg)
  })
}

module.exports = { socketController }

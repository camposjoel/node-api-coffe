const URL = 'http://localhost:3000/api/auth'

let user = null
let socket = null

const txtUid = document.querySelector('#txtUid')
const txtMsg = document.querySelector('#txtMsg')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')

async function validateJwt() {
  const token = localStorage.getItem('token') || '';
  if (token.length <= 10) {
    window.location = 'index.html'
    throw new Error('No hay token en el servidor')
  }

  const res = await fetch(URL, {
    headers: { 'x-token': token }
  })

  const data = await res.json()

  localStorage.setItem('token', data.token)
  user = data.user

  document.title = user.name

  await connectSocket()
}

async function connectSocket() {
  const socket = new io({
    'extraHeaders': {
      'x-token': localStorage.getItem('token')
    }
  })

  socket.on('connect', () => {
    console.log('sockets online')
  })

  socket.on('disconnect', () => {
    console.log('sockets offline')
  })

  socket.on('catch-messages', (payload) => {
    console.log(payload)
  })

  socket.on('active-users', showUsers)

  socket.on('private-message', () => {
    //TODO
  })
}

const showUsers = (users = []) => {
  let usersHtml = ''
  users.forEach(user => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${user.name}</h5>
          <span class="fs-6 text-muted">${user.uid}</span>
        </p>
      </li>
    `
  })

  ulUsuarios.innerHTML = usersHtml
}

txtMsg.addEventListener('keyup', ({ keyCode }) => {
  const msg = txtMsg.value
  const uid = txtUid.value

  if (keyCode !== 13) { return; }
  if (msg.length === 0) { return; }

  socket.emit('send-message', { msg, uid })

  txtMsg.value = ''
})

async function main() {
  await validateJwt()
}

main()

// const socket = io()
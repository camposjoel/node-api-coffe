const URL = 'http://localhost:3000/api/auth/login'

const form = document.querySelector('form')

form.addEventListener('submit', event => {
  event.preventDefault()

  const formData = {}

  for (let element of form.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value
    }
  }

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  }).then(response => response.json())
  .then(({msg, token}) => {
    if (msg) {
      return console.error("Error:", msg)
    }

    localStorage.setItem("token", token)
    window.location = 'chat.html'
  })
  .catch(error => { console.log(error) })
})
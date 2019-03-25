const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $input = $messageForm.querySelector('input')
const $button = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $locations = document.querySelector('#locations')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('connection', (message) => {
    console.log(message)
})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('HH:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $button.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $button.removeAttribute('disabled')
        $input.value = ''
        $input.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')
    })
})

$locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocalization is not supported by your browser.')
    }

    $locationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationBtn.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })

    
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
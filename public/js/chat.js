const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $input = $messageForm.querySelector('input')
const $button = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#send-location')

socket.on('connection', (message) => {
    console.log(message)
})

socket.on('message', (message) => {
    console.log(message)
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


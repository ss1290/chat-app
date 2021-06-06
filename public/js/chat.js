const socket=io()

//Elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')


//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sideBarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll=()=>{
    //New message element
    const $newMessage=$messages.lastElementChild
    
    //Height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    //visible height
    const visibleHeight=$messages.offsetHeight

    //Height of messages container
    const containerHeight=$messages.scrollHeight

    //How far have I scrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}


socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

})
socket.on('locationMessage',(url)=>{

    console.log(url)
    const html=Mustache.render(locationTemplate,{
        username:url.username,
        url:url.location,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sideBarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
    $messageForm.addEventListener('submit',(e)=>{
        e.preventDefault()

        $messageFormButton.setAttribute('disabled','disabled')
        const message=e.target.elements.message.value

        socket.emit('Message',message,(error)=>{
            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.value=''
            $messageFormInput.focus()
            if(error){
                return console.log(error)
            }
            console.log('The message was delivered!')
        })
})

$sendLocationButton.addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }
     $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            long:position.coords.longitude,
            lat:position.coords.latitude
        },()=>{
            console.log('location shared!')
            $sendLocationButton.removeAttribute('disabled')
             
        })

    })
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
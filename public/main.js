const socket=io("http://localhost:4000",{});

const clientstotal=document.getElementById("clients-total");
const language=document.getElementById("languages");
const messagecontainer=document.getElementById('message-container');
const  nameinput=document.getElementById('name-input');
const messageForm=document.getElementById('message-form');
const messageInput=document.getElementById('message-input');

language.addEventListener('change', function() {
    const selectedValue =language.value;
   console.log(language.value);
    // Implement your logic here based on the selected language
  });

let audio=new Audio('sond.mp3.mp3');
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage();
})
socket.on('clients-total',(data)=>{
    clientstotal.innerHTML=`Online : ${data}`


   // console.log(data);
})

function sendMessage(){
    //console.log(messag)
    if(messageInput.value=='') return;
 const data={
        name: nameinput.value,
        message: messageInput.value,
        languagee:language.value,
        dateTime: new Date()
        
    }
    socket.emit('message',data);
    addMessage(true,data);
    messageInput.value='';






}
socket.on('chat-message',(data)=>{
   // console.log(data);
    addMessage(false,data);
    audio.play();


})

function addMessage(selfmessage,data)
{
    clearFeedback();
    const element=`  
    <li class="${selfmessage?'message-right' : 'message-left'}">
    <p class="message">
        ${data.message}
        <span>${data.name}</span>

    </p>
</li>
`
messagecontainer.innerHTML+=element;
scrollToBottom();



}
function scrollToBottom(){
    messagecontainer.scrollTo(0,messagecontainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameinput.value} is typing`
    })

})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameinput.value} is typing`
    })})
    messageInput.addEventListener('blur',(e)=>{
        socket.emit('feedback',{
            feedback:""
        })})



        socket.on('feedback',(data)=>{
            clearFeedback();
            const elee=`
            <li class="message-feedback">
            <p class="feedback" id="feedback">
                ${data.feedback}
            </p>
        </li>
            `
            messagecontainer.innerHTML+=elee;

        })
        function clearFeedback()
        {
            document.querySelectorAll('li.message-feedback').forEach(element=>{
                element.parentNode.removeChild(element);

            })
        }



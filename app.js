const express=require('express')
const app=express()


const PORT=process.env.PORT||4000
const server=app.listen(PORT,()=>console.log(`server running on port ${PORT}`))
const path=require('path');

const io=require('socket.io')(server);


app.use(express.static(path.join(__dirname,'public')))

io.on('connection',onconnect);

let noofsockets=new Set();
function onconnect(socket){
    //console.log(socket.id);
    noofsockets.add(socket.id);
    io.emit('clients-total',noofsockets.size);
    socket.on('disconnect',()=>{
        noofsockets.delete(socket.id);
        io.emit('clients-total',noofsockets.size);

    })

    socket.on('message',(data)=>{
        //bbb


        translateText(data.message,data.languagee)
        .then((res) => {
            console.log(data.language);
           
            data.message=res;
          //  console.log(c);
            socket.broadcast .emit('chat-message',data);
      })
      .catch((err) => {
           console.log(err);
        });
    
        
        
    })
    socket.on('feedback',(data)=>{
    
        socket.broadcast.emit('feedback',data)
    })

  
    



}


const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

// Your credentials
const CREDENTIALS =JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const detectLanguage = async (text) => {

    try {
        let response = await translate.detect(text);
        return response[0].language;
    } catch (error) {
        console.log(`Error at detectLanguage --> ${error}`);
        return 0;
    }
}

//  detectLanguage('hey there')
//     .then((res) => {
//        console.log(res);
//   })
//    .catch((err) => {
//       console.log(err);    });

const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};





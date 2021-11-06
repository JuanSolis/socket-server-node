const express = require("express");
const app = express();
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({
    origin: '*'
}));

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const server = http.createServer(app);

server.listen(3200, () => {
    console.log('listening on *:3200');
});

var io = require('socket.io')(server, {cors: {origin: "*"}});

io.on('connection', function(socket){
	  socket.on('sendActivation', function(state){
		  io.emit("sendActivationToClients", state);
      console.log("Conectado")
	});
 
});

var admin = require("firebase-admin");
var constValueMod = "False";
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-url-default-rtdb.firebaseio.com"
});

const db = admin.firestore(); 

app.get('/', (req, res) => {
    let db_response = [];
    db.collection("num_hexadecimales").get().then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
            const element = {};
            element.id = doc.id;
            element.hexa = doc._fieldsProto.hexa.stringValue;
            db_response.push(element);
        });
        res.json(db_response);
    });

  });

  app.post('/post_data',jsonParser, function(req, res) {
    const mensaje = {"hexa": ""};
    const dataparam = req.body.hexa;
    mensaje.hexa = dataparam;
    db.collection("num_hexadecimales").doc().set(mensaje)
  });

  app.post('/data_rasp',jsonParser, function(req, res) {
    const activacionRasp = {"rasp_Activation": ""};
    const dataparam_Rasp = req.body.rasp_Activation;
    activacionRasp.rasp_Activation = dataparam_Rasp;
    console.log(dataparam_Rasp);
    //db.collection("num_hexadecimales").doc().set(mensaje)
  });

  app.post('/data_ModWifi',jsonParser, function(req, res) {
    const activacionModWifi = {"modWifi_Activation": ""};
    const dataparam_ModWifi = req.body.modWifi_Activation;
    activacionModWifi.modWifi_Activation = dataparam_ModWifi;
    console.log(dataparam_ModWifi);
    constValueMod = dataparam_ModWifi;
    //db.collection("num_hexadecimales").doc().set(mensaje)
  });

  app.get('/data_ModWifi',jsonParser, function(req, res) {
    const dataparam_ModWifi = res.json({constValueMod});
    //db.collection("num_hexadecimales").doc().set(mensaje)
  });
  
  
  

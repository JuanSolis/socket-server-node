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
	console.log("----Cliente Conectado----");
	socket.on('stateChanged', function(state){
        console.log("Data mandada por Form de React")
		io.emit("updateState", state);
	});
});

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-url-default-rtdb.firebaseio.com"
});

const db = admin.firestore(); 

app.get('/', (req, res) => {
    let db_response = [];
    db.collection("Data_Response").get().then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
            const element = {};
            element.id = doc.id;
            element.mensaje = doc._fieldsProto.mensaje.stringValue;
            db_response.push(element);
        });
        res.json(db_response);
    });

  });

  app.post('/post_data',jsonParser, function(req, res) {
    const mensaje = {"mensaje": ""};
    const dataparam = req.body.postDataParam;
    mensaje.mensaje = dataparam;
    db.collection("Data_Response").doc().set(mensaje)
  });
  
  

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');

const { setupWebsocket } = require('./websocket')


const app = express();
const server = http.Server(app);

setupWebsocket(server);

 mongoose.connect('mongodb+srv://ominis:ominis10@omnistack-qtqtm.mongodb.net/week10?retryWrites=true&w=majority', { 
   useNewUrlParser: true,
   useUnifiedTopology: true,
   //useFindAndModify: true,
   //useCreateIndex: true 
  } );


app.use(cors()); 
app.use(express.json());
app.use(routes); 

// Metodos HTTP > GET, POST, PUT, DELETE
// Tipode de parametros:
// Query Params-: request.query (filtros, paginação, oredenação...)
// Route Params-: request.params ( identificar um ecurso na alteração ou na remoção)
// Body        -: request.body (dasos para criação ou alteração de um usuario)


app.listen(8002);

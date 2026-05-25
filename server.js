const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket } = require('./config/socket');

dotenv.config({
    path: './config.env'
});

const app = require('./app');

//Create http server
const server = http.createServer(app);

//Initialize Socket.io
initSocket(server);

//DB connection
const contString = process.env.CONNECTION_STRING;
mongoose.connect(contString)
.then((conn) =>  console.log("Connection to db successful"))
.catch((err) => console.log('Could not connect to MongoDB', err))


//Create and listen server
const port = process.env.PORT || 3000
server.listen(port, () => {
     console.log("Express Server is up and running..");
})
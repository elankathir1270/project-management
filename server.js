const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket } = require('./config/socket');
const logger = require('./utilities/logger');

dotenv.config({
    path: './config.env'
});

//Handling uncaught exception (sync code)
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION');
  logger.error(err);

  process.exit(1);
});

const app = require('./app');

//Create http server
const server = http.createServer(app);

//Initialize Socket.io
initSocket(server);

//DB connection
const contString = process.env.CONNECTION_STRING;
mongoose.connect(contString)
.then((conn) =>  logger.info("Connection to db successful"))//console.log("Connection to db successful")
.catch((err) => logger.error(err))//console.log('Could not connect to MongoDB', err)


//Create and listen server
const port = process.env.PORT || 3000
server.listen(port, () => {
    logger.info('Express Server is up and running..')
    //console.log("Express Server is up and running..");
})

//Handling rejected promise globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION');
  logger.error(err);

  process.exit(1);
});
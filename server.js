const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { initSocket } = require("./config/socket");
const { connectRedis } = require("./config/redis");
const logger = require("./utilities/logger");

dotenv.config({
  path: "./config.env",
});

//Handling uncaught exception (sync code)
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION");
  logger.error(err);

  process.exit(1);
});

const app = require("./app");

//Create http server
const server = http.createServer(app);

//Initialize Socket.io
initSocket(server);

const startServer = async () => {
  try {
    //DB connection
    await mongoose.connect(process.env.CONNECTION_STRING);
    logger.info("Connection to db successful");

    //Redis connection
    await connectRedis();

    //Create and listen server
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      logger.info("Express Server is up and running..");
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

startServer();

//Handling rejected promise globally
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION");
  logger.error(err);

server.close(() => {
    process.exit(1);
  });
});

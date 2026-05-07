const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env'
});

const app = require('./app')


//DB connection
const contString = process.env.CONNECTION_STRING;
mongoose.connect(contString)
.then((conn) =>  console.log("Connection to db successful"))
.catch((err) => console.log('Could not connect to MongoDB', err))


//Create and listen server
const port = process.env.PORT | 3000
app.listen(port, () => {
     console.log("Express Server is up and running..");
})
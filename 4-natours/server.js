const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })
const app = require('./app')

// const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const db = process.env.DATABASE_LOCAL;

// CONNECT TO THE DATABASE
mongoose
    .connect( db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then( () => console.log('db connection successfull!'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
});

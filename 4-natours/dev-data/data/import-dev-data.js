const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: '../../config.env' })

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

// READ JSON FILE
const tours = JSON.parse( fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8') );

// IMPORT DATA TO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfilly loaded!');
    } catch (err) {
        console.log(err);
    }
    // EXIT TERMINAL
    process.exit();
}

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// CHOOSE THE FUNCTION TO EXECUTE
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
} else {
    console.log("You haven't choose an argument!");
    process.exit();
}
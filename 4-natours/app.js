const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routers/tourRoutes')
const userRouter = require('./routers/userRoutes')

const app = express();

// CREATE MIDDLEWARE ------------------------------------------------------------------------------
if ( process.env.NODE_ENV === 'development' ) {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use( ( req, res, next ) => {
    req.requestTime = new Date().toISOString();
    next();
})

// CONFIGURATION OF ROUTES ------------------------------------------------------------------------
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;
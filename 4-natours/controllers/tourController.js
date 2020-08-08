const Tour = require('../models/tourModel')

// MIDDLEWARE -------------------------------------------------------------------------------------

// GET ALL TOURS REQUEST --------------------------------------------------------------------------
exports.getTours = async ( req, res ) => {
    try {
        // BUILD QUERY
        const queryObj = { ...req.query };
        const exFields = [ 'page', 'sort', 'limit', 'fields' ];
        exFields.forEach( field => delete queryObj[field] );

        const query = Tour.find(queryObj);

        // EXECUTE QUERY
        const tours = await query;
        
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

// GET SINGLE TOUR REQUEST ------------------------------------------------------------------------
exports.getTour = async ( req, res ) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

// CREATE NEW TOUR REQUEST ------------------------------------------------------------------------
exports.createTour = async ( req, res ) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

// UPDATE TOUR REQUEST ----------------------------------------------------------------------------
exports.updateTour = async ( req, res ) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

// DELETE TOUR REQUEST ----------------------------------------------------------------------------
exports.deleteTour = async ( req, res ) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
const Tour = require('../models/tourModel')

// MIDDLEWARE -------------------------------------------------------------------------------------
exports.aliasTopTours = ( req, res, next ) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage price';
    req.query.fields = 'name price ratingsAverage summary difficulty';
    next();
}


// GET ALL TOURS REQUEST --------------------------------------------------------------------------
exports.getTours = async ( req, res ) => {
    try {
        console.log(req.query);

        // 💥 BUILD QUERY =========================================

        // 1️⃣ ADVANCED FILTERING
        const queryObj = { ...req.query };
        const exFields = [ 'page', 'sort', 'limit', 'fields' ];
        exFields.forEach( field => delete queryObj[field] );
        let query = Tour.find(queryObj);

        // 2️⃣ SORTING
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        } else {
            query = query.sort('-createdAt');
        }

        // 3️⃣ FIELD LIMITING
        if (req.query.fields) {
            query = query.select(req.query.fields);
        } else {
            query = query.select('-__v');
        }

        // 4️⃣ PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        // 💥 EXECUTE QUERY =======================================
        const tours = await query;
        
        // 💥 SEND RESPONSE =======================================
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
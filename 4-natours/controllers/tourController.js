const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

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

        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // // 1️⃣ ADVANCED FILTERING
        // const queryObj = { ...req.query };
        // const exFields = [ 'page', 'sort', 'limit', 'fields' ];
        // exFields.forEach( field => delete queryObj[field] );
        // let query = Tour.find(queryObj);

        // // 2️⃣ SORTING
        // if (req.query.sort) {
        //     query = query.sort(req.query.sort);
        // } else {
        //     query = query.sort('-createdAt');
        // }

        // // 3️⃣ FIELD LIMITING
        // if (req.query.fields) {
        //     query = query.select(req.query.fields);
        // } else {
        //     query = query.select('-__v');
        // }

        // // 4️⃣ PAGINATION
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;
        // query = query.skip(skip).limit(limit);
        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error('This page does not exist');
        // }

        // 💥 EXECUTE QUERY =======================================
        const tours = await features.query;
        
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

exports.getTourStats = async ( req, res ) => {
    try {
        const stats = await Tour.aggregate([
            { $match: { ratingsAverage: { $gte: 4.5 } } },
            { $group: {
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            } },
            { $sort: { avgPrice: 1 } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })   
    }
}

exports.getMonthlyPlan = async ( req, res ) => {
    try {
        const { year } = req.params;
        const plan = await Tour.aggregate([
            { $unwind: '$startDates' },
            { $match: { startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }}},
            { $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }},
            { $addFields: { month: '$_id' } },
            { $project: { _id: 0 } },
            { $sort: { numTourStarts: -1, month: 1 } },
            { $limit: 12 }
        ])

        res.status(200).json({
            status: 'success',
            results: plan.length,
            data: {
                plan
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })   
    }
}
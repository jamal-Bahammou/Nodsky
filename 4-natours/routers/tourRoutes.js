const express = require('express')
const { getTours, createTour, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require('../controllers/tourController')
const router = express.Router()

// router.param('id', checkId);

router
  .route('/top-5-cheap')
  .get( aliasTopTours, getTours )

router
  .route('/monthly-plan/:year')
  .get(getMonthlyPlan)

router
  .route('/route-stats')
  .get(getTourStats)

router
  .route('/')
  .get(getTours)
  .post(createTour)

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)


module.exports = router;
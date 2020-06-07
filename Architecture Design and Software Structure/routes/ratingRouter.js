const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Ratings = require('../models/rating');

const ratingRouter = express.Router();

ratingRouter.use(bodyParser.json());

ratingRouter.route('/')
.get((req, res, next) => {
    Ratings.find({})
    .then((rating) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rating);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Ratings.create(req.body)
    .then((rating) => {
        console.log('Rating Submitted ', rating);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rating);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /ratings');
})
.delete((req, res, next) => {
    Ratings.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

ratingRouter.route('/:ratingId')
.get((req, res, next) => {
    Ratings.findById(req.params.ratingId)
    .then((rating) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rating);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /ratings/' + req.params.ratingId);
})
.put((req, res, next) => {
    Ratings.findByIdAndUpdate(req.params.ratingId, {
        $set: req.body
    }, { new: true })
    .then((rating) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rating);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Ratings.findByIdAndRemove(req.params.ratingId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = ratingRouter;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Subscribe = require('../models/subscribe');

const subsRouter = express.Router();

subsRouter.use(bodyParser.json());

subsRouter.route('/')
.get((req, res, next) => {
    Subscribe.find({})
    .then((subs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Subscribe.create(req.body)
    .then((sub) => {
        console.log('Subscribes Succesfully ', sub);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(sub);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /subscribe');
})
.delete((req, res, next) => {
    Subscribe.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

subsRouter.route('/:subId')
.get((req, res, next) => {
    Subscribe.findById(req.params.subId)
    .then((sub) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(sub);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /subscribe/' + req.params.dishId);
})
.put((req, res, next) => {
    Subscribe.findByIdAndUpdate(req.params.subId, {
        $set: req.body
    }, { new: true })
    .then((sub) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(sub);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Subscribe.findByIdAndRemove(req.params.subId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = subsRouter;
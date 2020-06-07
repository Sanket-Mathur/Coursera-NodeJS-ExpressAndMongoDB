const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Topics = require('../models/topics');

const topicRouter = express.Router();

topicRouter.use(bodyParser.json());

topicRouter.route('/')
.get((req, res, next) => {
    Topics.find({})
    .then((topics) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topics);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Topics.create(req.body)
    .then((topics) => {
        console.log('Topics Sent ', topics);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topics);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /topics');
})
.delete((req, res, next) => {
    Topics.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

topicRouter.route('/:topicId')
.get((req, res, next) => {
    Topics.findById(req.params.topicId)
    .then((topic) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topic);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /topics/' + req.params.topicId);
})
.put((req, res, next) => {
    Topics.findByIdAndUpdate(req.params.topicId, {
        $set: req.body
    }, { new: true })
    .then((topic) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(topic);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Topics.findByIdAndRemove(req.params.topicId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = topicRouter;
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('./crossOrigin')
const authenticate = require('../authenticate')
const Favorite = require('../models/favorite')


const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus = 200 })
.get(cors.cors, authenticate.verifyUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes')
	.then( (favorite) =>{
		if(favorite != null){
			res.statusCode = 200
			res.setHeader('content-type', 'application/json')
			res.json(favorite)
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) =>next(err))  
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.then( (user) =>{
		if(user == null){
			Favorite.create({user: req.user._id})
			.then( (favorite) =>{
				res.statusCode = 200
				res.setHeader('content-type', 'application/json')
				for(const i in req.body){
					favorite.dishes.push(req.body[i])
				}
				favorite.save()
				.then( (result) =>{
					res.json(result)
				}, (err) => next(err))
			}, (err) => next(err))
		}else{
			for(const j in req.body){
				if (user.dishes.indexOf(req.body[j]._id) == -1) {
					user.dishes.push(req.body[j])				
				}else{
					console.log('Dish '+ req.body[j]._id+' Already Exist!...')
				}
			}
			user.save()
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err) => next(err))	
		}
	}, (err) => next(err))	
	.catch( (err) =>next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
	res.statusCode = 403
	res.end('Put operation not supported on /favorites/')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.then((favorite) =>{
		if(favorite != null){
			Favorite.remove(favorite)
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err) => next(err))
			.catch( (err) => next(err))
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) => next(err))
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus = 200 })
.get(cors.cors, (req, res, next) =>{
	res.statusCode = 403
	res.end('Get operation not supported on /favorites/'+ req.params.dishId)
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
	res.statusCode = 403
	res.end('Put operation not supported on /favorites/'+ req.params.dishId)
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	Favorite.findOne({user: req.user._id})
	.then( (favorite) =>{
		if(favorite != null){
			if(favorite.dishes.indexOf(req.params.dishId) == -1){
				favorite.dishes.push(req.params.dishId)
			}else{ console.log('Already Exist!...')}
			favorite.save()
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err)=> next(err))
			.catch( (err) => next(err))
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) => next(err) )
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.then( (favorite) => {
		if(favorite != null){
			var indice
			if((indice = favorite.dishes.indexOf(req.params.dishId)) != -1){
				favorite.dishes.splice(indice, indice+1)
			}
			favorite.save()
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err) => next(err))
			.catch( (err) => next(err) ) 
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) => next(err) ) 
})
module.exports = favoriteRouter


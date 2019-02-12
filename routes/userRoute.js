var r = require('rethinkdb');
var connection = null;
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var config = require('../config');
var dbQ = require('../db');

var route = function(){

	var userRoute = express.Router();
	userRoute.route("/user")
		.get(function(req,res){
			var now;
			var token = req.headers['x-access-token'];
			r.db("crud").table("usersAuthLog").filter({"token":token}).run(req._rdb).then(c => c.toArray()).then(results => {
				r.now().toEpochTime().run(req._rdb).then(r => {
					now = r;
				});
				if (results.length == 0) {
					res.send({"message":"Invalid token"});
				} else{
					if(results[0]['expiresAt'] <= now){
						res.send({"message":"Expired user"});
					}else{
						r.db("crud").table("users").run(req._rdb).then(c => c.toArray()).then(result => {
							res.status(200).send(result);
						});
					}
				}
			});
		})
		.post(function(req,res){
			/*var token = req.headers['x-access-token'];
			console.log(req);
			r.db("crud").table("usersAuthLog").filter({"token":token}).run(req._rdb).then(c=>c.toArray()).then(results => {
				r.now().toEpochTime().run(req._rdb).then(rs => {
					now = rs;
				});
				if (results.length ==0) {
					res.send({"message":"Invalid token"});
				} else{
					if (results[0]['expiresAt'] <= now) {
						res.send({"message":"Expired user"});
					}
					else{
						
					}
				}
			});*/
			var name = req.body.name;
			var password = req.body.password;
			if (name == null || password == null) {
				res.status(404).send({'message':"Incorrect Data"});
			} else{
				password = bcrypt.hashSync(password,8);
				const data = {
					"name" : name,
					"password" : password,
					"createAt" : new Date
				};
				const genToken = {
					"name" : name,
					"password" : password,
				};
				r.db("crud").table("users").insert(data).run(req._rdb).then(result =>{
					if (result.inserted == 1) {
						var token = jwt.sign(genToken,config.bcrypt.secret,{expiresIn:86400});
						var createdDate = r.now().toEpochTime();
						var expiresDate = r.now().toEpochTime().add(86400);
						const logData = {
							"token" : token,
							"createAt" : new Date,
							"createdAt" : createdDate,
							"expiresAt" : expiresDate
						};
						r.db("crud").table("usersAuthLog").insert(logData).run(req._rdb).then(logresult => {
							if (logresult.inserted == 1) {
								res.status(200).send({"message":"User created sucessfully.","token":token});
							} else{
								res.status(404).send({'message':"Incorrect Data"});
							}
						});
					} else{
						res.status(404).send({'message':"Incorrect Data"});
					}
				});
			}
		});
	userRoute.route("/user/:userId")
		.put(function(req,res){
			var now;
			var userId = req.params.userId;
			var token = req.headers['x-access-token'];
			var name = req.body.name;
			var password = req.body.password;
			if (name == null || password == null) {
				res.status(404).send({'message':"Incorrect Data"});
			} 
			else {
				password = bcrypt.hashSync(password,8);
				const data = {
					"name" : name,
					"password" : password,
					"modifiedAt" : new Date
				};
				r.db("crud").table("usersAuthLog").filter({"token":token}).run(req._rdb).then(c => c.toArray()).then(results => {
					r.now().toEpochTime().run(req._rdb).then(r => {
						now = r;
					});
					if (results.length == 0) {
						res.send({"message":"Invalid token"});
					} else{
						if(results[0]['expiresAt'] <= now){
							res.send({"message":"Expired user"});
						}else{
							r.db("crud").table("users").get(userId).update(data).run(req._rdb).then(result => {
								if (result.replaced == 1) {
									res.send({"message":"user details updated"});		
								}
							});
						}
					}
				});
			}
		})
		.patch(function(req,res){
			var now;
			var userId = req.params.userId;
			var token = req.headers['x-access-token'];
			var name = req.body.name;
			var password = req.body.password;
			if (name == null || password == null) {
				res.status(404).send({'message':"Incorrect Data"});
			} 
			else {
				password = bcrypt.hashSync(password,8);
				const data = {
					"name" : name,
					"password" : password,
					"modifiedAt" : new Date
				};
				r.db("crud").table("usersAuthLog").filter({"token":token}).run(req._rdb).then(c => c.toArray()).then(results => {
					r.now().toEpochTime().run(req._rdb).then(r => {
						now = r;
					});
					if (results.length == 0) {
						res.send({"message":"Invalid token"});
					} else{
						if(results[0]['expiresAt'] <= now){
							res.send({"message":"Expired user"});
						}else{
							r.db("crud").table("users").get(userId).update(data).run(req._rdb).then(result => {
								if (result.replaced == 1) {
									res.send({"message":"user details updated"});		
								}
							});
						}
					}
				});
			}
		})
		.delete(function(req,res){
			var now;
			var userId = req.params.userId;
			var token = req.headers['x-access-token'];
			if (name == null || password == null) {
				res.status(404).send({'message':"Incorrect Data"});
			} 
			else {
				r.db("crud").table("usersAuthLog").filter({"token":token}).run(req._rdb).then(c => c.toArray()).then(results => {
					r.now().toEpochTime().run(req._rdb).then(r => {
						now = r;
					});
					if (results.length == 0) {
						res.send({"message":"Invalid token"});
					} else{
						if(results[0]['expiresAt'] <= now){
							res.send({"message":"Expired user"});
						}else{
							r.db("crud").table("users").get(userId).run(req._rdb).then(result => {
								if (result.replaced == 1) {
									res.send({"message":"deleted sucessfully"});		
								}
							});
						}
					}
				});
			}
		});
	return userRoute;
}

module.exports = route;
var express = require('express');
var r = require('rethinkdb');
var connection = null;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var config = require("../config");
var dbC = require("../db");

var routes = function(){

	var authRoute = express.Router();
	authRoute.route("/auth")
		.get(function(req,res){
			r.db("crud").table("users").run(req._rdb).then(c => c.toArray() ).then(r =>{
				console.log(r);
			});
		})
		.post(function(req,res){
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
				r.db("crud").table("users").insert(data).run(req._rdb).then(result =>{
					if (result.inserted == 1) {
						var token = jwt.sign(data,config.bcrypt.secret,{expiresIn:86400});
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
		})
	return authRoute;
}

module.exports = routes




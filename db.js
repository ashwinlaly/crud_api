'use strict';

var r = require('rethinkdb');
var config = require('./config');

module.exports.connect = function(req,res,next){
	(function _connect(){
		r.connect(config.rethinkdb,function(err,con){
			if (err) {
				return;
			}
			req._rdb = con;
			next();
		});
	})();
};

module.exports.close = function(req,res,next){
	(function _close(){
		req._rdb.close();
	})();
};
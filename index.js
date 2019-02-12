var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

/*Routes*/
var userRoute = require("./routes/userRoute")();
var authRoute = require("./routes/authRoute")();

/*config*/
var db = require("./db");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(db.connect);
app.use(userRoute);
app.use(authRoute);
app.use(db.close);

io.on("connection",function(socket){
	console.log("Connected");
});


app.get("/",function(req,res){
	res.sendFile(__dirname+"/views/index.html");
});

http.listen(1234,function(){
	console.log("hi");
});

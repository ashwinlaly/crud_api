npm i express -s
npm i body-parser -s
npm i rethinkdb -s

npm i socket.io -s

npm i jsonwebtoken -s
npm i bcryptjs -s



Rethink CMD:
	r.dbCreate("crud")
	r.db("crud").tableCreate("users")
	r.db("crud").tableList()
	
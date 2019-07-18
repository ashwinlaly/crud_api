<h1> Simple CRUD API using</h1>
	<p>1. node.js</p>
	<p>2. JWT token</p>
	<p>3. rethinkDB</p>
	
<br/>
<h3>Install the follwing node modules using the commands listed below</h3>
npm i express -s<br/>
npm i body-parser -s<br/>
npm i rethinkdb -s<br/>
npm i socket.io -s<br/>
npm i jsonwebtoken -s<br/>
npm i bcryptjs -s<br/>


<h3>Up the Rethink server and create the DB and table using the following command</h3>
<h4>Rethink CMD:</h4>
	r.dbCreate("crud")<br/>
	r.db("crud").tableCreate("users")<br/>
	r.db("crud").tableList()<br/>
	

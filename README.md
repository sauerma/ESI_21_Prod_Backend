# ESI 2021 - Production - Backend

This is the backend git repository of team production.


## Demo

*Demo Gif*


## Get started

### - Connect Lambda with MySql

1. Create empty folder (in your github backend repo) 
2. Start windows powershell
3. Navigate to folder
5. npm init
6. npm install mysql
7. Create an index.js file in same folder
8. Put following code in it (you can edit files with VS Code): <br><br><code>
var mysql = require('mysql');
var config = require('./config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });
exports.handler =  (event, context, callback) => {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query('---YOUR_SQL_CODE----', function (error, results, fields) {
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      if (error) callback(error);
      else callback(null,results[0].chargen_nr);
    });
  });
};</code><br><br>
9. Create config.json in your folder and put following code in it <br><br><code>
{
  "dbhost" : "----YOURHOST----",
  "dbname" : "----YOURDBNAME----",
  "dbuser" :"----YOURDBUSER----",
  "dbpassword" :"----YOURDBPASSWORD----"
}</code><br><br>
10.  Go in AWS Lambda and press "create function" in the right top corner. -> Set function name and node.js 14.x
11.  Zip all files in your folder
12.  Press "upload of .zip file" in the right top corner in AWS and upload your zipped files  


## Authors

- Julia Jillich
- David Krieg
- Evgeniya Puchkova
- Max Sauer





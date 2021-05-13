//-------------------------IMPORTS-------------------------//

const mysql = require('mysql2/promise');
var config = require('./config');


//-------------------------Global variables-------------------------//

var res;
var message;
var results = [];

//-------------------------Database Connection-------------------------//
const con = {
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port
};

//-------------------------Handler-------------------------//

exports.handler = async (event, context, callback) => {

  const pool = await mysql.createPool(con);

  return event;
}
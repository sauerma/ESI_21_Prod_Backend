//-------------------------IMPORTS-------------------------//

const mysql = require('mysql2/promise');
var config = require('./config');


//-------------------------Global variables-------------------------//

var res;
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

  try {

    //get all Customers
    await callDB(pool, getFortschritt());
    results = res;

    console.log("Data:", results);

    const response = {
      statusCode: 200,
      body: results
    };

    console.log(response);
    return response;
  }
  catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      "Error": "Function catched an error"
    };
  }
  finally {
    await pool.end();
  }
};

//-----------------------Helper----------------------//

async function callDB(client, queryMessage) {

  var queryResult;
  await client.query(queryMessage)
    .then(
      (results) => {
        queryResult = results[0];
        return queryResult;
      })
    .then(
      (results) => {
        //queryResult = results[0];
        console.log(JSON.parse(JSON.stringify(results)));
        res = JSON.parse(JSON.stringify(results));
        //console.log(res);
        return results
      })
    .catch(console.log)
};

//-----------------------Functions----------------------//	

const getFortschritt= function () {

  var queryMessage = "select round((sub.produced / (sub.producing + sub.produced))*100, 2) as fortschritt from ( SELECT sum(QUANTITY) as producing, (SELECT SUM(QUANTITY) from production.PLANNING_ORDERS WHERE PROD_STATUS = 2 and DATE(O_DATE) = DATE(sysdate())) as produced FROM production.PLANNING_ORDERS WHERE PROD_STATUS = 1 ) as sub;";

  return (queryMessage);
};
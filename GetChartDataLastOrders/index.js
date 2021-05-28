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
    await callDB(pool, getDataOfLastMonth());
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

const getDataOfLastMonth = function () {
  //Quantities of last month per day  
  var queryMessage = "SELECT DATE_FORMAT(END_DATE, '%d.%m.%Y') AS date, SUM(Quantity) AS quantity FROM production.PLANNING_ORDERS WHERE prod_status = 2 AND DATE_FORMAT(END_DATE, '%d.%m.%Y') <= DATE_FORMAT(SYSDATE(), '%d.%m.%Y') ORDER BY END_DATE;";

  return (queryMessage);
};

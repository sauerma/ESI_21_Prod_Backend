/*------------------------------------------------------------------*/
// Autor: ESI SoSe21 - Team production members
// Julia Jillich, David Krieg, Evgeniya Puchkova, Max Sauer
// Contact: jjilich@stud.hs-offenburg.de, dkrieg@stud.hs-offenburg.de,
//          epuchkova@stud.hs-offenburg.de, www.maxsauer.com
// File: Lambda GetKPIDataPrivatkunden
/*------------------------------------------------------------------*/

//-------------------------IMPORTS----------------------------------//
const mysql = require('mysql2/promise');
var config = require('./config');

//-------------------------Global variables-------------------------//
var res;
var results = [];

//-------------------------Database Connection----------------------//
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
    await callDB(pool, getPrivatkundenAnteil());
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
        console.log(JSON.parse(JSON.stringify(results)));
        res = JSON.parse(JSON.stringify(results));
        return results
      })
    .catch(console.log)
};

//-----------------------Functions----------------------//	
// Create Querymessage for the calculation of the key figure retail share
const getPrivatkundenAnteil = function () {
  var queryMessage = "SELECT ROUND((sub.private / (sub.private + sub.business)) * 100, 2) AS privatkunden FROM (SELECT COUNT(CUSTOMER_TYPE) AS business, (SELECT COUNT(CUSTOMER_TYPE) FROM production.PLANNING_ORDERS WHERE CUSTOMER_TYPE = 'P'and (prod_status = 1 OR prod_status = 2)) AS private FROM production.PLANNING_ORDERS WHERE CUSTOMER_TYPE = 'B' AND (prod_status = 1 OR prod_status = 2)) AS sub;";
  return (queryMessage);
};
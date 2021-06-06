/*-----------------------------------------------------------------------*/
// Autor: ESI SoSe21 - Team production members
// Julia Jillich, David Krieg, Evgeniya Puchkova, Max Sauer
// Contact: jjilich@stud.hs-offenburg.de, dkrieg@stud.hs-offenburg.de,
//          epuchkova@stud.hs-offenburg.de, www.maxsauer.com
// File: Lambda GetChartDataLastOrders
/*-----------------------------------------------------------------------*/

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

//-------------------------Handler----------------------------------//
exports.handler = async (event, context, callback) => {
  const pool = await mysql.createPool(con);
  try {
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
//Quantities of last month per day  
const getDataOfLastMonth = function () {
  var queryMessage = "SELECT DATE_FORMAT(END_DATE, '%d.%m.%Y') AS date, SUM(Quantity) AS quantity FROM production.PLANNING_ORDERS WHERE (prod_status = 3 or prod_status = 4 ) AND END_DATE < SYSDATE() AND END_DATE > DATE_SUB(SYSDATE(), INTERVAL 1 MONTH) GROUP BY DATE_FORMAT(END_DATE, '%d.%m.%Y') ORDER BY END_DATE;";
  return (queryMessage);
};
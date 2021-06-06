/*------------------------------------------------------------------*/
// Autor: ESI SoSe21 - Team production members
// Julia Jillich, David Krieg, Evgeniya Puchkova, Max Sauer
// Contact: jjilich@stud.hs-offenburg.de, dkrieg@stud.hs-offenburg.de,
//          epuchkova@stud.hs-offenburg.de, www.maxsauer.com
// File: Lambda GetProducedAndStoredOrders
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
    await callDB(pool, getProducedOrders());
    results = res;
    console.log(results);

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
const getProducedOrders = function () {
  var queryMessage = "SELECT po1.O_NR, po1.OI_NR, po1.PO_CODE, po1.PO_COUNTER, (select date_format(O_date, '%d.%m.%Y %H:%i') from production.PLANNING_ORDERS po2 where po2.o_nr = po1.o_nr and po2.oi_nr = po1.oi_nr and po2.po_code = po1.po_code and po2.po_counter = po1.po_counter) AS O_DATE, REPLACE (REPLACE(po1.CUSTOMER_TYPE, 'P', 'Privatkunde'), 'B', 'Businesskunde') as CUSTOMER_TYPE, po1.QUANTITY, REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(po1.PROD_STATUS, '0', 'In Planung'), '1', 'In Färbung'), '2', 'In Druck'), '3', 'Produziert'), '4', 'Eingelagert') as PROD_STATUS, po1.MAT_NR, po1.C, po1.M, po1.Y, po1.K, po1.HEXCOLOR, po1.PROD_PRIO, po1.IMAGE, po1.DELTA_E, REPLACE((select date_format(END_DATE, '%d.%m.%Y %H:%i') from production.PLANNING_ORDERS po3 where po3.o_nr = po1.o_nr and po3.oi_nr = po1.oi_nr and po3.po_code = po1.po_code and po3.po_counter = po1.po_counter), '00.00.0000 00:00', '' ) AS END_DATE, po1.p_nr FROM production.PLANNING_ORDERS po1 where prod_status = 3 or prod_status = 4 order by prod_prio;";
  return (queryMessage);
};
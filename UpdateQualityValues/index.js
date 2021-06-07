/*------------------------------------------------------------------*/
// Autor: ESI SoSe21 - Team production members
// Julia Jillich, David Krieg, Evgeniya Puchkova, Max Sauer
// Contact: jjilich@stud.hs-offenburg.de, dkrieg@stud.hs-offenburg.de,
//          epuchkova@stud.hs-offenburg.de, www.maxsauer.com
// File: Lambda UpdateQualityValues
/*------------------------------------------------------------------*/

//-------------------------IMPORTS----------------------------------//
const mysql = require('mysql2/promise');
var config = require('./config');
const axios = require('axios');

//-------------------------Global variables-------------------------//
var results = [];
var response = '';
var emptyRes = 'undefined';
var status = '';

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
    let data = JSON.stringify(event);
    data = JSON.parse(data);

    if (typeof data !== 'undefined' && data.length > 0) {
      await callDBupdateStatus(pool, updateStatus(data)); //Update Status intern
      await callDBupdateStatus(pool, updateValues(data));
      status = "Status Material erfolgreich geupdated.";

      const response = {
        statusCode: 200,
        body: status
      };

      console.log(response);
      return response;
    } else { status = "Empty input data."; }
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
async function callDBupdateStatus(client, queryMessage) {
  await client.query(queryMessage)
    .then(
      (results) => {
        console.log("Update Material Status" + results)
        return results;
      })
    .catch(console.log)
}

//-----------------------Functions----------------------//
// Create a query that updates the status of orders 
const updateStatus = function (data) {
  var where = "prodmat_id = " + data[0]["prodmat_id"];

  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      where += " or (prodmat_id = " + data[i]["prodmat_id"] + ")";
    }
  }
  var queryMessage = "UPDATE production.MATERIAL_PROD SET status = 1 WHERE " + where + "";
  return (queryMessage);
}

// Create a query that updates all quality characteristics
function updateValues(data) {
  var queryMessage = "INSERT INTO production.MATERIAL_PROD (prodmat_id,chargen_nr,whitness,ppml,absorbency,viscosity,delta_e) VALUES (" + data[0]["prodmat_id"] + "," + data[0]["chargen_nr"] + "," + data[0]["whiteness"] + "," + data[0]["ppml"] + "," + data[0]["absorbency"] + "," + data[0]["viscosity"] + "," + data[0]["delta_e"] + ")";

  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      queryMessage += ",(" + data[i]["prodmat_id"] + "," + data[i]["chargen_nr"] + "," + data[i]["whiteness"] + "," + data[i]["ppml"] + "," + data[i]["absorbency"] + "," + data[i]["viscosity"] + "," + data[i]["delta_e"] + ")";
    }
  }
  queryMessage += "ON DUPLICATE KEY UPDATE prodmat_id = VALUES (prodmat_id), chargen_nr = VALUES (chargen_nr),whitness = VALUES (whitness),ppml = VALUES (ppml),absorbency = VALUES (absorbency),viscosity = VALUES (viscosity),delta_e = VALUES (delta_e)";
  return (queryMessage);
}
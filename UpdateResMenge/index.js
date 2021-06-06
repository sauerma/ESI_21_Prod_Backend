/*------------------------------------------------------------------*/
// Autor: ESI SoSe21 - Team production members
// Julia Jillich, David Krieg, Evgeniya Puchkova, Max Sauer
// Contact: jjilich@stud.hs-offenburg.de, dkrieg@stud.hs-offenburg.de,
//          epuchkova@stud.hs-offenburg.de, www.maxsauer.com
// File: Lambda UpdateResMenge
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
      await callDBupdateStatus(pool, updateResMenge(data)); //Update Status intern
      status = "Res Menge erfolgreich geupdated.";

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
        console.log("Update Res Menge" + results)
        return results;
      })
    .catch(console.log)
}

//-----------------------Functions----------------------//
const updateResMenge = function (data) {
  var queryMessage = "UPDATE production.MATERIAL_PROD SET RES_QTY = " + data[0]["RES_QTY"] + " where prodmat_id = " + data[0]["prodmat_id"] + "";
  return (queryMessage);
}
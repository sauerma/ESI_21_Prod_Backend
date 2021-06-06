/*-----------------------------------------------------------------------*/
// Autor: ESI SoSe21 - Team production members
// Julia Jillich, David Krieg, Evgeniya Puchkova, Max Sauer
// Contact: jjilich@stud.hs-offenburg.de, dkrieg@stud.hs-offenburg.de,
//          epuchkova@stud.hs-offenburg.de, www.maxsauer.com
// File: Lambda CreateMaterialOrder
/*-----------------------------------------------------------------------*/

//-------------------------IMPORTS-------------------------//
const mysql = require('mysql2/promise');
var config = require('./config');

//-------------------------Global variables-------------------------//
var results = [];
var response = '';
var emptyRes = 'undefined';
var status = '';
var order = {};
var newProdNum = 0;
var res;

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
    let data = JSON.stringify(event);
    data = JSON.parse(data);

    if (typeof data !== 'undefined' && data.length > 0) {
      await callDBinsertOrder(pool, createMaterialOrder(data));
      status = "Order(s) erfolgreich erstellt";

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
async function callDBinsertOrder(client, queryMessage) {

  await client.query(queryMessage)
    .then(
      (results) => {
        console.log("Insered Material Orders" + results)
        return results;
      })
    .catch(console.log)
}

//-----------------------Functions----------------------//
//Create Querymessage to Insert incoming Material from MaWi
const createMaterialOrder = function (data) {
  var queryMessage = "INSERT INTO production.MATERIAL_PROD ( m_id_materialstype, quantity, RES_QTY, hexcolor, status) VALUES ( '" + data[0]["m_id_materialstype"] + "'," + data[0]["quantity"] + "," + data[0]["RES_QTY"] + ",'" + data[0]["hexcolor"] + "'," + 0 + ")";

  for (var i = 1; i < data.length; i++) {
    queryMessage += ", ( '" + data[i]["m_id_materialstype"] + "'," + data[i]["quantity"] + "," + data[i]["RES_QTY"] + ",'" + data[i]["hexcolor"] + "'," + 0 + ")";
  }
  return (queryMessage);
}


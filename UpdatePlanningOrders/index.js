//-------------------------IMPORTS-------------------------//

const mysql = require('mysql2/promise');
var config = require('./config');
const axios = require('axios');
 
//-------------------------Global variables-------------------------//

var results = [];
var response = '';
var emptyRes = 'undefined';
var status = '';


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

   await callDBupdateStatus(pool, updateProdStatus(data)); //Update Status intern
  
   //await updateVuVStatus(data); //Update Status Verkauf & Versand
   
   status = "Status erfolgreich geupdated.";

    const response = {
      statusCode: 200,
      body: status
    };

    console.log(response);
    return response;
  }
  
  else {status = "Empty input data."; }
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
        console.log("Update Production Status" + results)
        return results; 
      })
    .catch(console.log)
}
 
//-----------------------Functions----------------------//	


const updateProdStatus = function (data) {
  
  var where = "where (O_NR = " + data[0]["O_NR"] + " and OI_NR = " + data[0]["OI_NR"] + " and PO_CODE = '" + data[0]["PO_CODE"] + "' and PO_COUNTER = " + data[0]["PO_COUNTER"] + ")";
  
if (data.length > 1) {

 for (var i = 1; i < data.length; i++) {
    where += " or (O_NR = " + data[i]["O_NR"] + " and OI_NR = " + data[i]["OI_NR"] + " and PO_CODE = '" + data[i]["PO_CODE"] + "' and PO_COUNTER = " + data[i]["PO_COUNTER"] + ")";
 } 
  }
  
  var queryMessage = "UPDATE production.PLANNING_ORDERS SET prod_status = 1 " + where + "";

  return (queryMessage);
}
	
 /* async function updateVuVStatus(data) {
  
  if (data.length === 0 || data === undefined) return; 
  console.log("Sale Update:", data);

  axios.put('https://hfmbwiwpid.execute-api.eu-central-1.amazonaws.com/sales/orders/orderitems?status=3', data)
    .then((res) => {
      console.log(res.data);
      return data
    })
    .catch(error => {
      console.log(error);
    }) 
} */
 	

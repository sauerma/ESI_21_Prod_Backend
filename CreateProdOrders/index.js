//-------------------------IMPORTS-------------------------//

const mysql = require('mysql2/promise');
var config = require('./config');


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

   await callDBupdateStatus(pool, createProdOrder(data));
   
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
        console.log("Insered Production Orders" + results)
        return results;
      })
    .catch(console.log)
}
 
//-----------------------Functions----------------------//	


// const updateProdStatus = function (data) {
  
//   var where = "where (O_NR = " + data[0]["O_NR"] + " and OI_NR = " + data[0]["OI_NR"] + " and PO_CODE = '" + data[0]["PO_CODE"] + "' and PO_COUNTER = " + data[0]["PO_COUNTER"] + ")";
  
// if (data.length > 1) {

//  for (var i = 1; i < data.length; i++) {
//     where += " or (O_NR = " + data[i]["O_NR"] + " and OI_NR = " + data[i]["OI_NR"] + " and PO_CODE = '" + data[i]["PO_CODE"] + "' and PO_COUNTER = " + data[i]["PO_COUNTER"] + ")";
//  } 
//   }
  
//   var queryMessage = "UPDATE production.PLANNING_ORDERS SET prod_status = 2 " + where + "";

//   return (queryMessage);
// }

//Jenachdem wie die Daten reinkommen muss hier noch angepasst werden
function convertHexToCMYK(hex){
    var computedC = 0;
    var computedM = 0;
    var computedY = 0;
    var computedK = 0;
   
    hex = (hex.charAt(0)=="#") ? hex.substring(1,7) : hex;
   
    if (hex.length != 6) {
     console.log('ungültige Hexcode länge');   
     return; 
    }
    if (/[0-9a-f]{6}/i.test(hex) != true) {
     console.log('ungültige Zeichen im Hexcode');
     return; 
    }
   
    var r = parseInt(hex.substring(0,2),16); 
    var g = parseInt(hex.substring(2,4),16); 
    var b = parseInt(hex.substring(4,6),16); 
   
    // Ausnahme Schwarz
    if (r==0 && g==0 && b==0) {
     computedK = 1;
     return [0,0,0,1];
    }
   
    computedC = 1 - (r/255);
    computedM = 1 - (g/255);
    computedY = 1 - (b/255);
   
    var minCMY = Math.min(computedC,Math.min(computedM,computedY));
   
    computedC = (computedC - minCMY) / (1 - minCMY) ;
    computedM = (computedM - minCMY) / (1 - minCMY) ;
    computedY = (computedY - minCMY) / (1 - minCMY) ;
    computedK = minCMY;
   
    return [computedC,computedM,computedY,computedK];   
}
//Test
convertHexToCMYK("#ABDFA1");

//WIP
const createProdOrder = function (data) {
  var queryMessage = "INSERT INTO production.PLANNING_ORDERS (O_NR, OI_NR, PO_CODE, PO_COUNTER, CUSTOMER_TYPE, QUANTITY, PROD_STATUS, MAT_NR, C, M, Y, K, HEXCOLOR, PROD_PRIO, IMAGE,O_DATE) VALUES "(data[i]["O_NR"], data[i]["OI_NR"], data[i]["PO_CODE"], data[i]["PO_COUNTER"], data[i]["CUSTOMER_TYPE"], data[i]["QUANTITY"], data[i]["PROD_STATUS"], data[i]["MAT_NR"], data[i]["C"], data[i]["M"], data[i]["Y"], data[i]["K"], data[i]["HEXCOLOR"], data[i]["PROD_PRIO"], data[i]["IMAGE"],data[i]["O_DATE"]);
  // INSERT INTO `production`.`PLANNING_ORDERS` (`O_NR`, `OI_NR`, `PO_CODE`, `PO_COUNTER`, `CUSTOMER_TYPE`, `QUANTITY`, `PROD_STATUS`, `MAT_NR`, `C`, `M`, `Y`, `K`, `HEXCOLOR`, `PROD_PRIO`, `IMAGE`, ) VALUES ('102', '123', 'N', '99', 'P', '99', '0', '123', '5', '6', '4', '9', '#965212', '1', '/images/shirt123.png');


  return (queryMessage);
}
	

//Testedatensatz


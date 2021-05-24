//-------------------------IMPORTS-------------------------//

const mysql = require('mysql2/promise');
var config = require('./config');


//-------------------------Global variables-------------------------//

var results = [];
var response = '';
var emptyRes = 'undefined';
var status = '';
var order = {};


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
  

   await callDBinsertOrder(pool, createProdOrder(data));
   status = "Order erfolgreich erstellt";

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

async function callDBinsertOrder(client, queryMessage) {
  
  await client.query(queryMessage)
    .then(
      (results) => {
        console.log("Insered Production Orders" + results)
        return results;
      })
    .catch(console.log)
}
 
//-----------------------Functions----------------------//	

function convertHexToCMYK(hexvalue){
    var computedC = 0;
    var computedM = 0;
    var computedY = 0;
    var computedK = 0;
   
    hexvalue = (hexvalue.charAt(0)=="#") ? hexvalue.substring(1,7) : hexvalue;
   
    if (hexvalue.length != 6) {
     console.log('ungültige Hexcode länge');   
     return; 
    }
    if (/[0-9a-f]{6}/i.test(hexvalue) != true) {
     console.log('ungültige Zeichen im Hexcode');
     return; 
    }
   
    var r = parseInt(hexvalue.substring(0,2),16); 
    var g = parseInt(hexvalue.substring(2,4),16); 
    var b = parseInt(hexvalue.substring(4,6),16); 
   
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

    order.C = computedC;
    order.M = computedM;
    order.Y = computedY;
    order.K = computedK;
}

function declarePrioOfOrder(data){
  let prio;

  if(data["PO_CODE"] == "P"){
    prio = 4;
  }
  if(data["CUSTOMER_TYPE"] == "B"){
    prio = 3;
  }
  if(data["CUSTOMER_TYPE"] == "P"){
    prio = 2;
  }  
  if(data["PO_CODE"] == "R"|| data["PO_CODE"] =="Q"){
    prio = 1;
  }

  if(Math.abs(data["O_DATE"] - getDateTime() > 172800000)){
    if(prio > 1){      
      // console.log("Prio wird um eins hochgesetzt da Auftrag schon 48h liegt");
      prio = prio-1;      
    }
  }
  order.PROD_PRIO = prio;
}

function getDateTime(){
 
  var now = new Date();
  var onlyDate = now.toISOString().slice(0, 10);
  var hh = ("0" + ((now.getHours())+2)).slice(-2);
  var mm = ("0" + now.getMinutes()).slice(-2);
  var ss = ("0" + now.getSeconds()).slice(-2);
  var time = "" + hh + ":" + mm + ":" + ss;
  var dateTime = " "+ onlyDate + " " + time + "";
  
  return dateTime;
}

const createProdOrder = function (data) {
  declarePrioOfOrder(data[0]);
  convertHexToCMYK(data[0]["HEXCOLOR"]);

  var queryMessage = "INSERT INTO production.PLANNING_ORDERS (O_NR, OI_NR, PO_CODE, PO_COUNTER, CUSTOMER_TYPE, QUANTITY, PROD_STATUS, MAT_NR, C, M, Y, K, HEXCOLOR, PROD_PRIO, IMAGE,O_DATE) VALUES ( " + data[0]["O_NR"] +","+ data[0]["OI_NR"]+",'" + data[0]["PO_CODE"]+ "',"+data[0]["PO_COUNTER"]+", '"+ data[0]["CUSTOMER_TYPE"]+"',"+ data[0]["QUANTITY"]+", 0, 0,"+order.C+ "," +order.M+ "," +order.Y+ ","+ order.K+ ",'"+data[0]["HEXCOLOR"]+"'," +order.PROD_PRIO+ ",'"+data[0]["IMAGE"]+"','"+data[0]["O_DATE"]+"')";

  return (queryMessage);
}


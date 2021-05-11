//Dummy Data for the CSV File
// var csvFileData = [
//     ['2021-06-06T15:00:00.000Z', '3424564', '2', '10', '#h8798', '54654', '/images/shirt566644.png'],
//     ['2021-06-06T15:00:00.000Z', '423444', '1', '12', '##97123', '123123', '/images/shirt566644.png'],
//     ['2021-06-06T15:00:00.000Z', '321321', '5', '7', '##97123', '123123', '/images/shirt566644.png'],
// ];
var csvFileData = [];

function download_csv_file() { 

    //heading for each row of the data  
    // var csv = 'Bestelldatum,BestellNr,ProduktionsNr,Menge,HexWert,Farbe,Bild\n';
    var csv = 'Bestelldatum,BestellNr,ProduktionsNr,Menge,Status,HexWert,Farbe,Priorität,Bild\n';

    //merge the data with CSV  
    csvFileData.forEach(function(row) {
        csv += row.join(',');
        csv += "\n";
    });

    //display the created CSV data on the web browser   
    document.write(csv);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    //name for the CSV file to be downloaded  
    hiddenElement.download = 'MachineConfiguration.csv';
    hiddenElement.click();
}

//    // let targets = document.querySelectorAll("")
//    console.log(this)

//    let main = this.closest(".jss10")
//    console.log(main)

//    let targets = main.querySelectorAll("input[type=checkbox]").filter(":checked")
//    console.log(targets)

//    targets.forEach((elem) => {
//        let row = elem.closest(".MuiTableRow-root")
//        console.log(row)

//        let cols = row.getElementsByTagName("td") 

//        console.log(cols)
//    })
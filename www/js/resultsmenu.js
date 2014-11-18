var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getMenu, errorCB, successCB);
}
db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
console.log("LOCALDB - Database ready");
db.transaction(getMenu, errorCB, successCB);

function errorCB(err) {
    console.log("Error processing SQL: "+err.message);
    //alert("Error processing SQL loaddata: "+err.code);
}


// Transaction success callback
//
function successCB() {
    //  alert("success!");
}



function getMenu(tx) {
    var sql = "select Distinct DivisionName,DivisionID from MobileApp_Results_Menu Group by DivisionName,DivisionID  order by DivisionOrderID";
   // var sql = "select Distinct DivisionName,DivisionID from MobileApp_Schedule_Menu Group by DivisionName,DivisionID  order by DivisionOrderID";


    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);



        $('#mainmenu').append('<Div class="divmain"><a href="results.html?id=' + menu.DivisionID + '">' +

            '<span >' + menu.DivisionName + '</span></a></Div>');
    }

    db = null;
}
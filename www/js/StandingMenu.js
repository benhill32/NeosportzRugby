var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReadyschmenu, false);

function onDeviceReadyschmenu() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getMenu, errorCB, successCB);
}

function errorCB(err) {
    console.log("Error processing SQL: "+err.message);
    //alert("Error processing SQL loaddata: "+err.code);
}


// Transaction success callback
//
function successCB() {
    //  alert("success!");
}

tx.executeSql('INSERT INTO MobileApp_Results_Table_Menu (_id, TournamentName,UpdateDateUTC ,OrderID ) VALUES (' + obj._id + ',"' + obj.TournamentName + '", "' + obj.UpdateDateUTC + '",' + obj.OrderID + ')');


function getMenu(tx) {


    var sql = "select _id, TournamentName,UpdateDateUTC ,OrderID from MobileApp_Results_Table_Menu  order by OrderID,TournamentName";


    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        $('#mainmenustandingmenu').append('<Div class="divmainmenunew" onclick="redirectstandings(' + menu._id + ')" >' +

            '<span >' + menu.TournamentName + '</span></Div>');
    }


}

function redirectstandings(ID){

    window.location = "../pages/standings.html?id=" + ID;
}
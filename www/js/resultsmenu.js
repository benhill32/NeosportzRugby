var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReadyresmenu, false);

function onDeviceReadyresmenu() {

    db.transaction(getMenu, errorCBfunc, successCBfunc);
}





function getMenu(tx) {
    var sql = "select Distinct DivisionName,DivisionID from MobileApp_Results_Menu Group by DivisionName,DivisionID  order by DivisionOrderID";
    // var sql = "select Distinct DivisionName,DivisionID from MobileApp_Schedule_Menu Group by DivisionName,DivisionID  order by DivisionOrderID";


   // alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
  //  alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);



        $('#mainmenuresultsch').append('<Div class="divmainmenunew" onclick="redirectresults(' + menu.DivisionID + ')" >' +

        '<span >' + menu.DivisionName + '</span></Div>');
    }

    db = null;
}

function redirectresults(ID){

    window.location = "../pages/results.html?id=" + ID;
}
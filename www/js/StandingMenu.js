var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReadysstandmenu, false);

function onDeviceReadysstandmenu() {

    db.transaction(getMenu, errorCBfunc, successCBfunc);
}

function getMenu(tx) {
    var sql = "select _id, TournamentName,UpdateDateUTC ,OrderID from MobileApp_Results_Table_Menu  order by OrderID,TournamentName";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
   // alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        $('#mainmenustandingmenu').append('<Div class="divmainmenunew" onclick="redirectstandings(' + menu._id + ')" >' +

        '<span >' + menu.TournamentName + '</span></Div>');
    }


}

function redirectstandings(ID){

    window.location = "../pages/standings.html?id=" + ID;
}
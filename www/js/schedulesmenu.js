var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReadyschmenu, false);

function onDeviceReadyschmenu() {

        db.transaction(getMenu, errorCBfunc, successCBfunc);
}



function getMenu(tx) {


    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Schedule_Menu where Hide = 0 Group by DivisionName,DivisionID  order by DivisionOrderID";
  //  alert(sql);

    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
  //  alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);


        $('#mainmenuschmenu').append('<Div class="divmainmenunew" onclick="redirectschedules(' + menu._id + ')" >' +

            // $('#mainmenuschmenu').append('<Div class="divmainmenunew"><a href="schedules.html?id=' + menu.DivisionID + '">' +

        '<span >' + menu.DivisionName + '</span></Div>');
    }


}

function redirectschedules(ID){

    window.location = "../pages/schedules.html?id=" + ID;
}
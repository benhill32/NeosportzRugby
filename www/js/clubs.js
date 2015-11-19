var db;
var IDhist = 0;
var IDcon = 0;
var ID = 0;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
 //   db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");


    db.transaction(getfirstclub, errorCBfunc, successCBfunc);

   //
}


function getfirstclub(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getfirstclub_success);
}


function getMenu_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);
    $('#divhistory').empty();
    $('#divContacts').empty();
    $('#divTeams').empty();
    $('#divPlayers').empty();
    $('#btnclub').empty();
    $('#btnclub').empty();
    $('#btnclub').append(menu.name);

    $('#divhistory').append(menu.History);
    $('#divContacts').append(menu.Contacts);
    $('#divTeams').append();
    $('#divPlayers').append();
    ID = menu.ID;

}


function getdataminus(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs where ID < " + ID + "  ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getdataplus(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs where ID > " + ID + " ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {

    var len = results.rows.length;
//alert(len);
    $('#divhistory').empty();
    $('#divContacts').empty();
    $('#divTeams').empty();
    $('#divPlayers').empty();
    $('#btnclub').empty();

        var menu = results.rows.item(0);
        var imgg = "";
            if(menu.Base64 != "null"){
                imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  align="left" height="40">';
            }


    $('#btnclub').append(menu.name);
    ID = menu.ID;


        $('#divhistory').append(menu.History);
        $('#divContacts').append(menu.Contacts);
        $('#divTeams').append();
        $('#divPlayers').append();


}


function getpervoiusclub(){


    db.transaction(getdataminus, errorCBfunc, successCBfunc);


}
function getnextclub(){



    db.transaction(getdataplus, errorCBfunc, successCBfunc);


}








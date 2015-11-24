var db;
var IDhist = 0;
var IDcon = 0;
var ID = 0;
var FirstID = 0;
var LastID = 0;
var clubname = 0;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
 //   db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getfirstclub, errorCBfunc, successCBfunc);

    alert("Fav " + window.localStorage.getItem("teamfollow"));
}

function getfirstclub(tx) {

    var sql = "select ID from MobileApp_clubs WHERE DeletedateUTC = 'null' ORDER BY ID ASC LIMIT 1";
    alert(sql);
    tx.executeSql(sql, [], getfirstclub_success);
}


function getfirstclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);


    FirstID = menu.ID;

    db.transaction(getlastclub, errorCBfunc, successCBfunc);

}

function getlastclub(tx) {

    var sql = "select ID from MobileApp_clubs WHERE DeletedateUTC = 'null' ORDER BY ID DESC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getlastclub_success);
}


function getlastclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);


    LastID = menu.ID;

    db.transaction(getclub, errorCBfunc, successCBfunc);

}

function getclub(tx) {
    var sql = "";
    if(window.localStorage.getItem("fliter") == 0){

        sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID ASC LIMIT 1";

        $('#spanleft').show();
        $('#spanright').show();

    }else{
        sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs WHERE ID = " + window.localStorage.getItem("teamfollow") + "  ASC LIMIT 1";

        $('#spanleft').hide();
        $('#spanright').hide();
    }

     //alert(sql);

    tx.executeSql(sql, [], getclub_success);
}


function getclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);
    $('#divhistory').empty();
    $('#divContacts').empty();
    $('#divTeams').empty();
    $('#divPlayers').empty();
    $('#btnclub').empty();
    $('#btnclub').empty();
    $('#btnclub').append(menu.name);
    clubname = menu.ID;
    $('#divhistory').append(menu.History);
    $('#divContacts').append(menu.Contacts);

if(menu.ID == window.localStorage.getItem("teamfollow")){

    $('#spanfullstar').show();
    $('#spanemptystar').hide();


}else{
    $('#spanfullstar').hide();
    $('#spanemptystar').show();


}


    ID = menu.ID;
    $('.panel-info').show();





    db.transaction(getteams, errorCBfunc, successCBfunc);
    db.transaction(getplayers, errorCBfunc, successCBfunc);
}


function addfollow() {
    alert("add");
    addfavteam(clubname);
    //force only one fav
    clearotherfavteam(clubname);

    addfavclub();
    //db.transaction(getfirstclub, errorCBfunc, successCBfunc);
}

function removefollow() {
    alert("remove");
    clearcurrentfavteam(clubname);

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0');
        console.log("Update MobileApp_LastUpdatesec");
    });

   // db.transaction(getfirstclub, errorCBfunc, successCBfunc);
}




function getdataminus(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs where ID < " + ID + "  ORDER BY ID Desc LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getdataminus2(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID Desc LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getdataplus(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs where ID > " + ID + " ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}
function getdataplus2(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID ASC LIMIT 1";
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



    $('#btnclub').append(menu.name);
    ID = menu.ID;


        $('#divhistory').append(menu.History);
        $('#divContacts').append(menu.Contacts);

    clubname = menu.ID;

    if(menu.ID == window.localStorage.getItem("teamfollow")){

        $('#spanfullstar').show();
        $('#spanemptystar').hide();


    }else{
        $('#spanfullstar').hide();
        $('#spanemptystar').show();


    }


    db.transaction(getteams, errorCBfunc, successCBfunc);
    db.transaction(getplayers, errorCBfunc, successCBfunc);
    $('.panel-info').show();
}


function getpervoiusclub(){

    if(FirstID == ID) {
        db.transaction(getdataminus2, errorCBfunc, successCBfunc);
    }else{
        db.transaction(getdataminus, errorCBfunc, successCBfunc);
    }

}
function getnextclub(){


    if(LastID == ID) {
        db.transaction(getdataplus2, errorCBfunc, successCBfunc);
    }else{
        db.transaction(getdataplus, errorCBfunc, successCBfunc);
    }



}


function getteams(tx) {
    var sql = "select Name ,DivisionName,ClubID from MobileApp_vwApp_Teams where ClubID=" + ID;
    tx.executeSql(sql, [], getteam_success);
}


function getteam_success(tx, results) {

    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        $('#divTeams').append(menu.Name + " - " + menu.DivisionName + "<br>");
    }

}

function getplayers(tx) {
    var sql = "select ID,_id,ClubID,FullName,Base64,TeamID,Position from MobilevwApp_Base_Players where DeletedateUTC = 'null' and ClubID=" + ID;
    // alert(sql);
    tx.executeSql(sql, [], getteamplayer_success);
}

function getteamplayer_success(tx, results) {

    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);



        $('#divPlayers').append(menu.FullName + " - " + menu.Position + "<br>");
    }



}
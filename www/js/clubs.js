var db;


var IDhist = 0;
var IDcon = 0;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getdata, errorCBfunc, successCBfunc);
}
//db.transaction(getdata, errorCBfunc, successCBfunc);






function getdata(tx) {
    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,History,Contacts,UpdateSecondsUTC,Color from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
            if(menu.Base64 != "null"){
                imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  align="left" height="40">';
            }

            $('#mainmenu').append('<Div class="mainmenuresult" align="left"  >' +
                '<div class="bold size13" style="padding-bottom:7px;"   >' + imgg + menu.name  +
                '<img src="../img/info.png" height="25" align="right" data-toggle="modal" data-target="#basicModalContact" onclick="loadcontacts(' + menu.ID + ')">' +
                '<img src="../img/team.png" onclick="redirectplayer(' + menu.ID + ')"    align="right" height="25">' +
                '</div>' +
                '<div class="size11" data-toggle="modal" data-target="#basicModalclub" onclick="loadhistory(' + menu.ID + ')">' + menu.History.substring(0,200) + '....<span' +
                'data-toggle="modal" class="size11 blue" data-target="#basicModalclub" onclick="loadhistory(' + menu.ID + ')"  >Read More</span></div>' +
                '</Div>');
    }

}

function redirectplayer(ID){

window.location = "../pages/clubteams.html?ID=" + ID
}

function loadhistory(ID){
    IDhist = ID;
    $('body').css('position','fixed');
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    db.transaction(gethistory, errorCBfunc, successCBfunc);

}

function gethistory(tx) {

    var sql = "select History from MobileApp_clubs where ID=" + IDhist;
  //  alert(sql);
    tx.executeSql(sql, [], gethistory_success);
}

function gethistory_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

        var menu = results.rows.item(0);
        $('#modelhistory').empty();
    $('#modelhistory').append( '<div>1</div>');
    $('#modelhistory').empty();
        $('#modelhistory').append( '<div>' + menu.History + '</div>');
}


function loadcontacts(ID){
    IDcon = ID;
   // db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    db.transaction(getcontacts, errorCBfunc, successCBfunc);

}

function getcontacts(tx) {

    var sql = "select Contacts from MobileApp_clubs where ID=" + IDcon;
    //  alert(sql);
    tx.executeSql(sql, [], getcontacts_success);
}

function getcontacts_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    var menu = results.rows.item(0);
    $('#modelcontact').empty();
    $('#modelcontact').append( '<div>' + menu.Contacts + '</div>');

}
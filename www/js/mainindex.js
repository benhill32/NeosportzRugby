document.addEventListener("deviceready", onDeviceReady, false);
var deviceIDfunc;
function onDeviceReady() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getbackground, errorCBfunc, successCBfunc);
    deviceIDfunc = device.uuid;
    loadindexmessage();
}

function loadindexmessage() {
    db.transaction(checkclubsinsert, errorCBfunc, successCBfunc);
}

function checkclubsinsert(tx){
    var sql = "select ID from MobileApp_clubs";
   //  alert(sql);
    tx.executeSql(sql, [], checkclubsinsert_success);

}

function checkclubsinsert_success(tx, results) {
    var len = results.rows.length;

    if(len != 0) {
        db.transaction(gethasclub, errorCBfunc, successCBfunc);
    }
}

function getbackground(tx) {
   // alert($('#mainbackground').css('opacity'));

    var sql = "select Base64 from MobileApp_clubs where Fav =1 LIMIT 1";
     //alert(sql);
    tx.executeSql(sql, [], getbackground_success);
}

function getbackground_success(tx, results) {

    var len = results.rows.length;
    if(len != 0) {
        var menu = results.rows.item(0);

        var base64 = menu.Base64;

        $('#mainbackground').css('background-image', 'url(data:image/png;base64,' + base64 + ')');
    }
}



function gethasclub(tx) {
    var sql = "select hasclub,hasclubdate from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gethasclub_success);
}


function gethasclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);

    var hasclub = menu.hasclub;
    var hasclubdate =menu.hasclubdate;

    var da4 = new Date();
    var na4 = da4.getTime();

    var dif = na4-hasclubdate;


    if(hasclub == 0){
 //   if(hasclub == 0 && dif > "600000"){
      //  alert($('#mainfore').attr('class'));
            $('#mainfore').removeClass('mainforeground');
            $('#mainfore').addClass('mainforeground2');
      // alert($('#mainfore').attr('class'));
            $('#basicModalnofav').modal('show');
    }

}

function hadclubfunction(){

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 1');
        console.log("Update MobileApp_LastUpdatesec");
    });
    clearcurrentfavteam(344);
  //  passscoretoserver("Favclub=0&deviceid=" + deviceIDfunc + "&token=" + apptoken)


    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');
}


function hadclubchecklater(){
    var daa = new Date();
    var naa = daa.getTime();

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0, hasclubdate = "' + naa + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');


}

function choosefacteam(ID){

    clearfavteam();

    addfavteam(ID);

    var daaa = new Date();
    var naaa = daaa.getTime();

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 1, hasclubdate = "' + naaa + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');

}


function showclubsfun(){

    db.transaction(getclubsfav, errorCBfunc, successCBfunc);
    $('#basicModalteams').modal('show');


    $('#mainfore').removeClass('mainforeground');
    $('#mainfore').addClass('mainforeground2');

}


function getclubsfav(tx) {
    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,History,Contacts,UpdateSecondsUTC,Color from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getclubsfav_success);
}


function getclubsfav_success(tx, results) {
   // $('#busy').hide();
    var len = results.rows.length;choosefacteam
//alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#clubfav').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosefacteam('+ menu.ID + ')"  >' +
            '<div class="bold size13"   >' + menu.name  +
            '</div>' +
            '</Div>');
    }

}
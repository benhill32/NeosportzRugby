var db;
var orientationstand = "";
var Base64 = "";

document.addEventListener("deviceready", onDeviceReadysplashscreen, false);

function onDeviceReadysplashscreen() {
    deviceIDfunc = device.uuid;

    db.transaction(getbackground, errorCBfunc, successCBfunc);
}


function getorientsplash(strorein){
    orientationstand = strorein;
    //  alert(orientationstand);
    db.transaction(getbackground, errorCBfunc, successCBfunc);
}


function getbackground(tx) {
   // alert($('#mainbackground').css('opacity'));

    var sql = "select Base64 from Mobilescreenimage order by UpdateDateUTC desc LIMIT 1";
     //alert(sql);
    tx.executeSql(sql, [], getbackground_success,getbackground_error);
}

function getbackground_success(tx, results) {


    var len = results.rows.length;
   // alert(len);
    if(len != 0) {
        var menu = results.rows.item(0);
        Base64 = menu.Base64;
        db.transaction(getbackground2, errorCBfunc, successCBfunc);
    }else{
        window.location.href='../index.html';
    }
}


function getbackground2(tx) {
    var sql = "select URLLINK from Mobilescreenimage order by UpdateDateUTC desc LIMIT 1";
    tx.executeSql(sql, [], getbackground_success2,getbackground2_error);
}

function getbackground_success2(tx, results) {

    var len = results.rows.length;
    //- alert(len);
    if(len != 0) {
        var menu = results.rows.item(0);
        $('#splashscreen').empty();
        $('#splashscreen').append('<img id="screensplashimg" style="max-height:100%;max-width:100%" onclick="URLredirect(\'' + menu.URLLINK + '\')" src="data:image/png;base64,' + Base64 + '">');

        window.setTimeout(function(){
            window.location.href='../index.html';
        }, 7000);


    }
}


function getbackground2_error(err) {
    $('#splashscreen').empty();
    $('#splashscreen').append('<img id="screensplashimg" style="max-height:100%;max-width:100%" src="data:image/png;base64,' + Base64 + '">');

    window.setTimeout(function(){
        window.location.href='../index.html';
    }, 7000);

}

function getbackground_error(err) {


        window.location.href='../index.html';


}



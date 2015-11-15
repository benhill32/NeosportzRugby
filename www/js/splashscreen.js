var db;
var orientationstand = "";
var Base64 = "";

document.addEventListener("deviceready", onDeviceReadysplashscreen, false);

function onDeviceReadysplashscreen() {
    deviceIDfunc = device.uuid;

    db.transaction(getbackground, errorCBfunc, successCBfunc);
}




function getbackground(tx) {
   // alert($('#mainbackground').css('opacity'));

    var sql = "select _id,Base64 from Mobilescreenimage order by UpdateDateUTC desc LIMIT 1";
    /// alert(sql);
    tx.executeSql(sql, [], getbackground_success,getbackground_error);
}

function getbackground_success(tx, results) {


    var len = results.rows.length;
   //alert("LEngth : " + len);
    if(len != 0) {
        var menu = results.rows.item(0);
       // alert(menu._id);
        Base64 = menu.Base64;
        db.transaction(getbackground2, errorCBfunc, successCBfunc);
    }else{
        runadmob();

        window.setTimeout(function(){
            window.location.href='../index.html';
        }, 5000);
    }
}


function getbackground2(tx) {
    var sql = "select URLLINK from Mobilescreenimage order by UpdateDateUTC desc LIMIT 1";
    tx.executeSql(sql, [], getbackground_success2,getbackground2_error);
}

function getbackground_success2(tx, results) {

    var len = results.rows.length;
     //alert(len);
    if(len != 0) {
        var menu = results.rows.item(0);
        $('#splashscreen').empty();
        $('#splashscreen').append('<img id="screensplashimg"  onclick="URLredirect(\'' + menu.URLLINK + '\')" src="data:image/png;base64,' + Base64 + '">');

        runadmob();


        window.setTimeout(function(){
            window.location.href='../index.html';
        }, 5000);


    }
}


function getbackground2_error(err) {
    $('#splashscreen').empty();
    $('#splashscreen').append('<img id="screensplashimg"  src="data:image/png;base64,' + Base64 + '">');
    runadmob();
    window.setTimeout(function(){
        window.location.href='../index.html';
    }, 5000);

}

function getbackground_error(err) {
    //Alert("Error processing SQL: " + err.code);
  //  alert("error");
    runadmob();
    window.setTimeout(function(){
        window.location.href='../index.html';
    }, 5000);


}



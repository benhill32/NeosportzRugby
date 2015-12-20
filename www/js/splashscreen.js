var db;
var orientationstand = "";
var Base64 = "";
var splashpage="../index.html";
document.addEventListener("deviceready", onDeviceReadysplashscreen, false);

function onDeviceReadysplashscreen() {
    deviceIDfunc = device.uuid;
    db.transaction(getbackground, errorCBfunc, successCBfunc);

}

function getoneoff2(tx) {
    var sql = "select oneoffs,token,fliterON,isadmin,allowscore,allowcancel,Clubedit,Ref,Region,allownewfeed,startpage from MobileApp_LastUpdatesec";
    // alert(sql);
    tx.executeSql(sql, [], getoneoff2_success);
}

function getoneoff2_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);


        window.localStorage.setItem("startpage", menu.startpage);
        window.localStorage.setItem("allownewfeed", menu.allownewfeed);
        window.localStorage.setItem("Region", menu.Region);
        window.localStorage.setItem("apptoken", menu.token);
        window.localStorage.setItem("fliter", menu.fliterON);
        window.localStorage.setItem("isadmin", menu.isadmin);
        window.localStorage.setItem("allowscore", menu.allowscore);
        window.localStorage.setItem("allowcancel", menu.allowcancel);
        window.localStorage.setItem("Clubedit", menu.Clubedit);
        window.localStorage.setItem("Ref", menu.Ref);

     //   alert(menu.startpage);

        if(menu.startpage == 1){
            splashpage = "../index.html";
        }else if(menu.startpage == 'null'){
            splashpage = "../index.html";
        }else if(menu.startpage == 2){
            splashpage = "schedules.html";
        }else if(menu.startpage == 3){
            splashpage = "standings.html";
        }else if(menu.startpage == 4){
            splashpage = "clubs.html";
        }else if(menu.startpage == 5){
            splashpage = "news.html";
        }

    //    alert(splashpage);

        runadmob();

        window.setTimeout(function(){
            window.location.href= splashpage;
        }, 3000);

    }
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
      //  runadmob();
        db.transaction(getoneoff2, errorCBfunc, successCBfunc);

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




        db.transaction(getoneoff2, errorCBfunc, successCBfunc);
    }
}


function getbackground2_error(err) {
    $('#splashscreen').empty();
    $('#splashscreen').append('<img id="screensplashimg"  src="data:image/png;base64,' + Base64 + '">');
   runadmob();
    window.setTimeout(function(){
        window.location.href="../index.html";
    }, 3000);

}

function getbackground_error(err) {
    //Alert("Error processing SQL: " + err.code);
  //  alert("error");
    runadmob();
    window.setTimeout(function(){
        window.location.href="../index.html";
    }, 3000);


}



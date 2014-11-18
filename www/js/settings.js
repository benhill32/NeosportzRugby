var db;
var networkconnectionset = 0;
var wifiallset = 0;



document.addEventListener("deviceready", onDeviceReadyset, false);


function onDeviceReadyset() {
 //   db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
 //   console.log("LOCALDB - Database ready");
    onOfflinesetting();
        db.transaction(checkfavteam, errorCBfunc, successCBfunc);
        db.transaction(getsyncdate, errorCBfunc, successCBfunc);

}

function getnetworkdetailsset(){

    document.addEventListener("online", onOfflinesetting, false);
}

function onOfflinesetting(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnectionset = states[networkState];
//alert(states[networkState]);

}

//https://www.google.co.nz/maps/dir/


function getsyncdate(tx) {
    var sql = "select Datesecs, syncwifi from MobileApp_LastUpdatesec";
   //  alert(sql);
    tx.executeSql(sql, [], getsyncdate_success2);
}

function checkfavteam(tx) {
    var sql = "select Count(Fav) as Count from MobileApp_clubs where Fav =1";
   //   alert(sql);
    tx.executeSql(sql, [], checkfavteam_success);
}

function checkfavteam_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);
 //alert(menu.Count);
    if(menu.Count ==0){

        $('#divclearfav').unbind('click');

        $("#divclearfav").css('color', 'grey');
    }else{

        $("#divclearfav").css('color', '#333');
    }

    var stringapp = device.uuid;

   $("#deviceid").empty();
   $("#deviceid").append(stringapp);

}
function syncnewdata(){
    $('#busy').show();


    $("#settingdeleteall").attr('disabled','disabled');
    $("#settingsync").attr('disabled','disabled');

    db.transaction(onclicksync, errorCBfunc, displayupdatenow);

}

function displayupdatenow(){
    $('#busy').show();
    db.transaction(getsyncdate, errorCBfunc, successCBfunc);

}

function getsyncdate_success2(tx, results) {
    onOfflinesetting();

    var len = results.rows.length;

    var menu = results.rows.item(0);
 //   alert(menu.Datesecs);
    var dateme = new Date((menu.Datesecs)*1000);
    var wifi = menu.syncwifi;
    wifiallset = wifi;
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    $('#lastsyncdate').empty();
    if(dateme.getFullYear() != 1970) {
        $('#lastsyncdate').append("Last sync time : " + dateme.getDate() + " " + month[dateme.getMonth()] + " " + dateme.getFullYear() + " " + (dateme.getHours()) + ":" + ("0" + dateme.getMinutes()).slice(-2) + ":" + ("0" + dateme.getSeconds()).slice(-2))
    }
        console.log("Last sync time : " + dateme.getDate() + " " + month[dateme.getMonth()] + " " + dateme.getFullYear() + " " + (dateme.getHours()) + ":" + ("0" + dateme.getMinutes()).slice(-2) + ":" + ("0" + dateme.getSeconds()).slice(-2) );


    if((wifi ==1 &&  networkconnectionset==2) || ((wifi ==0))){
        $("#settingdeleteall").css('color', '#333');
        $("#settingsync").css('color', '#333');
    }else{
        $("#settingdeleteall").css('color', 'grey');
        $("#settingsync").css('color', 'grey');
    }

    if(wifi==1) {
        $('#btn2').removeClass("btn btn-xs btn-primary active");
        $('#btn1').removeClass("btn btn-xs btn-default")
        $('#btn2').addClass("btn btn-xs btn-default");
        $('#btn1').addClass("btn btn-xs btn-primary active");

    }else if(wifi==0) {
        $('#btn1').removeClass("btn btn-xs btn-primary active");
        $('#btn2').removeClass("btn btn-xs btn-default")
        $('#btn1').addClass("btn btn-xs btn-default");
        $('#btn2').addClass("btn btn-xs btn-primary active");

    }


    $('#busy').hide();


}

function clearfavteam(){

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_clubs set Fav = 0');
        console.log("Cleared Fav Team");
    });
    db.transaction(checkfavteam, errorCBfunc, successCBfunc);
}

function cleardata(){

    onOfflinesetting();


   if((wifiallset ==1 &&  networkconnectionset==2) || ((wifiallset ==0))) {
        $('#indexloadingdata').modal('show');
        db.transaction(droptables, errorCBfunc, createtables);
   }


}

function createtables(){
  // window.plugins.toast.showShortCenter('Creating Tables!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
  //  window.plugins.toast.showLongCenter('Please Wait While Data is Downloaded', function (a) {console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b)});

    db.transaction(createDB, errorCBfunc, loadnewtable);
}





var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};


function chkmobiledata(id){
    onOfflinesetting();

   if(id=="btn1")
   {

       db.transaction(function(tx) {
           tx.executeSql('Update MobileApp_LastUpdatesec set syncwifi = 1');
           console.log("syncwifi on");
       });

       $('#btn2').removeClass("btn btn-xs btn-primary active");
       $('#btn2').addClass("btn btn-xs btn-default");
       $('#btn1').removeClass("btn btn-xs btn-default");
       $('#btn1').addClass("btn btn-xs btn-primary active");
       wifiallset = 1;
   }
   else if(id== "btn2")
   {
       db.transaction(function(tx) {
           tx.executeSql('Update MobileApp_LastUpdatesec set syncwifi = 0');
           console.log("syncwifi off");
       });
       wifiallset =0;
       $('#btn1').removeClass("btn btn-xs btn-primary active");
       $('#btn1').addClass("btn btn-xs btn-default");
       $('#btn2').removeClass("btn btn-xs btn-default");
       $('#btn2').addClass("btn btn-xs btn-primary active");
   }


    if((id=="btn1" &&  networkconnectionset==2) || ((id== "btn2"))){

        $("#settingdeleteall").css('color', '#333');
        $("#settingsync").css('color', '#333');
    }else{

        $("#settingdeleteall").css('color', 'grey');
        $("#settingsync").css('color', 'grey');
    }


}


function manualupdateben(){



    var xmlHttpp = null;
    xmlHttpp = new XMLHttpRequest();

   // $('#busy').show();
    xmlHttpp.open("GET", 'http://centralfootball.neosportz.com/databen.aspx?deviceID=a07883508d108e26&token=9D190637-2FEB-4A26-BA72-9A158A220A2A&sec=0',false);
    console.log("http://centralfootball.neosportz.com/databen.aspx?deviceID=a07883508d108e26&token=9D190637-2FEB-4A26-BA72-9A158A220A2A&sec=0");


    xmlHttpp.send();

    var jsonn = xmlHttpp.responseText;

    var objj = JSON.parse(jsonn);

    syncmaintables(objj);

}
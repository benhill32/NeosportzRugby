var db;
var dbCreated = false;

var d = new Date();
//alert(d);
var day = d.getDate();
var month = d.getMonth();
var year = d.getFullYear();
var hours= d.getHours();
var stringresultID = 0;
var datenow = (day + '' + month+ '' + year);
var milliesecs = d.getTime();
var datenowsec = Math.round((milliesecs/1000));
var golbaltoken= "";
var networkconnection = "";
var deviceIDfunc;
var devicePlatformfunc;
var chkrefreshdata = 0;
var archiveyear=0;
document.addEventListener("deviceready", onDeviceReadyloaddata, false);
var tokenldata ="";
var start = 0;
// Cordova is ready
//

var appversionlocalf = '1.4.7';


function onDeviceReadyloaddata() {
    pushnotifiy();
    db.transaction(gettokenloaddata, errorCBfunc, successCBfunc);
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    deviceIDfunc = device.uuid;
    devicePlatformfunc = device.platform;
     getnetworkdetails();
    $('#busy').hide();

    document.addEventListener("offline", onOffline, false);
    db.transaction(getresultids, errorCBfunc, successCBfunc);



// select the right Ad Id according to platform

}
//db.transaction(getresultids, errorCBfunc, successCBfunc);

function onOffline()
{
  //  window.plugins.toast.showShortCenter('You are offline', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    $('#settingdeleteall').prop('disabled', false);
    $('#settingsync').prop('disabled', false);

}


function gettokenloaddata(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettokenloaddata_success);
}

function gettokenloaddata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    tokenldata = menu.token;
    //alert(apptoken);
}


function getnetworkdetails(){

    document.addEventListener("online", checkonline, false);
}

function checkonline(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnection = states[networkState];
//alert(states[networkState]);

}

function refreshdata(){
    db.transaction(gettokenloaddata, errorCBfunc, successCBfunc);
    checkonline();

  //  $('#indexloadingdata').modal('show');
    checkdatabaseloaddata();

}





function checkdatabaseloaddata(){

    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    var json = "0";
    if(networkconnection!=0) {
        xmlHttp.open("GET", 'http://rugby.neosportz.com/checkdatabase.aspx?deviceID=' + deviceIDfunc, false);
        xmlHttp.send();
    //     alert('http://admin.adme.kiwi/checkdatabase.aspx?deviceID=' + deviceIDfunc);
        json = xmlHttp.responseText;
    }

    //alert(json);
    if(json == "0"){

        db.transaction(populateDB, errorCBfunc, successCBfunc);
    }else  if(json == "1"){
        // alert(json);
        if(document.getElementById("indexdiv")!=null) {
            $('#indexloadingdata').modal('hide');
            $('#mainfore').removeClass('mainforeground');
            $('#mainfore').addClass('mainforeground2');
            if (document.getElementById("indexdiv") != null) {
                showdivindex();
            }
            if (devicePlatformfunc == "Android") {
                $('#modelnewdatabase').modal('show');
            }
            else if (devicePlatformfunc == "iOS") {

                $('#modelnewdatabaseapple').modal('show');
            }
        }else{

            db.transaction(populateDB, errorCBfunc, successCBfunc);
        }

    }else{
        db.transaction(populateDB, errorCBfunc, successCBfunc);
    }
}



function loadnewtable(){
 //   $('#busy').show();
  //  blankLastUpdatesec();
  //  pushnotifiy();

    db.transaction(populateDB, errorCBfunc, successCBfunc);
}

function populateDB(tx){
    // $('#busy').show();
    var sql = "select Count(Datesecs) as Count,syncwifi,Datesecs from MobileApp_LastUpdatesec";
   // alert(sql);
    tx.executeSql(sql, [], populateDB1,errorCreatetable);

}

function errorCreatetable(err) {

    createtables();

}

function createtables(){
    $.when(db.transaction(createDB, errorCBfunc, successCBfunc)).done(function() {

        db.transaction(populateDB, errorCBfunc, successCBfunc);
    });



}

function populateDB1(tx,results) {
    checkonline();
    var row = results.rows.item(0);
 //   alert(row);
  //  alert(row.Count);
    if(row.Count ==0){
      if(document.getElementById("indexdiv")!=null) {
            $('#mainfore').removeClass('mainforeground');
            $('#mainfore').addClass('mainforeground2');
            // alert($('#mainfore').attr('class'));
            $('#indexloadingdata').modal('show');
        }

        $.when(blankLastUpdatesec()).done(function() {
          // $.when( pushnotifiy()).done(function() {
               // db.transaction(populateDB, errorCBfunc, successCBfunc);
               db.transaction(gettokenregion, errorCBfunc, successCBfunc);
            start =1;
         //   });
        });

    }else{
        start=0;

        var sql = "select Datesecs,datemenus,token,Region from MobileApp_LastUpdatesec";

        if((row.syncwifi ==1 && networkconnection==2) || ((row.syncwifi ==0 &&  networkconnection!=0))){

             tx.executeSql(sql, [], getchecksync,errorCBfunc);
        }else{
            $('#indexloadingdata').modal('hide')
            $('#mainfore').removeClass('mainforeground2');
            $('#mainfore').addClass('mainforeground');
          //  window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

        }
    }
}

function getresultids(tx) {
    sql = "select ID from MobileApp_Results";
    tx.executeSql(sql, [], getresultids_success);
}

function getresultids_success(tx, results) {

    var len = results.rows.length;
    stringresultID =0;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        stringresultID = stringresultID + menu.ID + ",";
    }
}


function passdatatoserver(){

    var deviceid = "dsdsadsadasd";
    var http = new XMLHttpRequest();
    var url = "http://rugby.neosportz.com/loaddatafromapp.aspx";
    var params = "?token=" + golbaltoken + "&deviceid=" + deviceid;
    http.open("POST", url + params, true);

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
        }
    }
    http.send();

}

function getchecksync(tx, results) {

        var row = results.rows.item(0);

        var datemenus= row.datemenus;

        var datenowsecsync = row.Datesecs;

        var region = row.Region;
        var datenow = new Date();
        var timenow = datenow.getTime();
        var yearnow = datenow.getFullYear()

        var dif = (timenow/1000)-(datenowsecsync);

        if (document.getElementById("newsmain") != null) {
            dif = 100000000;
        }

        if (dif >= "600") {
            if (document.getElementById("indexdiv") != null) {

                if ($("#mainfore").hasClass("mainforeground2")) {

                } else {
                    $('#mainfore').removeClass('mainforeground');
                    $('#mainfore').addClass('mainforeground2');
                    $('#indexloadingdata').modal('show');
                }

            } else {
                $('#indexloadingdata').modal('show');
            }
            var xmlHttp = null;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", 'http://rugby.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow, false);
           // alert('http://rugby.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow);
            xmlHttp.send();

            var json = xmlHttp.responseText;

            if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {

                errorclosemodel();
            } else {

            var obj = JSON.parse(json);



            syncmaintables(obj,yearnow);
            }
        }else{




        }

}

function errorclosemodel(){
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');
    $('#indexloadingdata').modal('hide');
    if (document.getElementById("indexdiv") != null) {
        showdivindex();
    }
    window.plugins.toast.showLongCenter('Something went wrong! Please sync data again \n If problem persists contact helpdesk@neocom.co.nz', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    randomfunctions();
}

function closemodel(){
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');
    $('#indexloadingdata').modal('hide');
    if (document.getElementById("indexdiv") != null) {
        showdivindex();
    }
    window.plugins.toast.showLongCenter('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    randomfunctions();
}
function closemodelarchive(){

    $('#indexloadingdata').modal('hide');
    if (document.getElementById("indexdiv") != null) {
        showdivindex();
    }
    window.plugins.toast.showLongCenter('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});


  //  randomfunctions();
    loadarchiveyear();
}

function closemodelRegion(){
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');
    $('#indexloadingdata').modal('hide');
    if (document.getElementById("indexdiv") != null) {
        showdivindex();
    }
  //  window.plugins.toast.showLongCenter('Your App is Updated!', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});
    showregion();

}
function reloadindividual(){


    $('#indexloadingdata').modal('hide');

    if (document.getElementById("indexdiv") != null) {
        showdivindex();
    }
    if (document.getElementById("newsmain") != null) {
        $.mobile.loading().hide();
    }
    location.reload();

}



function randomfunctions(){
    if (document.getElementById("settingsync") != null) {
        db.transaction(getsyncdate, errorCBfunc, successCBfunc);
    }

    if (document.getElementById("divschedules") != null) {
       // var idsch = getUrlVars()["id"];
      //
      //  onDeviceReadysch();
        db.transaction(getflitersch, errorCBfunc, successCBfunc);
      //  db.transaction(gettokensc, errorCBfunc, successCBfunc);
      //  db.transaction(getdatanewssch, errorCBfunc, successCBfunc);
    }
    if (document.getElementById("divresults") != null) {
        db.transaction(getfliterresult, errorCBfunc, successCBfunc);
    }
    if (document.getElementById("indexdiv") != null) {
        loadindexmessage();
    }

}


function countProperties(obj) {

    var prop;
    var prop2;
    var propCount = 0;

    $.each(obj.App_Results, function (idx, obj) {
        propCount++;
    });


    $.each(obj.clubs, function (idx, obj) {
        propCount++;
    });

    $.each(obj.App_Schedule, function (idx, obj) {
        propCount++;
    });


    $.each(obj.clubsimages, function (idx, obj) {
        propCount++;
    });

    $.each(obj.vwApp_Teams, function (idx, obj) {
        propCount++;
    });

    $.each(obj.vwApp_News_v_2, function (idx, obj) {
        propCount++;
    });

    $.each(obj.App_Players, function (idx, obj) {
        propCount++;
    });

    $.each(obj.App_Players_Images, function (idx, obj) {
        propCount++;
    });

    $.each(obj.ScoringTable, function (idx, obj) {
        propCount++;
    });

    db.transaction(function (tx) {
        propCount++;
    });

    $.each(obj.Standings, function (idx, obj) {
        propCount++;
    });

    $.each(obj.sponsorsclub, function (idx, obj) {
        propCount++;
    });

    $.each(obj.screenimage, function (idx, obj) {
        propCount++;
    });

    $.each(obj.scoringbreakdown, function (idx, obj) {
        propCount++;
    });

    $.each(obj.Isadmin, function (idx, obj) {
        propCount++;
    });
    return propCount;
}


function onclickloadregion(){

    $('#basicModalregions2').modal('show');
    //db.transaction(onclickloadregiondata, errorCBfunc, successCBfunc)
}



function chooseregionloaddata(ID){

    $('#indexloadingdata').modal('show')





    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set Datesecs = ' + 0 + ',  Region = "' + ID + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });



    refreshdata();

}

function onclicksyncloaddata(){
    db.transaction(onclicksyncloaddata2, errorCBfunc, successCBfunc);
}

function onclicksyncloaddata2(tx){
    checkonline();
    var sql = "select Datesecs,datemenus,syncwifi,token,isadmin,Region from MobileApp_LastUpdatesec";
    tx.executeSql(sql, [], onclickresync,errorCBfunc);

}



function onclickresync(tx, results) {

    var row = results.rows.item(0);

    if((row.syncwifi ==1 && networkconnection==2) || ((row.syncwifi ==0 &&  networkconnection!=0))) {
        $('#indexloadingdata').modal('show');

        var datemenus = row.datemenus;
        var datenowsecsync = row.Datesecs;
        var region = row.Region;
        var datenow = new Date();
        var timenow = datenow.getTime();
       // var yearnow = currentTime.getFullYear()
        var yearnow = datenow.getFullYear()
        var dif = timenow - (datenowsecsync);

        //   window.plugins.toast.showLongCenter('Please Wait While Data is Downloaded', function (a) {console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b)});
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();

       xmlHttp.open("GET", 'http://rugby.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow, false);
     //   alert('http://rugby.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow);

        xmlHttp.send();

        var json = xmlHttp.responseText;

        if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {

            errorclosemodel();
        } else {
            var obj = JSON.parse(json);
            syncmaintables(obj,yearnow);
        }

    }else{
        window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

    }
}



function loadarchiveyeardata(ID){
    archiveyear =ID;
    db.transaction(loadarchiveyeardata2, errorCBfunc, successCBfunc);
}

function loadarchiveyeardata2(tx){
    checkonline();
    var sql = "select Datesecs,datemenus,syncwifi,token,isadmin,Region from MobileApp_LastUpdatesec";
    tx.executeSql(sql, [], loadarchiveyeardata2_sync,errorCBfunc);

}



function loadarchiveyeardata2_sync(tx, results) {

    var row = results.rows.item(0);

    if((row.syncwifi ==1 && networkconnection==2) || ((row.syncwifi ==0 &&  networkconnection!=0))) {
        $('#indexloadingdata').modal('show');

        var datemenus = row.datemenus;
        var datenowsecsync = row.Datesecs;
        var region = row.Region;
        var datenow = new Date();
        var timenow = datenow.getTime();
        var yearnow = archiveyear;
        var dif = timenow - (datenowsecsync);

        //   window.plugins.toast.showLongCenter('Please Wait While Data is Downloaded', function (a) {console.log('toast success: ' + a) }, function (b) { alert('toast error: ' + b)});
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", 'http://rugby.neosportz.com/mobiledata.aspx?deviceID=' + deviceIDfunc + '&token=' + row.token + '&sec=' + datenowsecsync + '&resultids=' + stringresultID + '&start=0&region=' + region + '&year=' + yearnow, false);


        xmlHttp.send();

        var json = xmlHttp.responseText;

        if (json == "{'Error' : [{'Message': 'Something went wrong'}]") {

            errorclosemodel();
        } else {
            var obj = JSON.parse(json);
            $.when(syncmaintables(obj,yearnow)).done(function () {

            });
        }

    }else{

        window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

    }
}




function successHandler (result) {
 //   alert('result = ' + result);
}

function errorHandler (error) {
 //   alert('error = ' + error);
}

function tokenHandler (result) {
    var xmlHttptt = null;
    xmlHttptt = new XMLHttpRequest();

   // alert('tokenB: '+ result);
    //$('#busy').show();
    var strur = 'http://rugby.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&databasever=0&appver=' + appversionlocalf + '&deviceVersion=' + deviceVersionfunc + '&regid=' + result;
  //  navigator.notification.alert(strur);
    xmlHttptt.open("GET",strur ,false);
    xmlHttptt.send();
   // $('#busy').hide();
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}


function pushnotifiy() {
    pushNotification = window.plugins.pushNotification;


    if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID":"859509533098",
                "ecb":"onNotification"
            });
    } else if ( device.platform == 'blackberry10'){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                invokeTargetId : "replace_with_invoke_target_id",
                appId: "replace_with_app_id",
                ppgUrl:"replace_with_ppg_url", //remove for BES pushes
                ecb: "pushNotificationHandler",
                simChangeCallback: replace_with_simChange_callback,
                pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                launchApplicationOnPush: true
            });
    } else {
        pushNotification.register(
        tokenHandler,
        errorHandler,
        {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
        });
}
}

function updatedatapush(ID,mess){
    //alert(ID);
if(start ==0) {
    if (ID == 'New News Feed') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });
    } else if (ID == 'Game Cancellation') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    } else if (ID == 'Half Time Score') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    } else if (ID == 'Full Time Score') {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom(ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    } else {
        onclicksyncloaddata();
        window.plugins.toast.showLongBottom('New News Feed ' + '\n' + ID + '\n' + mess, function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        });

    }
}
}


function updatedatapushappclosed(ID,mess){
    //alert(ID);

    if(ID == 'New News Feed'){
        onclicksyncloaddata();

        if (document.getElementById("indexdiv") != null) {
            weblink('../www/pages/news.html');
        }else{
            weblink('../pages/news.html');
        }

    }else if(ID == 'Game Cancellation'){
        onclicksyncloaddata();



    }else if(ID == 'Half Time Score'){
        onclicksyncloaddata();



    }else if(ID == 'Full Time Score'){

        onclicksyncloaddata();



    }else{
       onclicksyncloaddata();
        if (document.getElementById("indexdiv") != null) {
            weblink('../www/pages/news.html');
        }else{
            weblink('../pages/news.html');
        }

    }

}

function onNotification(e) {
 //   $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
    var xmlHttpt = null;
    xmlHttpt = new XMLHttpRequest();
 //  alert(e.event);
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
              //  $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
               // alert("regID = " + e.regid);
              //  $('#busy').show();
                             var strur = 'http://rugby.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&databasever=0&deviceVersion=' + deviceVersionfunc + '&appver=' + appversionlocalf + '&regid=' + e.regid;
                xmlHttpt.open("GET",strur ,false);
                 // alert(strur);
                xmlHttpt.send();
                //   $('#busy').hide();
             //   alert(json);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.



            if ( e.foreground )
            {
                updatedatapush(e.payload.title, e.payload.message);




             //   $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            }
            else
            {
            // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    updatedatapushappclosed(e.payload.title, e.payload.message);
             //  $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {

                    updatedatapushappclosed(e.payload.title, e.payload.message);
              //      $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }


            //    $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            //    $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            //  $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
          //  $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
         //   $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function onNotificationAPN(e) {

    if (e.alert) {
       // $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
// showing an alert also requires the org.apache.cordova.dialogs plugin
      // navigator.notification.alert(e.alert);
        onclicksyncloaddata();

    }
    if (e.sound) {
// playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
       snd.play();
    }
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}



function benclick(){

   // $('#mainbackground').css('background-image', 'url(data:image/png;base64,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)');

    $('#mainfore').removeClass('mainforeground');
    $('#mainfore').addClass('mainforeground2');
    $('#indexloadingdata').modal('show');


}
function hidedivindex(){

  //  $('#mainbackground').hide();
}
function showdivindex(){

   // $('#mainbackground').show();
}




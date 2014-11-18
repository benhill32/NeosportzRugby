var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["id"];
var clubidtop =0;
var listfollow = 0;
var fliter = 0;
var lat = 0;
var long = 0;
var isadmin = 0;
var devicePlatformsch =0;

var remindtext = 0;
var reminddate =0;
var networkconnectionsch = 0;
document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {
    checkonlinesch();
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
  //  console.log("LOCALDB - Database ready");
   //  navigator.geolocation.getCurrentPosition(getgeolocation, onError);
    db.transaction(getfliter, errorCBfunc, successCBfunc);
    $(".tooltip").draggable("enable");
    devicePlatformsch = device.platform;
}
//function updateadmin() {
//    db.transaction(function (tx) {
 //       tx.executeSql('Update MobileApp_LastUpdatesec set isadmin = 1');
//        console.log("Update INTO MobileApp_LastUpdatesec");
 //   });

//}
//db.transaction(getfliter, errorCBfunc, successCBfunc);

//db.transaction(function(tx) {
//   tx.executeSql('Update MobileApp_LastUpdatesec set isadmin = 1');
//    console.log("Update MobileApp_LastUpdatesec");
//});


function checkonlinesch(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnectionsch = states[networkState];
//alert(states[networkState]);

}

function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

function allowfilter(id){

    if(id==1)
    {

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set fliterON =' + id);
            console.log("Update MobileApp_LastUpdatesec");
        });

        $('#btn2').removeClass("btn btn-xs btn-primary active");
        $('#btn2').addClass("btn btn-xs btn-default");
        $('#btn1').removeClass("btn btn-xs btn-default");
        $('#btn1').addClass("btn btn-xs btn-primary active");

    }
    else if(id== 0)
    {
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set fliterON =' + 0);
            console.log("Update MobileApp_LastUpdatesec");
        });

        $('#btn1').removeClass("btn btn-xs btn-primary active");
        $('#btn1').addClass("btn btn-xs btn-default");
        $('#btn2').removeClass("btn btn-xs btn-default");
        $('#btn2').addClass("btn btn-xs btn-primary active");
    }
    db.transaction(getfliter, errorCBfunc, successCBfunc);

}




function getfliter(tx) {

  //  updateadmin();


    var sql = "select fliterON,isadmin from MobileApp_LastUpdatesec";
    //alert(sql);
    tx.executeSql(sql, [], getfliter_success);



}


function getfliter_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);
        fliter = menu.fliterON;
        isadmin = menu.isadmin;
    }


    db.transaction(getdatanews, errorCBfunc, successCBfunc);
}




function getdatanews(tx) {
    var sql = "select ID from MobileApp_clubs where Fav = 1";
   // alert(sql);
    tx.executeSql(sql, [], getClubID_success);
}


function getClubID_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    clubidtop = 0;

    if(len != 0) {
        var menu = results.rows.item(0);
        clubidtop = menu.ID;

    }

    db.transaction(getdata2, errorCBfunc, successCBfunc);
}



function getdata2(tx) {
    var sql = "select ID from MobileApp_clubs where Follow = 1";
    //alert(sql);
    tx.executeSql(sql, [], getdata2_success);
}

function getdata2_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    listfollow = 0;

    if(len != 0) {
        for (var i=0; i<len; i++) {
            var menu = results.rows.item(i);
            listfollow = listfollow + menu.ID + ",";
        }
    }
    listfollow =  listfollow + clubidtop + ","

    listfollow = listfollow.substr(0, listfollow.length - 1);

   // alert(listfollow);

    db.transaction(getdata, errorCBfunc, successCBfunc);

}


function getdata(tx) {
    var sql = "";
    var d = new Date();
    var secondsnow  = (d.getTime())/1000;

    var month = d.getMonth();
    var year = d.getFullYear();
    var day = d.getDate();

    var midnight = new Date(Date.UTC(year,month,day,"00","00","00","01"));
    var midnightsec = ((midnight.getTime())/1000);




    if(fliter == 0){

        $('#btn1').removeClass("btn btn-xs btn-primary active");
        $('#btn1').addClass("btn btn-xs btn-default");
        $('#btn2').removeClass("btn btn-xs btn-default");
        $('#btn2').addClass("btn btn-xs btn-primary active");
        sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,Cancel from MobileApp_Schedule where  DivisionID = " + id + " and DatetimeStartSeconds >= " + midnightsec + " and DeletedateUTC = 'null' order by DatetimeStart";

    }else{
        $('#btn2').removeClass("btn btn-xs btn-primary active");
        $('#btn2').addClass("btn btn-xs btn-default");
        $('#btn1').removeClass("btn btn-xs btn-default");
        $('#btn1').addClass("btn btn-xs btn-primary active");

        sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,Cancel from MobileApp_Schedule where (HomeClubID IN (" + listfollow + ") or AwayClubID IN (" + listfollow + ")) and DeletedateUTC= 'null' and  DivisionID = " + id + "  and DatetimeStartSeconds >= " + midnightsec + " order by DatetimeStart";

    }

   // alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#divschedules').empty();

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var res = (menu.DatetimeStart).split("T");
        var split = res[0].split("-");
        var month = split[1];
        var year = split[0];
        var day = split[2];

        var h = res[1].substring(0,2)

     //   alert(menu.DatetimeStartSeconds);

        var ampm = h > 12 ? h-12 +'PM' : h +'AM';

        if(menu.Cancel== 0) {
            $('#divschedules').append('<Div class="mainmenuresult" align="left" >' +
                '<div id="schleft">' +
                '<div class="bold size13"  >' + menu.HomeName + ' vs ' + menu.AwayName  +


                '</div>' +

                '<div class="size11">' + ampm + '  ' + day + '/' +  month + '/' + year + '</div>' +
                '<div class="size11">' + menu.TournamentName + '</div>' +
                '<div class="size11">' + menu.Field + '</div>' +
                '</div>' +

                '<div  id="schright" onclick="loadinfo(' + menu.ID + ')" data-toggle="modal" data-target="#basicModal">' +
                '<img height="30px" class="imagesch"  align="right" >' +
                '</div>' +

                '</Div>');
        }else{
            $('#divschedules').append('<Div class="mainmenuresultcancel" align="left" >' +
                '<div class="bold size13"  >' + menu.HomeName + ' vs ' + menu.AwayName + '</div>' +
                '<div class="size11">' + ampm + '  ' + day + '/' + month + '/' + year + '</div>' +
                '<div class="size11">' + menu.TournamentName + ' ' + ' Cancelled ' + '</div>' +
                '<div class="size11">' + menu.Field + '</div>' +
                '</Div>');

        }
    }
}

function loadinfo(ID) {
    IDhist = ID;
//alert(ID);
    db.transaction(loadinfo_success1, errorCBfunc, successCBfunc);

}

function loadinfo_success1(tx) {

    var sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,Cancel from MobileApp_Schedule where ID =" + IDhist;

     // alert(sql);
    tx.executeSql(sql, [], loadinfo_success2);
}


function loadinfo_success2(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
    var res = (menu.DatetimeStart).split("T");
    var split = res[0].split("-");
    var month = split[1];
    var year = split[0];
    var day = split[2];

    var h = res[1].substring(0, 2)
    var d = new Date();

    var text =  menu.HomeName + ' vs ' + menu.AwayName +  "||" + menu.TournamentName + "||" + menu.Field;
    var text2 =menu.HomeName + ' vs ' + menu.AwayName;

    $('#score').hide();
    $('#cancell').hide();

    // alert(("0" + (d.getMonth()+1)).slice(-2));
    $('#Directions').hide();
    if (day == d.getDate() && month == ("0" + (d.getMonth()+1)).slice(-2) && year == d.getFullYear()){
        if(isadmin==1) {
            $('#score').show();
            $('#score').empty().append('<Div >Score Card</div>');
            $("#score").click(function () {
                window.open("scorecard.html?ID=" + IDhist);
            });

            $('#cancell').show();

            $('#divmainheadercancel').empty().append('Do you want to cancel this game </br> ' + text2)


        }
        $('#remind').hide();

    }else {

        $('#score').hide();
        $('#cancell').hide();
        $('#remind').show();
        //$("#remind").click(addreminder(menu.ID,menu.DatetimeStart));
        $("#remind").empty().append('<Div data-toggle="modal" data-target="#basicModalyesno" onclick="createvarforremind(\'' + menu.DatetimeStart + '\',\'' + text + '\')" >  Remind Me</div>');

    }


    if(menu.Latitude != "null" || menu.Longitude != "null" ) {
        $('#Directions').show();
        $("#Directions").click(function () {
            window.open("https://www.google.co.nz/maps/dir/Current+Location/" + menu.Latitude + ",+" + menu.Longitude, "_system")
        });
    }
}
function onConfirm(button) {
    checkonlinesch();
    if(networkconnectionsch != 0){
        if(button ==1){

            alert('You selected button ' + button);
        }else{

            alert('You selected button ' + button);
        }

    }else{
        alert("You don't have access to internet!");

    }



}





function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function addreminder(IDd){
    var res = (reminddate).split("T");
    var text = (remindtext).split("||");
    var split = res[0].split("-");
    var month = (split[1]-1);
    var year = split[0];
    var day = split[2];


    var split2 = res[1].split(":");

    var hours = split2[0]
    var mins = split2[1]

    var startDate = new Date(year,(month),day,hours,mins,0,0,0); // beware: month 0 = january, 11 = december
    // alert(startDate);
    var endDate = new Date(year,(month),day,hours,mins,0,0,0);
    var title = text[0];
    var location = text[2];
    var notes = text[1];
    var successremind = function(message) { alert("Event added to calendar!"); };
    var errorremind =function(message) { alert("Something went wrong event not added to calendar!"); };

    var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
    calOptions.firstReminderMinutes = IDd; // default is 60, pass in null for no reminder (alarm)
    calOptions.secondReminderMinutes = 5;

    if(devicePlatformsch == "iOS"){
        window.plugins.calendar.createCalendar("Neosportz",successremind,errorremind);
        // if you want to create a calendar with a specific color, pass in a JS object like this:
        calOptions.calendarName = "Neosportz";
    }

    window.plugins.calendar.createEventWithOptions(title,location,notes,startDate,endDate,calOptions,successremind,errorremind);


}


function createvarforremind(DatetimeStart,text){

    reminddate =DatetimeStart;
    remindtext = text;
}

function cancelgame(){



    cancelgamenow(IDhist);



}






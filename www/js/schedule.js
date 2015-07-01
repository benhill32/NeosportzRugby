var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["id"];
var clubidtop =0;
var listfollow = 0;
var fliter = 0;
var lat = 0;
var long = 0;
var GameID = 0;
var isadmin = 0;
var devicePlatformsch =0;
var allowscore = 0;
var allowcancel= 0;
var Clubedit= 0;
var Ref= 0;
var teamfollow = 0;
var refgameid= 0;
var remindtext = 0;
var reminddate =0;
var defaultgames = 0;
var networkconnectionsch = 0;
var homeoraway =0;
document.addEventListener("deviceready", onDeviceReadysch, false);
var tokensch = 0

function onDeviceReadysch() {
    checkonlinesch();
    devicePlatformsch = device.platform;
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
  //  console.log("LOCALDB - Database ready");
   //  navigator.geolocation.getCurrentPosition(getgeolocation, onError);
    db.transaction(gettokensc, errorCBfunc, successCBfunc);
    db.transaction(getdatanewssch, errorCBfunc, successCBfunc);
    db.transaction(getflitersch, errorCBfunc, successCBfunc);

    $(".tooltip").draggable("enable");

}

function gettokensc(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettokensc_success);
}

function gettokensc_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    tokensch = menu.token;

}



function getdatanewssch(tx) {
    var sql = "select ID from MobileApp_clubs where Fav = 1";
    //alert(sql);
    tx.executeSql(sql, [], getdatanewssch_success);
}

function getdatanewssch_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);
        teamfollow = menu.ID;
    }
}



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
    db.transaction(getflitersch, errorCBfunc, successCBfunc);

}




function getflitersch(tx) {

  //  updateadmin();

    var sql = "select fliterON,isadmin,allowscore,allowcancel,Clubedit,Ref from MobileApp_LastUpdatesec";
    //alert(sql);
    tx.executeSql(sql, [], getflitersch_success);

}


function getflitersch_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);
        fliter = menu.fliterON;
        isadmin = menu.isadmin;
        allowscore = menu.allowscore;
        allowcancel= menu.allowcancel;
        Clubedit= menu.Clubedit;
        Ref= menu.Ref;
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

 //   alert(listfollow);

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
        var divid = "game" + menu.ID;

        var timesplit = res[1].split(":")
        var h = timesplit[0];
    var m = timesplit[1];
     //   alert(menu.DatetimeStartSeconds);

        var ampm = h > 12 ? h-12 + ':' + m +'PM' : h + ':' + m +'AM';

        if(menu.Cancel== 0) {
            $('#divschedules').append('<div  class="mainmenuresult" id="' + divid + '" align="left" >' +
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

                '</div>');
        }else{
            $('#divschedules').append('<Div class="mainmenuresultcancel" align="left" >' +
                '<div class="bold size13"  >' + menu.HomeName + ' vs ' + menu.AwayName + '</div>' +
                '<div class="size11">' + ampm + ' ' +  day + '/' + month + '/' + year + '</div>' +
                '<div class="size11">' + menu.TournamentName + ' ' + ' Cancelled ' + '</div>' +
                '<div class="size11">' + menu.Field + '</div>' +
                '</Div>');

        }




    }

    $('#divcircle').show();
    $('#divcircle').click(function() {
        sendinfotoserver("schedules",id,"0")
    });



}
function loadreftosystem(Gameid1){
    db.transaction(gettokensc, errorCBfunc, successCBfunc);

    db.transaction(function (tx) {
        tx.executeSql('Update MobileApp_Schedule set RefName = "' + $('#txtrefname').val() + '" where ID = ' + Gameid1);
        console.log("Update INTO MobileApp_Results");
    });

    passscoretoserver("gameidref=" + Gameid1 + "&refname=" + $('#txtrefname').val() + "&deviceid=" + device.uuid + "&token=" + tokensch)
    window.setTimeout(function(){
        window.location = "../pages/schedules.html?id=" + id;
    }, 1000);



}

function loadref(ID){

    refgameid = ID;
    db.transaction(loadinfo_ref, errorCBfunc, successCBfunc);
}

function loadinfo_ref(tx) {

    var sql = "select RefName from MobileApp_Schedule where ID =" + refgameid;

     //alert(sql);
    tx.executeSql(sql, [], loadinfo_ref_success2);
}

function loadinfo_ref_success2(tx, results) {
    var len = results.rows.length;
    var menu = results.rows.item(0);
    if(menu.RefName != 'null') {
        $('#txtrefname').val(menu.RefName);
    }
}


function loadinfo(ID) {
    IDhist = ID;
//alert(ID);
    db.transaction(loadinfo_success1, errorCBfunc, successCBfunc);

}

function loadinfo_success1(tx) {

    var sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,Cancel,IsFinalScore from MobileApp_Schedule where ID =" + IDhist;

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
var socialIOS = menu.DatetimeStart +  "||" + menu.HomeName + ' vs ' + menu.AwayName +  "||" + menu.TournamentName + "||" + menu.Field;


    $('#score').hide();

    $('#cancell').hide();
    $('#referee').hide();
    // alert(("0" + (d.getMonth()+1)).slice(-2));
    $('#Directions').hide();
    $('#divdefault').hide();

    if (devicePlatformsch == "Android") {
        $("#socialshare").click(function () {
            loadsocial(menu.ID);
        });
    }else{
        $("#socialshare").click(function () {
            loadsocialIOS2(socialIOS);
        });

    }

    if (day == d.getDate() && month == ("0" + (d.getMonth()+1)).slice(-2) && year == d.getFullYear()){

        if(isadmin==1) {

            $('#score').show();
            $('#divdefault').show();
            $("#divdefault").click(function () {
                loaddefaultgames(menu.ID);
            });
            $('#score').empty().append('<Div >Score Card</div>');
            $("#score").click(function () {
                window.open("scorecard.html?ID=" + IDhist +"&divID=" + id);
            });
            $('#cancell').show();
            $('#divmainheadercancel').empty().append('Do you want to cancel this game </br> ' + text2)
            $('#referee').show();
            $("#referee").click(function () {
                loadref(menu.ID);
            });
            $("#modelfooterupdate").click(function () {
                loadreftosystem(menu.ID);
            });

        }else {
            if (allowcancel == 1 && (menu.HomeClubID == Clubedit || menu.AwayClubID == Clubedit)) {
                if (menu.IsFinalScore == 0) {
                    $('#cancell').show();
                    $('#divmainheadercancel').empty().append('Do you want to cancel this game </br> ' + text2)
                }
            }
            if (allowscore == 1 && (menu.HomeClubID == Clubedit || menu.AwayClubID == Clubedit)) {
                if (menu.IsFinalScore == 0) {
                    $('#score').show();
                    $('#score').empty().append('<Div >Score Card</div>');
                    $("#score").click(function () {
                        window.open("scorecard.html?ID=" + IDhist + "&divID=" + id);
                    });
                    $('#referee').show();
                    $("#referee").click(function () {
                        loadref(menu.ID);
                    });
                    $("#modelfooterupdate").click(function () {
                        loadreftosystem(menu.ID);
                    });
                    $('#divdefault').show();
                    $("#divdefault").click(function () {
                        loaddefaultgames(menu.ID);
                    });
                }
            }
            if (Ref == 1) {
                if (menu.IsFinalScore == 0) {
                    $('#score').show();
                    $('#score').empty().append('<Div >Score Card</div>');
                    $("#score").click(function () {
                        window.open("scorecard.html?ID=" + IDhist + "&divID=" + id);
                    });
                    $('#cancell').show();
                    $('#divmainheadercancel').empty().append('Do you want to cancel this game </br> ' + text2)
                    $('#referee').show();
                    $("#referee").click(function () {
                        loadref(menu.ID);
                    });
                    $("#modelfooterupdate").click(function () {
                        loadreftosystem(menu.ID);
                    });
                    $('#divdefault').show();
                    $("#divdefault").click(function () {
                        loaddefaultgames(menu.ID);
                    });
                }
            }
        }
        $('#remind').hide();




    }else {
        $('#divdefault').hide();
        $('#referee').hide();
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

function saveImageToPhone(url, success, error) {
    var canvas, context, imageDataUrl, imageData;
    var img = new Image();
    img.onload = function() {
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        try {
            imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
            imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');


            $('#target').attr("src", imageDataUrl);

            $('#basicModalimagecrop').modal('show');
          //  cordova.exec(
          //      success,
          //      error,
          //      'Canvas2ImagePlugin',
          //      'saveImageDataToLibrary',
          //      [imageData]
          //  );
        }
        catch(e) {
            alert(e.message);
        }
    };
    try {
        img.src = url;
    }
    catch(e) {
        alert(e.message);
    }
}


function loadsocialIOS2(ID) {
    window.setTimeout(function(){
        navigator.screenshot.save(function(error,res){
            if(error){
                console.error(error);
            }else{
                console.log('ok',res.filePath);

                var MEsuccess = function(msg){
                    console.info(msg);
                }   ;

                var MEerror = function(err){
                    console.error(err);
                };

                saveImageToPhone(res.filePath, MEsuccess, MEerror);
            }
        },'jpg',50);




    }, 500);

}



function loadsocialIOS(ID){

    var mess = ID.split("||");

    var res = (mess[0]).split("T");
    var split = res[0].split("-");
    var month = split[1];
    var year = split[0];
    var day = split[2];


    var split2 = res[1].split(":");

    var hours = split2[0]
    var mins = split2[1]

    var ampm = hours > 12 ? hours-12 + ':' + mins +'PM' : hours + ':' + mins +'AM';




    var message = mess[1] + "" + ampm + '  ' + day + '/' +  month + '/' + year + "" + mess[2] + "" + mess[3];
    //alert(message);
     //   window.plugins.socialsharing.share('dsadsadsadasdad dsa dasa', null, null, 'http://www.x-services.nl');
    window.plugins.socialsharing.share('Message, image and link', 'Message, image and link', 'https://www.google.nl/images/srpr/logo4w.png', null);
  //  window.plugins.socialsharing.shareViaFacebook("dsadsadsadasdad dsa dasa", null /* img */, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
}



function loadsocial(ID) {

   // window.plugins.socialsharing.share('Message and subject', 'The subject')
var name = "game" + ID;
    window.setTimeout(function(){
        navigator.screenshot.URI(function(error,res){
            if(error){
                alert(error);
            }else{
                $('#target').attr("src", res.URI);

                $('#basicModalimagecrop').modal('show');

            }
        },50);

    }, 500);
   // window.plugins.socialsharing.share('Message and link', null, null, 'http://www.x-services.nl')



    $(function(){ $('#target').Jcrop(); });
}



function loaddefaultgames(ID){

    defaultgames = ID;
    db.transaction(loaddefaultgames_data, errorCBfunc, successCBfunc);
}

function loaddefaultgames_data(tx) {

    var sql = "select HomeName,AwayName from MobileApp_Schedule where ID =" + defaultgames;

    //alert(sql);
    tx.executeSql(sql, [], loaddefaultgames_data_success2);
}

function loaddefaultgames_data_success2(tx, results) {
    var len = results.rows.length;
    var menu = results.rows.item(0);
    db.transaction(gettokensc, errorCBfunc, successCBfunc);
        $('#divhometeam').empty().html('Home Team : ' + menu.HomeName);
        $("#divhometeam").click(function () {
            checkdefaultgames(1,menu.HomeName);
        });

    $('#divawayteam').empty().html('Away Team : ' + menu.AwayName);
    $("#divawayteam").click(function () {
        checkdefaultgames(2,menu.AwayName);
    });

}

function checkdefaultgames(ID,TeamName){
if(ID == 1){
    $('#divmainheaderyesorno').empty().append('Are you sure Home Team : ' + TeamName + ' is defaulting?')
}else if(ID == 2){

    $('#divmainheaderyesorno').empty().append('Are you sure Away Team : ' + TeamName + ' is defaulting?')
}


    homeoraway = ID;



}

function sendtoserverdefault(){
    checkonlinesch();
    if(networkconnectionsch !=0) {
        passscoretoserver("gameiddefault=" + defaultgames + "&teamdefault=" + homeoraway + "&deviceid=" + device.uuid + "&token=" + tokensch)

        onclicksyncloaddata();
    }else{
        alert("You don't have access to internet!");

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






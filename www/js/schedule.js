var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["id"];
var clubidtop =0;


var lat = 0;
var long = 0;
var GameID = 0;

var devicePlatformsch =0;

var listID = 0;

var statid = 0;

var refgameid= 0;
var remindtext = 0;
var reminddate =0;
var defaultgames = 0;
var networkconnectionsch = 0;
var homeoraway =0;
document.addEventListener("deviceready", onDeviceReadysch, false);
var tokensch = 0
var date = "";
var date2 = "";
var datesend = "";
var clubID = "";
var IDcancel = 0;
var panelcolour= "";
var POTDID=0;
var POTDdataid=0;
function onDeviceReadysch() {
    checkonlinesch();
    devicePlatformsch = device.platform;
    window.localStorage.setItem("modelactive", 0);


     // alert(window.localStorage.getItem("fliter"));



    datecheck(new Date(),0);
}

function datecheck(d,a){

   if(a == 0){
       date = d;
       var z = date.getMonth() + 1;
       date2 = getfullday(date.getDay()) + "," + date.getDate() + "/" + z + "/" + date.getFullYear();
       datesend =date.getDate() + "/" + z + "/" + date.getFullYear();
       document.getElementById("btndate").innerHTML=date2;
   }else{
       date = new Date(d);
       var z = date.getMonth() + 1;
       date2 = getfullday(date.getDay()) + "," + date.getDate() + "/" + z + "/" + date.getFullYear();
       document.getElementById("btndate").innerHTML=date2;
       datesend =date.getDate() + "/" + z + "/" + date.getFullYear();
   }


    if(networkconnectionsch !=0) {
        db.transaction(getgameids, errorCBfunc, successCBfunc);
    }else{
        $('#indexloadingdata').modal('hide');
        $('#loadinggears').hide();
        db.transaction(getdatasch, errorCBfunc, successCBfunc);
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


function getgameids(tx){
    $('#divschedules').empty();
    $('#loadinggears').show();

    var sql = "";
    var d = new Date(date);
    var secondsnow  = (d.getTime())/1000;
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var day = d.getDate();

    sql = "select ID from App_Games where Month = " + month + " and Year = " + year + " and Day = " + day + " and DeletedateUTC= 'null'";
//alert(sql);
    tx.executeSql(sql, [], getgameids_success);

}

function getgameids_success(tx, results) {

    var len = results.rows.length;
     listID = 0;
    if(len != 0) {
        for (var i=0; i<len; i++) {
            var menu = results.rows.item(i);
            listID = listID + menu.ID + ",";
        }
    }

    //window.localStorage.setItem("listID", listID);


    sendinfotoserver("schedules2",0,"0",datesend,listID)






}





function getdatasch(tx) {



    var sql = "";
    var d = new Date(date);
    var secondsnow  = (d.getTime())/1000;

    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var day = d.getDate();



    if(window.localStorage.getItem("fliter") == 0){


        sql = "select * from App_Games where Month = " + month + " and Year = " + year + " and Day = " + day + " and DeletedateUTC= 'null'";
        //where strftime('%m', DatetimeStartSeconds) = " + month + " and strftime('%Y', DatetimeStartSeconds) = " + year + " and strftime('%d', DatetimeStartSeconds) = " + day + "  and DeletedateUTC = 'null' order by DatetimeStart";

    }else{


        sql = "select * from App_Games where (HomeClubID = " +  window.localStorage.getItem("teamfollow") + " or AwayClubID = " + window.localStorage.getItem("teamfollow") + ") and DeletedateUTC= 'null'   and Month = " + month + " and Year = " + year + " and Day = " + day + " order by DatetimeStart";

    }

   //  alert(sql);
    tx.executeSql(sql, [], getMenu_success);



}

function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    $('#divschedules').empty();


    if(len != 0) {
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
        var currentdate = new Date().setDate(date.getDate() + 1)

        currentdate = new Date(currentdate);
        var currentmonth = currentdate.getMonth();
        var currentday = currentdate.getDate();
        var currentyear = currentdate.getFullYear();


        var ampm = h > 12 ? h - 12 + ':' + m + 'PM' : h + ':' + m + 'AM';

        if (menu.halftime != 'null' && menu.fulltime != 'null') {
            action = "Fulltime";
        } else if (menu.halftime != 'null' && menu.fulltime == 'null') {
            action = "Halftime";
        } else if (menu.halftime == 'null' && menu.fulltime == 'null') {
            action = "-";
        }
        var socialIOS = menu.DatetimeStart + "||" + menu.HomeName + ' vs ' + menu.AwayName + "||" + menu.TournamentName + "||" + menu.Field;

        var readmore = menu.ID + "||" + menu.HomeName + "||" + menu.AwayName + "||" + menu.HomeScore + "||" + menu.AwayScore + "||" + menu.HomeTeamID + "||" + menu.AwayTeamID;

        var score = "";


//Logos for the clubs.
        var array = window.localStorage.getItem("clubarray").split(",");
        var homeimage= "no_image.png";
        var awayimage = "no_image.png";

        $.each(array,function(i){
           // alert(array[i]);

            var res = array[i].split("-$$-");

            if(res[0] == menu.HomeClubID){
                if(networkconnectionsch !=0) {
                    homeimage =  res[1];
                }else{
                    if(is_cached("http://rugby.neosportz.com/Icons/Club/" + res[1]) == true){
                        homeimage =  res[1];
                    }else{
                        homeimage= "no_image.png";
                    }

                }


            }else if (res[0] == menu.AwayClubID) {
                if(networkconnectionsch !=0) {
                    awayimage = res[1];
                }else{
                    if(is_cached("http://rugby.neosportz.com/Icons/Club/" + res[1]) == true){
                        awayimage = res[1];
                    }else{
                        awayimage= "no_image.png";
                    }

                }
            }

        });

        var paneltype = "";
        var cancel = "";
        if (menu.Cancelled == 0) {

            var myDate = new Date(year, month - 1, day);

            var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());




            if (myDate < today) {
                paneltype = "panel panel-info";
                panelcolour ="panel1";
                score = menu.HomeScore + ' - ' + menu.AwayScore + '  ' + action;
                $('lstscore').show();
            } else if (myDate > today) {
                paneltype = "panel panel-success";
                panelcolour ="panel2";
                $('lstscore').hide();
            }else{
                paneltype = "panel panel-primary";
                panelcolour ="panel3";
                $('lstscore').hide();
            }


        } else {
            paneltype = "panel panel-danger";
            cancel = "Cancelled";
        }


       // '<div class="col-xs-4 col-md-4"  onclick="resultssharemore(event,\'' + readmore + '\',' + menu.ID + ')" ><img height="30px" class="imagesch"  align="right" ></div>' +
        var directions  = "";
        if(menu.Field == "null"){

            directions = "Directions";
        }else{
            directions = menu.Field;
        }




        $('#divschedules').append('<div class="' + paneltype + '" >' +
        '<div class="panel-heading"  data-toggle="modal" data-target="#basicModalresults" onclick="resultshowmore(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\',' + menu.HomeScore + ',' + menu.AwayScore + ',' + menu.HomeTeamID + ',' + menu.AwayTeamID + ')">' +
         '<div class="row" >' +
         '<div class="col-xs-5">' +
            '<img src="http://rugby.neosportz.com/Icons/Club/' + homeimage + '" height="40px" ><br>' + menu.HomeName +
            '</div>' +
            '<div class="col-xs-2" style="padding-top:10px;">vs </div>' +
            '<div class="col-xs-5">' +
            '<img src="http://rugby.neosportz.com/Icons/Club/' + awayimage + '" height="40px" ><br>' + menu.AwayName +
            '</div>' +
            '</div>' +
            '</div>' +
            '<ul class="list-group">' +
            '<li class="list-group-item lstscore" id="lstscore" style="font-weight: bold;" onclick="resultshowmore(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\',' + menu.HomeScore + ',' + menu.AwayScore + ',' + menu.HomeTeamID + ',' + menu.AwayTeamID + ')">' +
            '<div class="row">' +
            '<div class="col-xs-5">' + menu.HomeScore + '</div>' +
            '<div class="col-xs-2" >' + action + ' </div>' +
            '<div class="col-xs-5">' + menu.AwayScore + '</div>' +
            '</div>' +
            '</li>' +
            '<li class="list-group-item time" >' + ampm + '</li>' +
            '<li class="list-group-item">' + menu.TournamentName + '  ' + cancel + '</li>' +
            '<li class="list-group-item" id="Directionss' + menu.ID + '" onclick=loadmap(' + menu.Latitude + ',' + menu.Longitude + ')>' +  directions + '</li>' +
            '<li class="list-group-item " id="socialshare' + menu.ID + '">Share</li>' +
            '<li class="list-group-item " id="POTD' + menu.ID + '"  onclick="POTDclick(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\')"    >Player of the Day</li>' +

            '<div class="panel-group" role="tablist" id="adminmenu' + menu.ID + '">' +
            '<div class="panel panel-default">' +
            '<div class="panel-heading" role="tab" id="collapseListGroupHeading' + menu.ID + '">' +
            '<h4 class="panel-title">' +
            '<a class="" role="button" data-toggle="collapse" href="#collapseListGroup' + menu.ID + '" aria-expanded="true" aria-controls="collapseListGroup' + menu.ID + '"> Admin Area </a>' +
            '</h4>' +
            '</div>' +
            '<div style="" aria-expanded="false" id="collapseListGroup' + menu.ID + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="collapseListGroupHeading' + menu.ID + '">' +
            '<ul class="list-group">' +
            '<li class="list-group-item " data-toggle="modal" data-target="#basicModalref" id="referee' + menu.ID + '" onclick="checkref(' + menu.ID + ',\'' + menu.RefName + '\')" > Add Referee</li> ' +
            '<li class="list-group-item " id="score' + menu.ID + '" onclick=loadscorecard('+ menu.ID + ') > Score Card</li>' +
            '<li class="list-group-item " data-toggle="modal" data-target="#basicModaldefault" id="divdefault' + menu.ID + '" onclick="checkdefault(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\')" >Team Defaulted</li> ' +
            '<li class="list-group-item " data-toggle="modal" data-target="#basicModalcancel" id="cancell' + menu.ID + '" onclick="cgame(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\')" >Cancel Game!</li>' +
            '<li class="list-group-item " id="POTDadmin' + menu.ID + '" onclick="GetPOTDAdmin(' + menu.ID + ')" > POTD Admin</li>' +

            '</ul>' +

            '</div>' +
            '</div>' +
            '</div>' +

            '</ul>' +
            '</div>');


        $('#POTD' + menu.ID).hide();


        $('#POTDadmin' + menu.ID).hide();

        if (devicePlatformsch == "Android") {
            $("#socialshare" + menu.ID).click(function () {
                loadsocial(menu.ID);
            });
        }else{
            $("#socialshare" + menu.ID).click(function () {
                loadsocialIOS2(socialIOS);
            });

        }


        $('#score' + menu.ID).hide();
        $('#cancell' + menu.ID).hide();
        $('#referee' + menu.ID).hide();
        $('#divdefault' + menu.ID).hide();
        $('#adminmenu' + menu.ID).hide();

        $('#POTD' + menu.ID).addClass(panelcolour);

        if (myDate < today) {

            $('.lstscore').show();

            $('.time').hide();
            $('#Directionss' + menu.ID).hide();

            if(window.localStorage.getItem("isadmin")==1) {
                $('#adminmenu' + menu.ID).show();
                $('#POTDadmin' + menu.ID).show();
                if (menu.IsFinalScore == 0) {
                    $('#score' + menu.ID).show();
                    $('#cancell' + menu.ID).show();
                    $('#referee' + menu.ID).show();
                    $('#divdefault' + menu.ID).show();
                }


            }else{
                if (window.localStorage.getItem("allowscore") == 1 && (menu.HomeClubID == window.localStorage.getItem("Clubedit") || menu.AwayClubID == window.localStorage.getItem("Clubedit"))) {
                    if (menu.IsFinalScore == 0) {

                        $('#adminmenu' + menu.ID).show();
                        $('#score' + menu.ID).show();
                    }
                }
            }
        } else if (myDate > today) {

            if(menu.Field != "null"){
                $('#Directionss' + menu.ID).show();
            }else{
                $('#Directionss' + menu.ID).hide();
            }
            $('.lstscore').hide();

            if(window.localStorage.getItem("isadmin")==1) {

               // $('#score' + menu.ID).show();
                $('#adminmenu' + menu.ID).show();
                $('#cancell' + menu.ID).show();
                $('#referee' + menu.ID).show();
                $('#divdefault' + menu.ID).show();
                //$('#POTDadmin' + menu.ID).show();
            }


        }else{

            if(menu.Field != "null"){
                $('#Directionss' + menu.ID).show();
            }else{
                $('#Directionss' + menu.ID).hide();
            }
            $('.lstscore').show();

            if(menu.POTD != "1"){
                $("#POTD" + menu.ID).show();
                $('#socialshare' + menu.ID).removeClass(panelcolour);
            }else{
                $("#POTD" + menu.ID).hide();
                $('#socialshare' + menu.ID).addClass(panelcolour);
            }


            if(window.localStorage.getItem("isadmin")==1) {
                $('#adminmenu' + menu.ID).show();
                $('#POTDadmin' + menu.ID).show();
                if (menu.IsFinalScore == 0) {


                    $('#score' + menu.ID).show();
                    $('#cancell' + menu.ID).show();
                    $('#referee' + menu.ID).show();
                    $('#divdefault' + menu.ID).show();

                }


            }else{
                if (window.localStorage.getItem("allowcancel") == 1 && (menu.HomeClubID == window.localStorage.getItem("Clubedit") || menu.AwayClubID == window.localStorage.getItem("Clubedit"))) {
                    if (menu.IsFinalScore == 0) {

                        $('#adminmenu' + menu.ID).show();
                        $('#cancell' + menu.ID).show();
                    }
                }
                if (window.localStorage.getItem("allowscore") == 1 && (menu.HomeClubID == window.localStorage.getItem("Clubedit") || menu.AwayClubID == window.localStorage.getItem("Clubedit"))) {
                    if (menu.IsFinalScore == 0) {

                        $('#adminmenu' + menu.ID).show();
                        $('#score' + menu.ID).show();
                        $('#divdefault' + menu.ID).show();
                    }
                }
                if (window.localStorage.getItem("Ref") == 1) {
                    if (menu.IsFinalScore == 0) {

                        $('#adminmenu' + menu.ID).show();
                        $('#score' + menu.ID).show();
                        $('#cancell' + menu.ID).show();
                        $('#divdefault' + menu.ID).show();
                        $('#referee' + menu.ID).show();
                    }
                }
            }
        }
    }



    }else{

        $('#divschedules').append('<div class="panel panel-default">' +
            '<div class="panel-body">' +
            'No Games Today!' +
            '</div>' +
            '</div>');
    }




}
function loadPOTDdata(ID){


    db.transaction(loadPOTDdata2, errorCBfunc, successCBfunc);

    POTDdataid = ID;


}

function loadPOTDdata2(tx)
{
    sql = "select * from MobileApp_POTD where GameID =" + POTDdataid + " ORDER BY COUNT DESC";
  //  alert(sql);
    tx.executeSql(sql, [], loadPOTDdata_success);

}


function loadPOTDdata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    $('#modelPOTDdata').modal('show');

    $("#loadpotddata").empty();

      //  alert(len);
        if (len != 0) {
            for (var i = 0; i < len; i++) {
                var menu = results.rows.item(i);
                $("#loadpotddata").append('<div class="row" style="border-bottom: 1px solid #e5e5e5;padding-top: 5px;padding-bottom: 5px;">' +
                    '<div class="col-xs-6">' + menu.Team + '</div>' +
                    '<div class="col-xs-3">' + menu.PlayerNo + '</div>' +
                    '<div class="col-xs-3">' + menu.COUNT + '</div>' +

                    '</div>');

            }
    }
}


function GetPOTDAdmin(ID){

    sendinfotoserverPYOD(ID);
}


function resultsmore(){
    //alert(resultID);
    var values = resultID.split('||');

    resultshowmore(values[0],values[1],values[2],values[3],values[4],values[5],values[6]);

}


function sendPOTD(){
    $('#modelPOTD').modal('hide')
    db.transaction(function (tx) {
        tx.executeSql('Update App_Games set POTD = 1 where ID = ' + POTDID);
        console.log("Update INTO App_Games");
    });

    //alert("gameidPOTD=" + POTDID + "&POTD=1&playerno= " + $('#txtplayerno').val() + "&teamname=" + $('#switch-onText').bootstrapSwitch('state') + "&deviceid=" + deviceIDfunc + "&token=" +  window.localStorage.getItem("apptoken"));


    var response = passscoretoserverscorecard("gameidPOTD=" + POTDID + "&POTD=1&playerno=" + $('#txtplayerno').val() + "&teamname=" + $('#switch-onText').bootstrapSwitch('state') + "&deviceid=" + deviceIDfunc + "&token=" +  window.localStorage.getItem("apptoken"));



    if(response == "{'Success' : [{'Message': 'Everything is Good'}]"){
        // alert(response);
        db.transaction(getdatasch, errorCBfunc, successCBfunc);
    }else{
        alert(response);
        db.transaction(getdatasch, errorCBfunc, successCBfunc);

    }



}

function POTDclick(ID,Home,Away) {
    $('#modelPOTD').modal('show')
    POTDID = ID;

    var options = {
        onText: Home,
        onColor: 'primary',
        offColor: 'warning',
        offText: Away,
        animate: true,
    };


    $('#switch-onText').bootstrapSwitch('destroy', true);
    $("#switch-onText").bootstrapSwitch(options);

}

function closePOTD(){
    $('#modelPOTD').modal('hide')

    $('#modelPOTDdata').modal('hide')
}



function cgame(ID,Home,Away){
    IDcancel = ID;
    var text22 =Home + ' vs ' + Away;
    $('#divmainheadercancel').empty().append('Do you want to cancel this game </br> ' + text22)
}


function cancelgame(){



    cancelgamenow(IDcancel);



}

function checkdefault(ID,Home,Away){
    $('#divhometeam').empty().html('Home Team : ' + Home);
    $("#divhometeam").click(function () {
        checkdefaultgames(1,Home);
    });

    $('#divawayteam').empty().html('Away Team : ' + Away);
    $("#divawayteam").click(function () {
        checkdefaultgames(2,Away);
    });

}

function loadscorecard(ID){
    window.open("scorecard.html?ID=" + ID);
}

function loadmap(lat,long){
    window.open("https://www.google.co.nz/maps/dir/Current+Location/" + lat + ",+" + long, "_system")
}

function checkref(ID,name){
    refgameid = ID;

    if(name != 'null') {
        $('#txtrefname').val(name);
    }


}


function loadreftosystem(){

   var Gameid1 = refgameid
    db.transaction(function (tx) {
        tx.executeSql('Update App_Games set RefName = "' + $('#txtrefname').val() + '" where ID = ' + Gameid1);
        console.log("Update INTO App_Games");
    });

    passscoretoserver("gameidref=" + Gameid1 + "&refname=" + $('#txtrefname').val() + "&deviceid=" + device.uuid + "&token=" + window.localStorage.getItem("apptoken"))
    db.transaction(getgameids, errorCBfunc, successCBfunc);
}


function clearresults(){
    $('#resulthomegoals').empty();
    $('#resultawaygoals').empty();
    $('#resulthometeam').empty();
    $('#resultawayteam').empty();
    $('#resultscore').empty();
}

function resultshowmore(ID,hometeam,awayteam,homescore,awayscore,homeidd,awayidd){
    $('#resulthomegoals').empty();
    $('#resultawaygoals').empty();
    // alert(ID + " - " + hometeam + " - " +awayteam+ " - " +homescore+ " - " +awayscore+ " - " +homeidd+ " - " +awayidd);
    gameid =ID;
    homeid = homeidd;
    awayid = awayidd;
    $('#resulthometeam').empty().append(hometeam);
    $('#resultawayteam').empty().append(awayteam);
    $('#resultscore').empty().append(homescore + '-' + awayscore);

    db.transaction(getgoals, errorCBfunc, successCBfunc);

}

function getgoals(tx){
    var sql= "select m.ID,m.CreatedateUTC,m.UpdatedateUTC,m.DeletedateUTC,m.TeamID,m.GameID,m.PlayerID,m.ScoringID,m.Time,p.FullName from Mobilescoringbreakdown as m INNER JOIN " +
        "MobilevwApp_Base_Players as p  ON p.ID = m.PlayerID " +
        "where GameID = " + gameid + " order by CAST(m.Time AS INTEGER) ";
 //alert(sql);
    tx.executeSql(sql, [], getgoals_success);
}


function getgoals_success(tx, results) {
    var len = results.rows.length;
//alert(len);


    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var time = menu.Time + "\'";

        if(menu.TeamID == homeid){
            if(menu.ScoringID == 2) {
                $('#resulthomegoals').append('<img src="../img/image.php.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }else if(menu.ScoringID == 5) {
                $('#resulthomegoals').append('<img src="../img/conver.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }else if(menu.ScoringID == 6) {
                $('#resulthomegoals').append('<img src="../img/dropkick.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }else if(menu.ScoringID == 7) {
                $('#resulthomegoals').append('<img src="../img/pen.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }
        }
        if(menu.TeamID == awayid){

            if(menu.ScoringID == 2) {
                $('#resultawaygoals').append('<img src="../img/image.php.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }else if(menu.ScoringID == 5) {
                $('#resultawaygoals').append('<img src="../img/conver.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }else if(menu.ScoringID == 6) {
                $('#resultawaygoals').append('<img src="../img/dropkick.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }else if(menu.ScoringID == 7) {
                $('#resultawaygoals').append('<img src="../img/pen.png">' + ' ' + menu.FullName + " " + time + '<br>');
            }

        }

        if( $('#resulthomegoals').is(':empty') ) {

            $('#resulthomegoals').append('&nbsp;');
        }
        if( $('#resultawaygoals').is(':empty') ) {
            $('#resultawaygoals').append('&nbsp;');
        }

    }


    if(len==0){
        $('#divscorers').hide();



    }else{
        $('#divscorers').show();

    }



}



function resultssharemore(e,ID,ID2) {

    resultID = ID;
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation){
        e.stopPropagation();
        $('#basicModal').modal('show');
        loadinfo(ID2)
    }

}


function loadstatssystem(Gameid1){
    db.transaction(gettokensc, errorCBfunc, successCBfunc);

    passscoretoserver("gameid=" + Gameid1 + "&statslink=" + $('#txtstatlink').val() + "&deviceid=" + device.uuid + "&token=" + apptoken)
    window.setTimeout(function(){
        window.location = "../pages/schedules.html?id=" + id;
    }, 1000);



}

function loadinfo(ID) {
    IDhist = ID;
//alert(ID);
    db.transaction(loadinfo_success1, errorCBfunc, successCBfunc);

}

function loadinfo_success1(tx) {

    var sql = "select * from App_Games where ID =" + IDhist;

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

        if(window.localStorage.getItem("isadmin")==1) {



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


            $("#modelstatsupdate").click(function () {
                loadstatssystem(menu.ID);
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

                    $("#modelstatsupdate").click(function () {
                        loadstatssystem(menu.ID);
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
   //     $('#Directions').show();
      //  $("#Directions").click(function () {
    //        window.open("https://www.google.co.nz/maps/dir/Current+Location/" + menu.Latitude + ",+" + menu.Longitude, "_system")
    //    });
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
        passscoretoserver("gameiddefault=" + defaultgames + "&teamdefault=" + homeoraway + "&deviceid=" + device.uuid + "&token=" + apptoken)

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

function getfullday(day){

    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
return weekday[day];

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



function getpervoiusday(){
    if(window.localStorage.getItem("modelactive") == 0) {
        //  alert(date);
        date = new Date(date).setDate(date.getDate() - 1); //+1 or +x

        date = new Date(date);
        //  alert(date);
        var z = date.getMonth() + 1;
        datesend = date.getDate() + "/" + z + "/" + date.getFullYear();
        date2 = getfullday(date.getDay()) + "," + date.getDate() + "/" + z + "/" + date.getFullYear();
        //alert(date);
        document.getElementById("btndate").innerHTML = date2;

        if (networkconnectionsch != 0) {
            db.transaction(getgameids, errorCBfunc, successCBfunc);
        } else {
            $('#indexloadingdata').modal('hide');
            $('#loadinggears').hide();
            db.transaction(getdatasch, errorCBfunc, successCBfunc);
        }
    }
}
function getnextday(){


    if(window.localStorage.getItem("modelactive") == 0) {
        date = new Date(date).setDate(date.getDate() + 1); //+1 or +x
        date = new Date(date);
        var z = date.getMonth() + 1;
        datesend = date.getDate() + "/" + z + "/" + date.getFullYear();
        date2 = getfullday(date.getDay()) + "," + date.getDate() + "/" + z + "/" + date.getFullYear();
        //alert(date);
        document.getElementById("btndate").innerHTML = date2;


        if (networkconnectionsch != 0) {
            db.transaction(getgameids, errorCBfunc, successCBfunc);
        } else {
            $('#indexloadingdata').modal('hide');
            $('#loadinggears').hide();
            db.transaction(getdatasch, errorCBfunc, successCBfunc);
        }
    }



}





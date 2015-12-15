var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["ID"];

var team1all = 0;
var team2all = 0;

var networkconnectionscore = 0;
document.addEventListener("deviceready", onDeviceReadyscore, false);
var playerhome = 0;
var playeraway = 0;
var timehome = 0;
var timeaway = 0;
var scoringname =0;



var DIVid = "";
var HBonus1= 0;
var HBonus2= 0;
var ABonus1= 0;
var ABonus2= 0;

function onDeviceReadyscore() {
    checkonlinescore();



    if(networkconnectionscore !=0) {
        onclicksyncloaddata();
    }
    db.transaction(getMenusch, errorCBfunc, successCBfunc);

    window.setTimeout(function(){
        db.transaction(getdata, errorCBfunc, successCBfunc);
        db.transaction(getscoredata, errorCBfunc, successCBfunc);
    }, 1500);
}



function checkonlinescore(){
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';
    networkconnectionscore = states[networkState];
//alert(states[networkState]);

}

function getbothteams(team1,team2){
    team1all = team1;
    team2all = team2;

    db.transaction(getplayerinfo, errorCBfunc, successCBfunc);
}



function getplayerinfo(tx) {
    var sql = "select ID,_id,ClubID,FullName from MobilevwApp_Base_Players where ClubID in (" + team1all + "," + team2all + ") order by FullName" ;

    // alert(sql);
    tx.executeSql(sql, [], getplayerinfo_success);
}

function getscoredata(tx) {
    var sql = "select Name,Value,UpdatedateUTC from MobileScoringTable";
    //  alert(sql);
    tx.executeSql(sql, [], getscoredata_success);
}




function getplayerinfo_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    //alert(len);



    $('#divplayers').empty().append('<Div class="mainmenuscore" >' +
        '<div class="bold size13 floatleft2" align="center"  ><select id="drphometeam"></select></div>' +
        '<div class="bold size13 floatleftnew" align="center"  >Players</div>' +
        '<div class="bold size13 floatleft2" align="center"  ><select id="drpawayteam"></select></div>' +
        '</Div>');
    $('#divtime').empty().append('<Div class="mainmenuscore" >' +
        '<div class="bold size13 floatleft2" align="center"  ><select id="drphometime"></select></div>' +
        '<div class="bold size13 floatleftnew" align="center"  >Time</div>' +
        '<div class="bold size13 floatleft2" align="center"  ><select id="drpawaytime"></select></div>' +
        '</Div>');


    $('#drphometeam').empty();
    $('#drphometeam').empty();
    $('#drphometime').empty();
    $('#drpawaytime').empty();
    $('#drphometeam').append(new Option("",0))
    $('#drpawayteam').append(new Option("",0))
    $('#drphometime').append(new Option("",0))
    $('#drpawaytime').append(new Option("",0))

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        if(menu.ClubID == team1all){
            $('#drphometeam').append(new Option(menu.FullName,menu.ID))
        }else if(menu.ClubID == team2all) {
            $('#drpawayteam').append(new Option(menu.FullName,menu.ID))
        }
    }

    for (var i=1; i<95; i++) {

        $('#drphometime').append(new Option(i,i))
        $('#drpawaytime').append(new Option(i,i))
    }



}

function getdata(tx) {
    var sql = "select * from App_Games where ID = " + id;
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    var menu = results.rows.item(0);
    var Gameid =menu.ID;
    var res = (menu.DatetimeStart).split("T");


    HBonus1  = menu.HBonus1;
    HBonus2  = menu.HBonus2;
    ABonus1  = menu.ABonus1;
    ABonus2  = menu.ABonus2;

    $("#divbonus").hide();




    if(menu.IsFinalScore == 0) {


        $('#scorecard').empty().append('<Div class="mainmenuscore" >' +
            '<div class="bold size13 floatleft" align="center"  >' + menu.HomeName + '</div><div class="bold size13 floatleft" align="center"  >' + menu.AwayName + '</div>' +
            '<div class="floatleft" align="center" id="homescore"  >' + menu.HomeScore + '</div><div class="floatleft"  align="center" id="awayscore"  >' + menu.AwayScore + '</div>' +
            '' +
            '<div id="divplayers"></div>' +
            '<div id="divtime"></div>' +
            '<div id="divscore"  ></div>' +
            '<div id="divbonus"  ></div>' +
            '<div id="divhalffull" align="center"  >' +
            '<button id="btnhalf" class="btn btn-warning" onclick="gamestate(1,' + Gameid + ')" >Its Halftime</button><br>' +
            '<button id="btnfull" class="btn btn-warning" onclick="gamestate(2,' + Gameid + ')" >Its Fulltime</button><br>' +
            '<button id="btnapprove" class="btn btn-warning" onclick="gamestate(3,' + Gameid + ')" >Approve</button>' +
            '<button id="btnSync" class="btn btn-info" onclick="syncscore()" >Sync Data</button>' +
            '</div>' +
            '</Div>');





        $('#divtime').hide();

        if (menu.halftime != 'null') {
            if (menu.fulltime == 'null') {
                $("#btnhalf").hide();
                $("#btnapprove").hide();
            } else {
                $("#btnhalf").hide();
                $("#btnfull").hide();
            }
        }else{
            $("#btnfull").hide();
            $("#btnapprove").hide();

        }



        if (menu.IsFinalScore == 0 && (menu.halftime != 'null') && (menu.fulltime != 'null')) {

            if (window.localStorage.getItem("Ref") == 0) {
                $("#btnapprove").hide();
                $("#divbonus").hide();
            } else {
                $("#divbonus").show();
                $("#btnapprove").show();
            }

            if(window.localStorage.getItem("isadmin") == 1){
                $("#divbonus").show();
                $("#btnapprove").show();
            }

        } else {
            $("#btnapprove").hide();
            $("#divbonus").hide();
        }







        getbothteams(menu.HomeClubID, menu.AwayClubID);
    }else{
        $('#scorecard').empty().append("Thanks for approving this game!");

    }

}

function syncscore(){

    location.reload(true);
}




function gamestate(IDD,id){


  //  alert(IDD + "_" + id);

    if (IDD == 1) {
        alert(IDD + "_" + id);

        db.transaction(function (tx) {
            tx.executeSql('Update App_Games set halftime = "1" where ID = ' + id);
            console.log("Update INTO App_Games");
        });


    }else if (IDD == 2) {

        db.transaction(function (tx) {
            tx.executeSql('Update App_Games set halftime = "1", fulltime= "1" where ID = ' + id);
            console.log("Update INTO App_Games");
        });
    }else if (IDD == 3) {

        db.transaction(function (tx) {
            tx.executeSql('Update App_Games set IsFinalScore = "1" where ID = ' + id);
            console.log("Update INTO App_Games");
        });
    }
  //  db.transaction(getdata, errorCBfunc, successCBfunc);
 //   db.transaction(getscoredata, errorCBfunc, successCBfunc);

   halftimefulltimenow(id,IDD);
   // window.setTimeout(function(){
   //     location.reload(true);
   // }, 1000);



}

function getscoredata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    //  alert(len);
    $('#divbonus').empty()
    $('#divscore').empty()
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        //  alert(menu.Name);
        var plus = menu.Value;
        var minus =menu.Value*-1;

        $('#divscore').append('<Div class="mainmenuscore" >' +
            '<div class="bold size13 floatleft3" align="center"  >' +
            '<img src="../img/minus.png" onclick="getscore(1,'+ minus +',\''+ menu.Name + '\')" height="40">' +
            '<img src="../img/plus.png"  height="40" onclick="getscore(1,'+ plus +',\''+ menu.Name + '\')"> </div>' +
            '<div class="bold size13 floatleft3" align="center"  >' + menu.Name + '</div>' +
            '<div class="bold size13 floatleft3" align="center"  >' +
            '<img src="../img/minus.png"  onclick="getscore(0,'+ minus +',\''+ menu.Name + '\')" height="40">' +
            '<img src="../img/plus.png"   onclick="getscore(0,'+ plus +',\''+ menu.Name + '\')" height="40"></div>' +
            '</Div>');

    }

    var H1checked="";
    var H2checked="";
    var A1checked="";
    var A2checked="";

    if(HBonus1 ==1){
        H1checked="checked";
    }
    if(HBonus2 ==1){
        H2checked="checked";
    }
    if(ABonus1 ==1){
        A1checked="checked";
    }
    if(ABonus2 ==1){
        A2checked="checked";
    }

    $('#divbonus').append('<Div class="mainmenuscore" >' +
        '<div class="bold size13 floatleft3" align="center"  > <input type="checkbox" ' + H1checked + ' id="homebonus1" onclick="getbonus()">' +
        ' <input type="checkbox" ' + H2checked + ' id="homebonus2" onclick="getbonus()"> </div>' +
        '<div class="bold size13 floatleft3" align="center"  >Bonus Points</div>' +
        '<div class="bold size13 floatleft3" align="center"  >' +
        ' <input type="checkbox" ' + A1checked + ' id="awaybonus1"  onclick="getbonus()">' +
        ' <input type="checkbox" ' + A2checked + ' id="awaybonus2"  onclick="getbonus()">' +
        '</Div>');

}

function getbonus(){

    var home1 = 0;
    var home2 =0;
    var away1=0;
    var away2 = 0;

    if ($('#homebonus1').prop('checked') == true){
        home1 = 1;
    }
    if ($('#homebonus2').prop('checked') == true){
        home2 =1;
    }
    if ($('#awaybonus1').prop('checked') == true){
        away1=1;
    }
    if ($('#awaybonus2').prop('checked') == true){
        away2=1;
    }


        var response =   passscoretoserverscorecard("gameidbonus=" + id + "&bonushome1=" + home1 + "&bonushome2=" + home2 + "&bonusaway1=" + away1 + "&bonusaway2=" + away2 + "&deviceid=" + deviceIDfunc + "&token=" +  window.localStorage.getItem("apptoken"))



    if(response = "{'Success' : [{'Message': 'Everything is Good'}]"){
        //  alert(response);
        location.reload(true);
    }



}



function getscore(team,value,name){
    checkonlinescore();
    if(networkconnectionscore != 0) {

        playerhome = $('#drphometeam').val();
        playeraway = $('#drpawayteam').val();
        timehome = $('#drphometime').val();
        timeaway = $('#drpawaytime').val();
        scoringname = name;


        if (team == 0) {
            db.transaction(function (tx) {
                tx.executeSql('Update App_Games set AwayScore = AwayScore+' + value + ' where ID = ' + id);
                console.log("Update INTO App_Games");
            });
        } else if (team == 1) {
            db.transaction(function (tx) {
                tx.executeSql('Update App_Games set HomeScore = HomeScore+' + value + '  where ID = ' + id);
                console.log("Update INTO App_Games");
            });
        }

        //update score;
     //   db.transaction(getdata, errorCBfunc, successCBfunc);
        //update buttons
      //  db.transaction(getscoredata, errorCBfunc, successCBfunc);
        //getting token for sync

        db.transaction(getscorefromtable, errorCBfunc, successCBfunc);
    }else{

        //   alert("You don't have access to internet!");
    }
}

function getscorefromtable(tx) {
    var sql = "select ID,HomeScore ,AwayScore from App_Games where ID = '" + id + "'";
    //  alert(sql);
    tx.executeSql(sql, [], getscorefromtable_success);
}

function getscorefromtable_success(tx, results) {

    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
    //  alert("gameid=" + menu.ID + "&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDfunc + "&token=" +  window.localStorage.getItem("apptoken"));



//alert("gameid=" + menu.ID + "&scoringname=" + scoringname + "&homeplayer=" + playerhome + "&awayplayer=" + playeraway + "&hometime=0&awaytime=0&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDfunc + "&token=" +  window.localStorage.getItem("apptoken"));
    var response = passscoretoserverscorecard("gameid=" + menu.ID + "&scoringname=" + scoringname + "&homeplayer=" + playerhome + "&awayplayer=" + playeraway + "&hometime=0&awaytime=0&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDfunc + "&token=" +  window.localStorage.getItem("apptoken"));

    //alert(response);

    if(response = "{'Success' : [{'Message': 'Everything is Good'}]"){
        // alert(response);
        location.reload(true);
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
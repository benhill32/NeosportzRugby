var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["ID"];
var gtoken =0;
var team1all = 0;
var team2all = 0;
var deviceIDscorecard;
var networkconnectionscore = 0;
document.addEventListener("deviceready", onDeviceReady, false);
var playerhome = 0;
var playeraway = 0;
var timehome = 0;
var timeaway = 0;
var scoringname =0;

function onDeviceReady() {

    deviceIDscorecard = device.uuid;
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
  //  console.log("LOCALDB - Database ready");
    db.transaction(getdata, errorCBfunc, successCBfunc);
    db.transaction(getscoredata, errorCBfunc, successCBfunc);
    checkonlinescore()
}

db.transaction(getdata, errorCBfunc, successCBfunc);
db.transaction(getscoredata, errorCBfunc, successCBfunc);


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
    var sql = "select ID,_id,ClubID,FullName,Base64,TeamID,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,Position,DeletedateUTC,NickName,Height,Weight ,DOB ,BirthPlace,SquadNo,Nationality ,Honours,Previous_Clubs,memorable_match,Favourite_player ,Toughest_Opponent,Biggest_influence ,person_admire ,Best_goal_Scored ,Hobbies ,be_anyone_for_a_day from MobilevwApp_Base_Players where ClubID in (" + team1all + "," + team2all + ") order by FullName" ;

     // alert(sql);
    tx.executeSql(sql, [], getplayerinfo_success);
}

function getscoredata(tx) {
    var sql = "select Name,Value,UpdatedateUTC from MobileScoringTable";
   //  alert(sql);
    tx.executeSql(sql, [], getscoredata_success);
}


function getdata(tx) {
    var sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,halftime,fulltime from MobileApp_Results where ID = '" + id + "'";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
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

function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    var menu = results.rows.item(0);
var Gameid =menu.ID;
        var res = (menu.DatetimeStart).split("T");

            $('#scorecard').empty().append('<Div class="mainmenuscore" >' +
                '<div class="bold size13 floatleft" align="center"  >' + menu.HomeName + '</div><div class="bold size13 floatleft" align="center"  >' + menu.AwayName  + '</div>' +
                '<div class="floatleft" align="center" id="homescore"  >' + menu.HomeScore + '</div><div class="floatleft"  align="center" id="awayscore"  >' + menu.AwayScore + '</div>' +
                '' +
                '<div id="divplayers"></div>' +
                '<div id="divtime"></div>' +
                '<div id="divscore"  ></div>' +
                '<div id="divhalffull" align="center"  >' +
                '<button id="btnhalf" class="btn btn-warning" onclick="gamestate(1,' + Gameid + ')" >Its Halftime</button><br>' +
                '<button id="btnfull" class="btn btn-warning" onclick="gamestate(2,' + Gameid + ')" >Its Fulltime</button>' +
                '</div>' +
                '</Div>');

    if(menu.halftime !='null'){
        if(menu.fulltime == 'null') {
            $("#btnhalf").hide();
        }else{
            $("#btnfull").hide();
        }
    }

    if(menu.halftime == 'null'){
        $("#btnfull").hide();
    }else{

        $("#btnhalf").hide();
    }

    getbothteams(menu.HomeClubID,menu.AwayClubID);


}

function gamestate(IDD,id){

        if (IDD == 1) {
            db.transaction(function (tx) {
                tx.executeSql('Update MobileApp_Results set halftime = 1 where ID = ' + id);
                console.log("Update INTO MobileApp_Results");
            });


        }else{

            db.transaction(function (tx) {
                tx.executeSql('Update MobileApp_Results set halftime = 1, fulltime= 1 where ID = ' + id);
                console.log("Update INTO MobileApp_Results");
            });
        }
    db.transaction(getdata, errorCBfunc, successCBfunc);
    db.transaction(getscoredata, errorCBfunc, successCBfunc);

    halftimefulltimenow(id,IDD);

}

function getscoredata_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
        //alert(len);

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var plus = menu.Value;
        var minus =menu.Value*-1;

        $('#divscore').empty().append('<Div class="mainmenuscore" >' +
            '<div class="bold size13 floatleft3" align="center"  ><img src="../img/minus.png" onclick="getscore(1,'+ minus +',\''+ menu.Name + '\')" height="40">' +
            '<img src="../img/plus.png"  height="40" onclick="getscore(1,'+ plus +',\''+ menu.Name + '\')"> </div>' +
            '<div class="bold size13 floatleft3" align="center"  >' + menu.Name + '</div>' +
            '<div class="bold size13 floatleft3" align="center"  >' +
            '<img src="../img/minus.png"  onclick="getscore(0,'+ minus +',\''+ menu.Name + '\')" height="40">' +
            '<img src="../img/plus.png"   onclick="getscore(0,'+ plus +',\''+ menu.Name + '\')" height="40"></div>' +
            '</Div>');

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
            tx.executeSql('Update MobileApp_Results set AwayScore = AwayScore+' + value + ' where ID = ' + id);
            console.log("Update INTO MobileApp_Results");
        });
    } else if (team == 1) {
        db.transaction(function (tx) {
            tx.executeSql('Update MobileApp_Results set HomeScore = HomeScore+' + value + '  where ID = ' + id);
            console.log("Update INTO MobileApp_Results");
        });
    }

    //update score;
    db.transaction(getdata, errorCBfunc, successCBfunc);
    //update buttons
    db.transaction(getscoredata, errorCBfunc, successCBfunc);
    //getting token for sync
    db.transaction(gettoken, errorCBfunc, successCBfunc);
    db.transaction(getscorefromtable, errorCBfunc, successCBfunc);
}else{

 //   alert("You don't have access to internet!");
}
}

function getscorefromtable(tx) {
    var sql = "select ID,HomeScore ,AwayScore from MobileApp_Results where ID = '" + id + "'";
    //  alert(sql);
    tx.executeSql(sql, [], getscorefromtable_success);
}

function getscorefromtable_success(tx, results) {

    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);
  //  alert("gameid=" + menu.ID + "&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken);




    passscoretoserver("gameid=" + menu.ID + "&scoringname=" + scoringname + "&homeplayer=" + playerhome + "&awayplayer=" + playeraway + "&hometime=" + timehome + "&awaytime=" + timeaway + "&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken)

    onclicksyncloaddata();


}




function gettoken(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettoken_success);
}

function gettoken_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    gtoken = menu.token;

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
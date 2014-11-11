var db;
var dbCreated = false;
var id = getUrlVars()["id"];
var clubidtop =0;
var listfollow = 0;
var fliter = 0;
var gameid = 0;
var homeid = 0;
var awayid = 0;
document.addEventListener("deviceready", onDeviceReadyresult, false);

function onDeviceReadyresult() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getfliter, errorCBfunc, successCBfunc);
}

//db.transaction(getfliter, errorCBfunc, successCBfunc);

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
    var sql = "select fliterON from MobileApp_LastUpdatesec";
    //alert(sql);
    tx.executeSql(sql, [], getfliter_success);
}


function getfliter_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);
        fliter = menu.fliterON;
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
        sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,halftime,fulltime from MobileApp_Results where DivisionID = '" + id + "' and DatetimeStartSeconds <= " + midnightsec + " and DeletedateUTC = 'null'  order by DatetimeStart DESC";

    }else{
        $('#btn2').removeClass("btn btn-xs btn-primary active");
        $('#btn2').addClass("btn btn-xs btn-default");
        $('#btn1').removeClass("btn btn-xs btn-default");
        $('#btn1').addClass("btn btn-xs btn-primary active");
        sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,halftime,fulltime from MobileApp_Results where (HomeClubID IN (" + listfollow + ") or AwayClubID IN (" + listfollow + ")) and DatetimeStartSeconds <= " + midnightsec + " and DivisionID = '" + id + "'  and DeletedateUTC = 'null' order by DatetimeStart DESC";

    }


    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#divresults').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);


        var res = (menu.DatetimeStart).split("T");
        var split = res[0].split("-");
        var month = split[1];
        var year = split[0];
        var day = split[2];

        var h = res[1].substring(0,2)
        var ampm = h > 12 ? h-12 +'PM' : h +'AM';
        var action = '';

        if(menu.halftime != 'null' && menu.fulltime != 'null') {
              action = "Fulltime";
        }else  if(menu.halftime != 'null' && menu.fulltime == 'null') {
                action = "Halftime";
        }else  if(menu.halftime == 'null' && menu.fulltime == 'null') {
            action = "";
        }


        var date2 = new Date(menu.DatetimeStart);
       // alert(date2);
        $('#divresults').append('<Div class="mainmenuresult" align="left" data-toggle="modal" data-target="#basicModalresults" onclick="resultshowmore('+menu.ID+',\''+menu.HomeName+'\',\''+menu.AwayName+'\','+menu.HomeScore+','+menu.AwayScore+','+menu.HomeTeamID+','+menu.AwayTeamID+')"  >' +
            '<div class="bold size13"  >' + menu.HomeName + ' vs ' + menu.AwayName + '</div>' +
            '<div class="bold size13" >' + menu.HomeScore + ' - ' + menu.AwayScore + '  ' + action + '</div>' +
            '<div class="size11"  >' + menu.DivisionName + '</div>' +
            '<div class="size11">' + menu.TournamentName + '</div>' +
            '<div class="size11">' + ampm  + " " + day + '/' + month + '/' + year + '</div>' +
            '<div class="size11 blue" style="text-align: center!important;">More</div>' +

            '</Div>');
    }


}

function resultshowmore(ID,hometeam,awayteam,homescore,awayscore,homeidd,awayidd){

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
       "where GameID = " + gameid + " order by m.Time";
// alert(sql);
    tx.executeSql(sql, [], getgoals_success);
}


function getgoals_success(tx, results) {
    var len = results.rows.length;

    $('#resulthomegoals').empty();
    $('#resultawaygoals').empty();

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
    var time = menu.Time + "\'";

        if(menu.TeamID == homeid){
            $('#resulthomegoals').append('<img src="../img/image.php.png">' + ' ' + menu.FullName + " " + time + '<br>');
        }
        if(menu.TeamID == awayid){
            $('#resultawaygoals').append('<img src="../img/image.php.png">' + ' ' + menu.FullName + " "  + time + '<br>');
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
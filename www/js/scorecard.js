var db;
var dbCreated = false;
var IDhist = 0;
var id = getUrlVars()["ID"];
var gtoken =0;

var deviceIDscorecard;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    deviceIDscorecard = device.uuid;
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getdata, errorCBfunc, successCBfunc);
    db.transaction(getscoredata, errorCBfunc, successCBfunc);

}

function getscoredata(tx) {
    var sql = "select Name,Value,UpdatedateUTC from MobileScoringTable";
   //  alert(sql);
    tx.executeSql(sql, [], getscoredata_success);
}


function getdata(tx) {
    var sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final from MobileApp_Results where ID = '" + id + "'";
  //  alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);



        var menu = results.rows.item(0);
        var res = (menu.DatetimeStart).split("T");

            $('#scorecard').empty().append('<Div class="mainmenuscore" >' +
                '<div class="bold size13 floatleft" align="center"  >' + menu.HomeName + '</div><div class="bold size13 floatleft" align="center"  >' + menu.AwayName  + '</div>' +
                '<div class="floatleft" align="center" id="homescore"  >' + menu.HomeScore + '</div><div class="floatleft"  align="center" id="awayscore"  >' + menu.AwayScore + '</div>' +
                '' +
                '<div id="divscore"  ></div>' +
                '</Div>');


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
            '<div class="bold size13 floatleft3" align="center"  ><img src="../img/minus.png" onclick="getscore(1,'+ minus +')" height="40">' +
            '<img src="../img/plus.png"  height="40" onclick="getscore(1,'+ plus +')"> </div>' +
            '<div class="bold size13 floatleft3" align="center"  >' + menu.Name + '</div>' +
            '<div class="bold size13 floatleft3" align="center"  >' +
            '<img src="../img/minus.png"  onclick="getscore(0,'+ minus +')" height="40">' +
            '<img src="../img/plus.png"   onclick="getscore(0,'+ plus +')" height="40"></div>' +
            '</Div>');

    }
}


function getscore(team,value){

    if(team == 0){

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_Results set AwayScore = AwayScore+' + value + ' where ID = ' + id);
            console.log("Update INTO MobileApp_Results");
        });

    }else if (team ==1){

        db.transaction(function(tx) {
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
    db.transaction(getscorefromtable,errorCBfunc,successCBfunc);

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
    passscoretoserver("gameid=" + menu.ID + "&home=" + menu.HomeScore + "&away=" + menu.AwayScore + "&deviceid=" + deviceIDscorecard + "&token=" + gtoken)

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
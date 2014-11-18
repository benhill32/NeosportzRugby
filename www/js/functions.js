document.addEventListener("deviceready", onDeviceReadyFunc, false);
var db;
var deviceIDfunc;
var devicemodelfunc;
var deviceCordovafunc;
var devicePlatformfunc;
var deviceVersionfunc;
var databaseversion;
var appversion = -1;
var apptoken = 0;
var networkconnectionfun= 0;

function onDeviceReadyFunc() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    checkonlinefunctions();
    deviceIDfunc = device.uuid;
    devicemodelfunc = device.model;
    deviceCordovafunc = device.cordova;
    devicePlatformfunc = device.platform;
    deviceVersionfunc = device.version;
    databaseversion = db.database_version;
    db.transaction(gettoken1, errorCBfunc, successCBfunc);
    document.addEventListener("backbutton", onBackKeyDown, false);

}
//db.transaction(gettoken1, errorCBfunc, successCBfunc);




function checkonlinefunctions(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnectionfun = states[networkState];
//alert(states[networkState]);

}




function onBackKeyDown() {
var page = $(location).attr('pathname');
    if(page =="/android_asset/www/index.html"){
        navigator.app.exitApp();
    }else{
        parent.history.back();
    }
}


function weblink(htmllink){
    window.location.href=htmllink;
    }


function clearfavteam(){

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_clubs set Fav = 0');
        console.log("Update INTO MobileApp_clubs");
    });


}

function clearcurrentfavteam(id){
    db.transaction(gettoken1, errorCBfunc, successCBfunc);
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_clubs set Fav = 0,Follow= 0 where ID=' + id);
        console.log("Update INTO MobileApp_clubs");
    });

    passscoretoserver("Favclub=0&deviceid=" + deviceIDfunc + "&token=" + apptoken)

   // alert("Favclub=0&deviceid=" + deviceIDfunc + "&token=" + apptoken)

}


function clearhaveclub(){
    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0');
        console.log("Update MobileApp_LastUpdatesec");
    });

}

function clearotherfavteam(id){

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_clubs set Fav = 0 where ID != ' + id);
        console.log("Update INTO MobileApp_clubs");
    });


}


function addfavteam(ID){

    db.transaction(gettoken1, errorCBfunc, successCBfunc);

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_clubs set Fav = 1,Follow= 0 where ID=' + ID);
        console.log("Update INTO MobileApp_clubs");
    });

    passscoretoserver("Favclub=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken)

// alert("favclub=" + ID + "&deviceid=" + deviceIDfunc + "&token=" + apptoken)
}

function addfavclub(){

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 1');
        console.log("Update MobileApp_LastUpdatesec");
    });
}


function clearfavclub(){
    var funcdate = new Date();
    var functime = funcdate.getTime();

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0, hasclubdate = "' + functime + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });
}


function goBack() {
    window.history.back()
}



function errorCBfunc(err) {
    console.log("Error processing SQL: "+err.code);
    //alert("Error processing SQL loaddata: "+err.code);
}

function successCBfunc() {
    //  alert("success!");
}

function passscoretoserver(testvar){

    var http = new XMLHttpRequest();
    var url = "http://centralfootball.neosportz.com/loaddatafromapp.aspx";
    var params = "?" + testvar;

    http.open("POST", url + params, true);
    console.log(url + params);

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            // alert(http.responseText);
        }
    }
    http.send();

}


function passnewfeedtoserver(testvar){

    var http = new XMLHttpRequest();
    var url = "http://centralfootball.neosportz.com/apploadnewsfeed.aspx";
    var params = "?" + testvar;
    http.open("POST", url + params, true);

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
           //  alert(http.responseText);
        }
    }

    http.send();

}

function passcancelgametoserver(testvar){

    var http = new XMLHttpRequest();
    var url = "http://centralfootball.neosportz.com/apploadcancelgame.aspx";
    var params = "?" + testvar;
    http.open("POST", url + params, true);
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //  alert(http.responseText);
        }
    }

    http.send();

}


function getUrlVarsfunc() {
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

function blankLastUpdatesec(){

    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();

   // $('#busy').show();
    xmlHttp.open("GET", 'http://centralfootball.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&databasever=' + databaseversion + '&appver=' + appversion,false);
    xmlHttp.send();
  //  alert('http://centralfootball.neosportz.com/registerdevice.aspx?deviceID=' + deviceIDfunc + '&devicemodel=' + devicemodelfunc + '&deviceCordova=' + deviceCordovafunc + '&devicePlatform=' + devicePlatformfunc + '&deviceVersion=' + deviceVersionfunc + '&databasever=' + databaseversion + '&appver=' + appversion);
    var json = xmlHttp.responseText;

    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO MobileApp_LastUpdatesec (Datesecs,datemenus,syncwifi,isadmin,token,hasclub,fliterON) VALUES ("0", "0",0,0,"' + json + '",0,0)');
        console.log("INSERT INTO MobileApp_LastUpdatesec");
     //   alert('INSERT INTO MobileApp_LastUpdatesec (Datesecs,datemenus,syncwifi,isadmin,token,hasclub,fliterON) VALUES ("0", "0",0,0,"' + json + '",0,0)');
    });



}

var randfunc = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

function updatemenutables(obj){



    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Results_Menu ');
        console.log("MobileApp_Results_Menu table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Schedule_Menu ');
        console.log("MobileApp_Schedule_Menu table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Schedule_Menu (_id INTEGER NOT NULL, DivisionName TEXT NOT NULL,DivisionID INTEGER NOT NULL,UpdateDateUTC TEXT NULL,DatetimeStart TEXT NOT NULL,DivisionOrderID INTEGER NOT NULL)');
        console.log("MobileApp_Schedule_Menu table is created");
    });
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Results_Menu (_id INTEGER NOT NULL, DivisionName TEXT NOT NULL,DivisionID INTEGER NOT NULL,UpdateDateUTC TEXT NULL,DatetimeStart TEXT NOT NULL,DivisionOrderID INTEGER NOT NULL)');
        console.log("MobileApp_Results_Menu table is created");
    });



    $.each(obj.App_Schedule_Menu, function (idx, obj) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO MobileApp_Schedule_Menu (_id, DivisionName,DivisionID ,UpdateDateUTC ,DatetimeStart,DivisionOrderID ) VALUES (' + obj._id + ',"' + obj.DivisionName + '", ' + obj.DivisionID + ',"' + obj.UpdateDateUTC + '", "' + obj.DatetimeStart + '", ' + obj.DivisionOrderID + ' )');
            console.log("INSERT INTO MobileApp_Schedule_Menu is created");
        });
    });

    $.each(obj.App_Results_Menu, function (idx, obj) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO MobileApp_Results_Menu (_id, DivisionName,DivisionID ,UpdateDateUTC ,DatetimeStart,DivisionOrderID ) VALUES (' + obj._id + ',"' + obj.DivisionName + '", ' + obj.DivisionID + ',"' + obj.UpdateDateUTC + '", "' + obj.DatetimeStart + '", ' + obj.DivisionOrderID + ' )');
            console.log("INSERT INTO MobileApp_Results_Menu is created");
        });
    });
}

var checkintvalue = function (val){

    if(val == 'undefined'){

        return 0;
    }else{

        return val;
    }

}



function syncmaintables(obj){
    $('#busy').hide();
   // var totalnew =0;

  //  totalnew =  checkintvalue(obj.App_Results.length) + checkintvalue(obj.clubs.length) + checkintvalue(obj.App_Schedule.length)+ checkintvalue(obj.clubsimages.length)+ checkintvalue(obj.vwApp_Teams.length)+ checkintvalue(obj.vwApp_News_v_2.length)+ checkintvalue(obj.App_Players.length)+ checkintvalue(obj.App_Players_Images.length)+ checkintvalue(obj.ScoringTable.length)+ checkintvalue(obj.Standings.length)+ checkintvalue(obj.sponsorsclub.length)+ checkintvalue(obj.screenimage.length);

   // $.each(obj.Error, function (idx, obj) {

    //    errorclosemodel();

   // });

    $.each(obj.App_Results2, function (idx, obj) {

        if(obj.DeletedateUTC == null){

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Semi,Final,DeletedateUTC,halftime ,fulltime  ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Semi + ',' + obj.Final + ',"' + obj.DeletedateUTC + '","' + obj.halftime + '","' + obj.fulltime + '" )');
                //  console.log('INSERT OR IGNORE INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',"' + obj.DeletedateUTC + '" )');
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_Results SET DatetimeStart = "' + obj.DatetimeStart + '", HomeName = "' + obj.HomeName + '", AwayName = "' + obj.AwayName + '", Field ="' + obj.Field + '", Latitude = "' + obj.Latitude + '", Longitude = "' + obj.Longitude + '", DivisionID = ' + obj.DivisionID + ', DivisionName = "' + obj.DivisionName + '", HomeClubID = ' + obj.HomeClubID + ', AwayClubID = ' + obj.AwayClubID + ', HomeTeamID = ' + obj.HomeTeamID + ', AwayTeamID = ' + obj.AwayTeamID + ', HomeScore = ' + obj.HomeScore + ', AwayScore = ' + obj.AwayScore + ', UpdateDateUTC = "' + obj.UpdateDateUTC + '", TournamentName = "' + obj.TournamentName + '", TournamentID = ' + obj.TournamentID + ', DatetimeStartSeconds = "' + obj.DatetimeStartSeconds + '", DivisionOrderID =' + obj.DivisionOrderID + ', ShowToAll=' + obj.ShowToAll + ', Final = ' + obj.Final + ', Semi = ' + obj.Semi + ', DeletedateUTC = "' + obj.DeletedateUTC + '", halftime ="' + obj.halftime + '", fulltime= "' + obj.fulltime + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
                // console.log(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_Results where ID =' + obj.ID);
                // console.log('Delete MobileApp_Results where ID =' + obj.ID);
            });
        }
    });

    $.each(obj.App_Results, function (idx, obj) {

     if(obj.DeletedateUTC == null){

        db.transaction(function (tx) {
             tx.executeSql('INSERT OR IGNORE INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Semi,Final,DeletedateUTC,halftime ,fulltime  ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Semi + ',' + obj.Final + ',"' + obj.DeletedateUTC + '","' + obj.halftime + '","' + obj.fulltime + '" )');
             //  console.log('INSERT OR IGNORE INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',"' + obj.DeletedateUTC + '" )');
         });
         db.transaction(function (tx) {
             var sql = 'UPDATE MobileApp_Results SET DatetimeStart = "' + obj.DatetimeStart + '", HomeName = "' + obj.HomeName + '", AwayName = "' + obj.AwayName + '", Field ="' + obj.Field + '", Latitude = "' + obj.Latitude + '", Longitude = "' + obj.Longitude + '", DivisionID = ' + obj.DivisionID + ', DivisionName = "' + obj.DivisionName + '", HomeClubID = ' + obj.HomeClubID + ', AwayClubID = ' + obj.AwayClubID + ', HomeTeamID = ' + obj.HomeTeamID + ', AwayTeamID = ' + obj.AwayTeamID + ', HomeScore = ' + obj.HomeScore + ', AwayScore = ' + obj.AwayScore + ', UpdateDateUTC = "' + obj.UpdateDateUTC + '", TournamentName = "' + obj.TournamentName + '", TournamentID = ' + obj.TournamentID + ', DatetimeStartSeconds = "' + obj.DatetimeStartSeconds + '", DivisionOrderID =' + obj.DivisionOrderID + ', ShowToAll=' + obj.ShowToAll + ', Final = ' + obj.Final + ', Semi = ' + obj.Semi + ', DeletedateUTC = "' + obj.DeletedateUTC + '", halftime ="' + obj.halftime + '", fulltime= "' + obj.fulltime + '" where ID = ' + obj.ID;
           tx.executeSql(sql);
              // console.log(sql);
         });
    }else{
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileApp_Results where ID =' + obj.ID);
             // console.log('Delete MobileApp_Results where ID =' + obj.ID);
        });
    }
    });


    $.each(obj.clubs, function (idx, obj) {
        if(obj.DeletedateUTC == null){

            // console.log('Delete MobileApp_clubs where ID');
            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobileApp_clubs(ID,_id ,name,UpdateDateUTC,UpdateDateUTCBase64 ,Base64,History,Contacts,UpdateSecondsUTC,UpdateSecondsUTCBase64,Color,Fav,Follow,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.name + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.Base64 + '","' + obj.History + '","' + obj.Contacts + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '", "' + obj.Color + '",0,0,"' + obj.DeletedateUTC + '")');
                //    console.log("INSERT INTO MobileApp_clubs is created");
            });

            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_clubs SET UpdateDateUTC = "' + obj.UpdateDateUTC + '", UpdateDateUTCBase64 = "' + obj.UpdateDateUTCBase64 + '", Base64 = "' + obj.Base64 + '", History ="' + obj.History + '", Contacts = "' + obj.Contacts + '", UpdateSecondsUTC = "' + obj.UpdateSecondsUTC + '", UpdateSecondsUTCBase64 = "' + obj.UpdateSecondsUTCBase64 + '", Color = "' + obj.Color + '", DeletedateUTC = "' + obj.DeletedateUTC + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
                // console.log(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_clubs where ID =' + obj.ID);
            });

        }
    });

    $.each(obj.App_Schedule, function (idx, obj) {
        if (obj.DeletedateUTC == null) {
            db.transaction(function (tx) {
            tx.executeSql('INSERT OR IGNORE INTO MobileApp_Schedule(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Semi,Final,Cancel,DeletedateUTC,halftime ,fulltime  ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ',"' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',' + obj.Semi + ',' + obj.Cancel + ',"' + obj.DeletedateUTC + '","' + obj.halftime + '","' + obj.fulltime + '" )');
            //   console.log("INSERT INTO MobileApp_Schedule is created");
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_Schedule SET DatetimeStart = "' + obj.DatetimeStart + '", HomeName = "' + obj.HomeName + '", AwayName = "' + obj.AwayName + '", Field ="' + obj.Field + '", Latitude = "' + obj.Latitude + '", Longitude = "' + obj.Longitude + '", DivisionID = ' + obj.DivisionID + ', DivisionName = "' + obj.DivisionName + '", HomeClubID = ' + obj.HomeClubID + ', AwayClubID = ' + obj.AwayClubID + ', HomeTeamID = ' + obj.HomeTeamID + ', AwayTeamID = ' + obj.AwayTeamID + ', UpdateDateUTC = "' + obj.UpdateDateUTC + '", TournamentName = "' + obj.TournamentName + '", TournamentID = ' + obj.TournamentID + ', DatetimeStartSeconds = "' + obj.DatetimeStartSeconds + '", DivisionOrderID =' + obj.DivisionOrderID + ', ShowToAll=' + obj.ShowToAll + ', Semi = ' + obj.Semi + ', Final = ' + obj.Final + ',Cancel =' + obj.Cancel +', DeletedateUTC = "' + obj.DeletedateUTC + '", halftime ="' + obj.halftime + '", fulltime= "' + obj.fulltime + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_Schedule where ID =' + obj.ID);
                //   console.log('Delete MobileApp_Schedule where ID');
            });
        }
    });


    $.each(obj.clubsimages, function (idx, obj) {

        db.transaction(function (tx) {
            tx.executeSql('INSERT OR IGNORE INTO MobileApp_clubsimages(ID,_id,UpdateDateUTCBase64,Base64,UpdateSecondsUTCBase64) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.UpdateDateUTCBase64 + '","' + obj.Base64 + '","' + obj.UpdateSecondsUTCBase64 + '")');
        //    console.log("INSERT INTO MobileApp_clubsimages is created");
        });
        db.transaction(function (tx) {
            var sql = 'UPDATE MobileApp_clubsimages SET UpdateDateUTCBase64 = "' + obj.UpdateDateUTCBase64 + '", Base64 = "' + obj.Base64 + '", UpdateSecondsUTCBase64 = "' + obj.UpdateSecondsUTCBase64 + '" where ID = ' + obj.ID;
            tx.executeSql(sql);
            // console.log(sql);
        });
    });

    $.each(obj.vwApp_Teams, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

        db.transaction(function (tx) {
            tx.executeSql('INSERT OR IGNORE INTO MobileApp_vwApp_Teams(ID,_id,Name,Base64,ClubID,DivisionID,DivisionName,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.Name + '","' + obj.Base64 + '",' + obj.ClubID + ',' + obj.DivisionID + ',"' + obj.DivisionName + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.DeletedateUTC + '")');
        //    console.log("INSERT INTO MobileApp_vwApp_Teams is created");
        });

        db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_vwApp_Teams SET Name = "' + obj.Name + '", Base64 = "' + obj.Base64 + '", ClubID = ' + obj.ClubID + ', DivisionID = ' + obj.DivisionID + ',DivisionName = "' + obj.DivisionName + '",UpdateSecondsUTC = "' + obj.UpdateSecondsUTC + '",UpdateSecondsUTCBase64 = "' + obj.UpdateSecondsUTCBase64 + '",UpdateDateUTC = "' + obj.UpdateDateUTC + '",UpdateDateUTCBase64 = "' + obj.UpdateDateUTCBase64 + '",DeletedateUTC = "' + obj.DeletedateUTC + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_vwApp_Teams where ID =' + obj.ID);
                //    console.log('Delete MobileApp_vwApp_Teams where ID');
            });
        }
    });
//    window.plugins.toast.showShortCenter('Updating Tables!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});

    $.each(obj.vwApp_News_v_2, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_News_v_2(ID,_id,UpdateDateUTC,Title,Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.UpdateDateUTC + '","' + obj.Title + '","' + obj.Body + '",' + obj.ClubID + ',"' + obj.TeamID + '","' + obj.Hide + '","' + obj.IsAd + '","' + obj.Base64 + '","' + obj.URL + '","' + obj.Hint + '","' + obj.DisplayDateUTC + '","' + obj.DisplaySecondsUTC + '","' + obj.DeletedateUTC + '","' + obj.FromPhone + '")');
                //   console.log("INSERT INTO MobilevwApp_News_v_2 is created");
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_News_v_2 SET UpdateDateUTC = "' + obj.UpdateDateUTC + '", Title = "' + obj.Title + '", Body = "' + obj.Body + '", ClubID = ' + obj.ClubID + ', TeamID = "' + obj.TeamID + '",Hide = "' + obj.Hide + '",IsAd = "' + obj.IsAd + '",Base64 = "' + obj.Base64 + '",URL = "' + obj.URL + '",Hint = "' + obj.Hint + '",DisplayDateUTC = "' + obj.DisplayDateUTC + '",DisplaySecondsUTC = "' + obj.DisplaySecondsUTC + '",DeletedateUTC = "' + obj.DeletedateUTC + '",FromPhone = "' + obj.FromPhone + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_News_v_2 where ID =' + obj.ID);
            });
        }

    });

    $.each(obj.App_Players, function (idx, obj) {
        if (obj.DeletedateUTC == null) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO MobilevwApp_Base_Players(ID,_id,ClubID,FullName,Base64,TeamID,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,Position,DeletedateUTC,NickName,Height,Weight ,DOB ,BirthPlace,SquadNo,Nationality ,Honours ,Previous_Clubs,memorable_match,Favourite_player ,Toughest_Opponent,Biggest_influence ,person_admire ,Best_goal_Scored ,Hobbies ,be_anyone_for_a_day) VALUES (' + obj.ID + ',' + obj._id + ',' + obj.ClubID + ',"' + obj.FullName + '","' + obj.Base64 + '","' + obj.TeamID + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.Position + '","' + obj.DeletedateUTC + '","' + obj.NickName + '","' + obj.Height + '","' + obj.Weight + '","' + obj.DOB + '","' + obj.BirthPlace + '","' + obj.SquadNo + '","' + obj.Nationality + '","' + obj.Honours + '","' + obj.Previous_Clubs + '","' + obj.memorable_match + '","' + obj.Favourite_player + '","' + obj.Toughest_Opponent + '","' + obj.Biggest_influence + '","' + obj.person_admire + '","' + obj.Best_goal_Scored + '","' + obj.Hobbies + '","' + obj.be_anyone_for_a_day + '")');
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobilevwApp_Base_Players SET ClubID= ' + obj.ClubID + ', FullName = "' + obj.FullName + '", Base64 = "' + obj.Base64 + '", TeamID = ' + obj.TeamID + ', UpdateSecondsUTC = "' + obj.UpdateSecondsUTC + '", UpdateSecondsUTCBase64 = "' + obj.UpdateSecondsUTCBase64 + '",Position = "' + obj.Position + '",DeletedateUTC = "' + obj.DeletedateUTC + '",NickName = "' + obj.NickName + '",Height = "' + obj.Height + '",Weight = "' + obj.Weight + '",DOB = "' + obj.DOB + '",BirthPlace = "' + obj.BirthPlace + '",SquadNo = "' + obj.SquadNo + '",Nationality = "' + obj.Nationality + '",Honours = "' + obj.Honours + '",Previous_Clubs = "' + obj.Previous_Clubs + '",memorable_match = "' + obj.memorable_match + '",Favourite_player = "' + obj.Favourite_player + '",Toughest_Opponent = "' + obj.Toughest_Opponent + '",Biggest_influence = "' + obj.Biggest_influence + '",person_admire = "' + obj.person_admire + '",Best_goal_Scored = "' + obj.Best_goal_Scored + '",Hobbies = "' + obj.Hobbies + '",be_anyone_for_a_day = "' + obj.be_anyone_for_a_day + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobilevwApp_Base_Players where ID =' + obj.ID);
                //   console.log('Delete MobilevwApp_Base_Players where ID');
            });
        }
    });

    $.each(obj.App_Players_Images, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE  INTO MobileApp_Players_Images(ID,_id,Base64,UpdateDateUTCBase64,UpdateSecondsUTCBase64,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.Base64 + '","' + obj.UpdateDateUTCBase64 + '","' + obj.UpdateSecondsUTCBase64 + '","' + obj.DeletedateUTC + '")');
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileApp_Players_Images SET Base64 = "' + obj.Base64 + '", UpdateDateUTCBase64 = "' + obj.UpdateDateUTCBase64 + '", UpdateSecondsUTCBase64 = "' + obj.UpdateSecondsUTCBase64 + '", DeletedateUTC = "' + obj.DeletedateUTC + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from MobileApp_Players_Images where ID =' + obj.ID);
            });
        }
    });

    $.each(obj.ScoringTable, function (idx, obj) {
        if (obj.DeletedateUTC == null) {
            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO  MobileScoringTable(ID,Name,Value,UpdatedateUTC,DeletedateUTC) VALUES (' + obj.ID + ',"' + obj.Name + '","' + obj.Value + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '")');
                //   console.log('INSERT OR IGNORE INTO  MobileScoringTable(ID,Name,Value,UpdatedateUTC,DeletedateUTC) VALUES (' + obj.ID + ',"' + obj.Name + '","' + obj.Value + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '")');
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE MobileScoringTable SET Name = "' + obj.Name + '", Value = "' + obj.Value + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
                db.transaction(function (tx) {
                    tx.executeSql('Delete from MobileScoringTable where ID =' + obj.ID);
                    console.log('Delete from MobileScoringTable where ID =' + obj.ID)
                })

        }

    });

    $.each(obj.Standings, function (idx, obj) {

        db.transaction(function (tx) {
            tx.executeSql('INSERT OR IGNORE  INTO MobileStandings(_id,Games,Won,Drawn,Lost,ForScore,AgainstScore,Difference,ClubID,Name,TournamentID,FlagPoints,UpdateDateUTC ,TournamentName,DeletedateUTC ) VALUES (' + obj._id + ',' + obj.Games + ',' + obj.Won + ',' + obj.Drawn + ',' + obj.Lost + ',' + obj.ForScore + ',' + obj.AgainstScore + ',' + obj.Difference + ',' + obj.ClubID + ',"' + obj.Name + '",' + obj.TournamentID + ',' + obj.FlagPoints + ',"' + obj.UpdateDateUTC + '","' + obj.TournamentName + '","' + obj.DeletedateUTC + '")');
       //     console.log("INSERT INTO MobileStandings is created");
        });

        db.transaction(function (tx) {
            var sql = 'UPDATE MobileStandings SET Games = ' + obj.Games + ', Won = ' + obj.Won + ', Drawn = ' + obj.Drawn + ', Lost = ' + obj.Lost + ', ForScore = ' + obj.ForScore + ', AgainstScore = ' + obj.AgainstScore + ', Difference = ' + obj.Difference + ', ClubID = ' + obj.ClubID + ', Name = "' + obj.Name + '", TournamentID = ' + obj.TournamentID + ', FlagPoints = ' + obj.FlagPoints + ', UpdateDateUTC = "' + obj.UpdateDateUTC + '", TournamentName = "' + obj.TournamentName + '", DeletedateUTC = "' + obj.DeletedateUTC + '" where _id = ' + obj._id;
            tx.executeSql(sql);
        });
    });

    $.each(obj.sponsorsclub, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO Mobilesponsorsclub(ID ,Datetime,Club,Name,Website,Image,UserID,OrderBy,Base64,CreatedateUTC,UpdatedateUTC ,DeletedateUTC ,UpdatedateUTCBase64  ) VALUES (' + obj.ID + ',"' + obj.Datetime + '",' + obj.Club + ',"' + obj.Name + '","' + obj.Website + '","' + obj.Image + '","' + obj.UserID + '",' + obj.OrderBy + ',"' + obj.Base64 + '","' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.UpdatedateUTCBase64 + '")');
                //   console.log("INSERT INTO Mobilesponsorsclub is created " + obj.DeletedateUTC);
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE Mobilesponsorsclub SET Datetime = "' + obj.Datetime + '", Club = ' + obj.Club + ', Name = "' + obj.Name + '", Website = "' + obj.Website + '", Image = "' + obj.Image + '", UserID = "' + obj.UserID + '", OrderBy = ' + obj.OrderBy + ', Base64 = "' + obj.Base64 + '", CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", UpdatedateUTCBase64 = "' + obj.UpdatedateUTCBase64 + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });
        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from Mobilesponsorsclub where ID =' + obj.ID);
                //   console.log('Delete Mobilesponsorsclub');
            });

        }


    });

    $.each(obj.screenimage, function (idx, obj) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO Mobilescreenimage(_id,Base64 ,BackgroundColor ,SoftwareFade ,UpdateDateUTC ,TopText ,BottomText ) VALUES ("' + obj._id + '","' + obj.Base64 + '","' + obj.BackgroundColor + '","' + obj.SoftwareFade + '","' + obj.UpdateDateUTC + '","' + obj.TopText + '","' + obj.BottomText + '")');
                //   console.log("INSERT INTO Mobilescreenimage is created");
            });

        db.transaction(function (tx) {
            var sql = 'UPDATE Mobilescreenimage SET Base64 = "' + obj.Base64 + '", BackgroundColor = "' + obj.BackgroundColor + '", SoftwareFade = "' + obj.SoftwareFade + '", UpdateDateUTC = "' + obj.UpdateDateUTC + '", TopText = "' + obj.TopText + '", BottomText = "' + obj.BottomText + '" where _id = ' + obj._id;
            tx.executeSql(sql);
        });
    });

    $.each(obj.scoringbreakdown, function (idx, obj) {
        if (obj.DeletedateUTC == null) {

            db.transaction(function (tx) {
                tx.executeSql('INSERT OR IGNORE INTO Mobilescoringbreakdown(ID,CreatedateUTC,UpdatedateUTC,DeletedateUTC,TeamID,GameID,PlayerID,ScoringID,Time) VALUES ("' + obj.ID + '","' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '",' + obj.TeamID + ',' + obj.GameID + ',' + obj.PlayerID + ',' + obj.ScoringID + ',"' + obj.Time + '")');
                //   console.log("INSERT INTO Mobilescoringbreakdown is created");
            });
            db.transaction(function (tx) {
                var sql = 'UPDATE Mobilescoringbreakdown SET CreatedateUTC = "' + obj.CreatedateUTC + '", UpdatedateUTC = "' + obj.UpdatedateUTC + '", DeletedateUTC = "' + obj.DeletedateUTC + '", TeamID = ' + obj.TeamID + ', GameID = ' + obj.GameID + ', PlayerID = ' + obj.PlayerID + ', ScoringID = ' + obj.ScoringID + ', Time = "' + obj.Time + '" where ID = ' + obj.ID;
                tx.executeSql(sql);
            });

        }else{
            db.transaction(function (tx) {
                tx.executeSql('Delete from Mobilescoringbreakdown where ID =' + obj.ID);
                //   console.log('Delete Mobilesscoringbreakdown');
            });

        }
    });

    var datenow1 = new Date();
    var timenow = datenow1.getTime();

    $.each(obj.Isadmin, function (idx, obj) {

        +
            db.transaction(function(tx) {
                tx.executeSql('Update MobileApp_LastUpdatesec set isadmin= ' + obj.Isadmin + ', Datesecs = "' + Math.round((timenow/1000)) + '",datemenus= "' + datenow1 + '"');
                //  console.log("Update INTO MobileApp_LastUpdatesec " + Math.round((timenow/1000)));
               // alert('Update MobileApp_LastUpdatesec set isadmin= ' + obj.Isadmin + ', Datesecs = "' + Math.round((timenow/1000)) + '",datemenus= "' + datenow1 + '"');
                closemodel();
               // alert(Math.round((timenow/1000)));
            });
    });



    $('#busy').hide();
}

function URLredirect(ID){


    window.open(ID, '_system');
}

function URLredirectFacebook(ID){


    window.open(ID, '_system','location=yes');
}

function gettoken1(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettoken1_success);
}

function gettoken1_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    apptoken = menu.token;

}

function sendtoast(ID){


    window.plugins.toast.showLongCenter(ID, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});

}


function sendnewfeed(){
    checkonlinefunctions();
    if(networkconnectionfun !=0) {
        db.transaction(gettoken1, errorCBfunc, successCBfunc);
        var title = $('#txttitle').val();
        var drescription = $('#txtDescription').val();

     passnewfeedtoserver("deviceid=" + deviceIDfunc + "&token=" + apptoken + "&title=" + title + "&drescription=" + drescription);

        alert("New Feed has been added!");

        onclicksyncloaddata();
    }else{

        alert("You don't have access to internet!");
    }

}

function cancelgamenow(ID){
    checkonlinefunctions();
    if(networkconnectionfun !=0) {
        db.transaction(gettoken1, errorCBfunc, successCBfunc);
       passcancelgametoserver("deviceid=" + deviceIDfunc + "&token=" + apptoken + "&gameid=" + ID);
      //  passcancelgametoserver("deviceid=a07883508d108e26&token=9d190637-2feb-4a26-ba72-9a158a220a2a&gameid=" + ID);




   onclicksyncloaddata();

    }else{

        alert("You don't have access to internet!");
    }

}


function halftimefulltimenow(GameID,outcome){
    checkonlinefunctions();
    if(networkconnectionfun !=0) {
        db.transaction(gettoken1, errorCBfunc, successCBfunc);

        passscoretoserver("gameid=" + GameID + "&outcome=" + outcome  + "&deviceid=" + deviceIDscorecard + "&token=" + apptoken)

        alert("Game has been Updated!");
    }else{
        alert("You don't have access to internet!");
    }

}

function CleanDB() {

    db.transaction(function (tx) {
        tx.executeSql('Delete from MobileApp_Results where DeletedateUTC != "null"');
        console.log('Clean MobileApp_Results where ID');
    });

    db.transaction(function(tx) {
        tx.executeSql('Delete from MobileApp_clubs where DeletedateUTC != "null"');
        console.log('Clean MobileApp_clubs where ID');
    });

    db.transaction(function(tx) {
        tx.executeSql('Delete from MobileApp_Schedule where DeletedateUTC != "null"');
        console.log('Clean MobileApp_Schedule where ID');
    });


    db.transaction(function(tx) {
        tx.executeSql('Delete from MobileApp_vwApp_Teams where DeletedateUTC != "null"');
        console.log('Clean MobileApp_vwApp_Teams where ID');
    });

    db.transaction(function(tx) {
        tx.executeSql('Delete from MobilevwApp_News_v_2 where DeletedateUTC != "null"');
        console.log('Clean MobilevwApp_News_v_2 where ID');
    });

    db.transaction(function(tx) {
        tx.executeSql('Delete from MobilevwApp_Base_Players where DeletedateUTC != "null"');
        console.log('Clean MobilevwApp_Base_Players where ID');
    });

    db.transaction(function(tx) {
        tx.executeSql('Delete from MobileApp_Players_Images where DeletedateUTC != "null"');
        console.log('Clean MobileApp_Players_Images where ID');
    });

    db.transaction(function(tx) {
        tx.executeSql('Delete from Mobilesponsorsclub where DeletedateUTC != "null"');
        console.log('Clean Mobilesponsorsclub');
    });



}
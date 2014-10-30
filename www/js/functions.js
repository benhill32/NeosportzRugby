document.addEventListener("deviceready", onDeviceReady, false);
db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
var deviceIDfunc;
var devicemodelfunc;
var deviceCordovafunc;
var devicePlatformfunc;
var deviceVersionfunc;
var databaseversion;
var appversion = -1;
var apptoken = 0;

function onDeviceReady() {
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
    console.log("Error processing SQL: "+err.message);
    //alert("Error processing SQL loaddata: "+err.code);
}

function successCBfunc() {
    //  alert("success!");
}

function passscoretoserver(testvar){

    var http = new XMLHttpRequest();
    var url = "http://centralfootball.neosportz.com/loaddatafromapp.aspx";
    var params = "?" + testvar;
   // alert(url + params);
    http.open("POST", url + params, true);

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            // alert(http.responseText);
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
    });



}

var randfunc = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

function updatemenutables(obj){

    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Results_Table_Menu ');
        console.log("MobileApp_Results_Table_Menu table is Dropped");
    });

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
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Results_Table_Menu (_id INTEGER NOT NULL, TournamentName TEXT NOT NULL, UpdateDateUTC TEXT NOT NULL,OrderID INTEGER NOT NULL)');
        console.log("MobileApp_Results_Table_Men table is created");
    });

    $.each(obj.vwApp_Results_Table_Men, function (idx, obj) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO MobileApp_Results_Table_Menu (_id, TournamentName,UpdateDateUTC ,OrderID ) VALUES (' + obj._id + ',"' + obj.TournamentName + '", "' + obj.UpdateDateUTC + '",' + obj.OrderID + ')');
            console.log("INSERT INTO MobileApp_Results_Table_Menu is created");
        });
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




    var datenow1 = new Date();
    var timenow = datenow1.getTime();


    $.each(obj.App_Results, function (idx, obj) {
        db.transaction(function (tx) {

            tx.executeSql('Delete from MobileApp_Results where ID =' + obj.ID);
            console.log('Delete MobileApp_Results where ID');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',"' + obj.DeletedateUTC + '" )');
            console.log('INSERT INTO MobileApp_Results(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ', ' + obj.HomeScore + ',' + obj.AwayScore + ' , "' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',"' + obj.DeletedateUTC + '" )');

        });

    });


    $.each(obj.clubs, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileApp_clubs where ID =' + obj.ID);
            console.log('Delete MobileApp_clubs where ID =' + obj.ID);
        });

        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileApp_clubs(ID,_id ,name,UpdateDateUTC,UpdateDateUTCBase64 ,Base64,History,Contacts,UpdateSecondsUTC,UpdateSecondsUTCBase64,Color,Fav,Follow,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.name + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.Base64 + '","' + obj.History + '","' + obj.Contacts + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '", "' + obj.Color + '",0,0,"' + obj.DeletedateUTC + '")');
            console.log('INSERT INTO MobileApp_clubs(ID,_id ,name,UpdateDateUTC,UpdateDateUTCBase64 ,Base64,History,Contacts,UpdateSecondsUTC,UpdateSecondsUTCBase64,Color,Fav,Follow,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.name + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.Base64 + '","' + obj.History + '","' + obj.Contacts + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '", "' + obj.Color + '",0,0,"' + obj.DeletedateUTC + '")');
        });
    });

    $.each(obj.App_Schedule, function (idx, obj) {
        db.transaction(function (tx) {

            tx.executeSql('Delete from MobileApp_Schedule where ID =' + obj.ID);
            console.log('Delete MobileApp_Schedule where ID');
        });
        db.transaction(function (tx) {

            tx.executeSql('INSERT INTO MobileApp_Schedule(ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,Cancel,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.DatetimeStart + '","' + obj.HomeName + '","' + obj.AwayName + '","' + obj.Field + '","' + obj.Latitude + '","' + obj.Longitude + '", ' + obj.DivisionID + ',"' + obj.DivisionName + '", ' + obj.HomeClubID + ', ' + obj.AwayClubID + ', ' + obj.HomeTeamID + ', ' + obj.AwayTeamID + ',"' + obj.UpdateDateUTC + '", "' + obj.TournamentName + '",' + obj.TournamentID + ', "' + obj.DatetimeStartSeconds + '",' + obj.DivisionOrderID + ',' + obj.ShowToAll + ',' + obj.Final + ',' + obj.Cancel + ',"' + obj.DeletedateUTC + '" )');
            console.log("INSERT INTO MobileApp_Schedule is created");
        });
    });


    $.each(obj.clubsimages, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileApp_clubsimages where ID =' + obj.ID);
            console.log('Delete MobileApp_clubsimages where ID');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileApp_clubsimages(ID,_id,UpdateDateUTCBase64,Base64,UpdateSecondsUTCBase64) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.UpdateDateUTCBase64 + '","' + obj.Base64 + '","' + obj.UpdateSecondsUTCBase64 + '")');
            console.log("INSERT INTO MobileApp_clubsimages is created");
        });

    });

    $.each(obj.vwApp_Teams, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileApp_vwApp_Teams where ID =' + obj.ID);
            console.log('Delete MobileApp_vwApp_Teams where ID');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileApp_vwApp_Teams(ID,_id,Name,Base64,ClubID,DivisionID,DivisionName,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,DeletedateUTC ) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.Name + '","' + obj.Base64 + '",' + obj.ClubID + ',' + obj.DivisionID + ',"' + obj.DivisionName + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.DeletedateUTC + '")');
            console.log("INSERT INTO MobileApp_vwApp_Teams is created");
        });
    });
//    window.plugins.toast.showShortCenter('Updating Tables!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});

    $.each(obj.vwApp_News_v_2, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobilevwApp_News_v_2 where ID =' + obj.ID);
            console.log('Delete MobilevwApp_News_v_2 where ID');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobilevwApp_News_v_2(ID,_id,UpdateDateUTC,Title,Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.UpdateDateUTC + '","' + obj.Title + '","' + obj.Body + '",' + obj.ClubID + ',"' + obj.TeamID + '","' + obj.Hide + '","' + obj.IsAd + '","' + obj.Base64 + '","' + obj.URL + '","' + obj.Hint + '","' + obj.DisplayDateUTC + '","' + obj.DisplaySecondsUTC + '","' + obj.DeletedateUTC + '")');
            console.log("INSERT INTO MobilevwApp_News_v_2 is created");
        });
    });

    $.each(obj.App_Players, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobilevwApp_Base_Players where ID =' + obj.ID);
            console.log('Delete MobilevwApp_Base_Players where ID');
        });
  db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobilevwApp_Base_Players(ID,_id,ClubID,FullName,Base64,TeamID,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,Position,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',' + obj.ClubID + ',"' + obj.FullName + '","' + obj.Base64 + '","' + obj.TeamID + '","' + obj.UpdateSecondsUTC + '","' + obj.UpdateSecondsUTCBase64 + '","' + obj.UpdateDateUTC + '","' + obj.UpdateDateUTCBase64 + '","' + obj.Position + '","' + obj.DeletedateUTC + '")');
            console.log("INSERT INTO MobilevwApp_Base_Players is created");
        });
    });

    $.each(obj.App_Players_Images, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileApp_Players_Images where ID =' + obj.ID);
            console.log('Delete MobileApp_Players_Images where ID');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileApp_Players_Images(ID,_id,Base64,UpdateDateUTCBase64,UpdateSecondsUTCBase64,DeletedateUTC) VALUES (' + obj.ID + ',' + obj._id + ',"' + obj.Base64 + '","' + obj.UpdateDateUTCBase64 + '","' + obj.UpdateSecondsUTCBase64 + '","' + obj.DeletedateUTC + '")');
            console.log("INSERT INTO MobileApp_Players_Images is created");
        });
    });

    $.each(obj.ScoringTable, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileScoringTable where Name =' + obj.Name);
            console.log('Delete MobileScoringTable');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileScoringTable(Name,Value,UpdatedateUTC) VALUES ("' + obj.Name + '","' + obj.Value + '","' + obj.UpdatedateUTC + '")');
            console.log("INSERT INTO MobileScoringTable is created");
        });
    });

    db.transaction(function (tx) {
        tx.executeSql('Delete from MobileStandings');
        console.log('Delete MobileStandings');
    });

    $.each(obj.Standings, function (idx, obj) {

        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO MobileStandings(_id,Games,Won,Drawn,Lost,ForScore,AgainstScore,Difference,ClubID,Name,TournamentID,FlagPoints,UpdateDateUTC ,TournamentName,DeletedateUTC ) VALUES (' + obj._id + ',' + obj.Games + ',' + obj.Won + ',' + obj.Drawn + ',' + obj.Lost + ',' + obj.ForScore + ',' + obj.AgainstScore + ',' + obj.Difference + ',' + obj.ClubID + ',"' + obj.Name + '",' + obj.TournamentID + ',' + obj.FlagPoints + ',"' + obj.UpdateDateUTC + '","' + obj.TournamentName + '","' + obj.DeletedateUTC + '")');
            console.log("INSERT INTO MobileStandings is created");
        });
    });

    $.each(obj.sponsorsclub, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from Mobilesponsorsclub where ID =' + obj.ID);
            console.log('Delete Mobilesponsorsclub');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Mobilesponsorsclub(ID ,Datetime,Club,Name,Website,Image,UserID,OrderBy,Base64,CreatedateUTC,UpdatedateUTC ,DeletedateUTC ,UpdatedateUTCBase64  ) VALUES (' + obj.ID + ',"' + obj.Datetime + '",' + obj.Club + ',"' + obj.Name + '","' + obj.Website + '","' + obj.Image + '","' + obj.UserID + '",' + obj.OrderBy + ',"' + obj.Base64 + '","' + obj.CreatedateUTC + '","' + obj.UpdatedateUTC + '","' + obj.DeletedateUTC + '","' + obj.UpdatedateUTCBase64 + '")');
            console.log("INSERT INTO Mobilesponsorsclub is created " + obj.DeletedateUTC);
        });
    });

    $.each(obj.screenimage, function (idx, obj) {
        db.transaction(function (tx) {
            tx.executeSql('Delete from Mobilescreenimage where _id =' + obj._id);
            console.log('Delete Mobilescreenimage');
        });
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Mobilescreenimage(_id,Base64 ,BackgroundColor ,SoftwareFade ,UpdateDateUTC ,TopText ,BottomText ) VALUES ("' + obj._id + '","' + obj.Base64 + '","' + obj.BackgroundColor + '","' + obj.SoftwareFade + '","' + obj.UpdateDateUTC + '","' + obj.TopText + '","' + obj.BottomText + '")');
            console.log("INSERT INTO Mobilescreenimage is created");
        });
    });


    $.each(obj.Isadmin, function (idx, obj) {

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set isadmin= ' + obj.Isadmin + ', Datesecs = "' + Math.round((timenow/1000)) + '",datemenus= "' + datenow1 + '"');
            console.log("Update INTO MobileApp_LastUpdatesec " + Math.round((timenow/1000)));

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
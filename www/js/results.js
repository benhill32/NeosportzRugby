var db;
var dbCreated = false;
var id = getUrlVars()["id"];
var clubidtop =0;


var gameid = 0;
var homeid = 0;
var awayid = 0;
var devicePlatformresult =0;
var resultID = 0;
document.addEventListener("deviceready", onDeviceReadyresult, false);

function onDeviceReadyresult() {
    devicePlatformresult = device.platform;
   // db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
  //  console.log("LOCALDB - Database ready");
    db.transaction(getfliterresult, errorCBfunc, successCBfunc);
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
    db.transaction(getfliterresult, errorCBfunc, successCBfunc);

}

function getfliterresult(tx) {
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


    db.transaction(getdatanewsresult, errorCBfunc, successCBfunc);
}

function getdatanewsresult(tx) {
    var sql = "select ID from MobileApp_clubs where Fav = 1";
    // alert(sql);
    tx.executeSql(sql, [], getdatanewsresult_success);
}


function getdatanewsresult_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    clubidtop = 0;

    if(len != 0) {
        var menu = results.rows.item(0);
        clubidtop = menu.ID;

    }

    db.transaction(getdata2result, errorCBfunc, successCBfunc);
}


function getdata2result(tx) {
    var sql = "select ID from MobileApp_clubs where Follow = 1";
    //alert(sql);
    tx.executeSql(sql, [], getdata2result_success);
}

function getdata2result_success(tx, results) {
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

    db.transaction(getdataresult, errorCBfunc, successCBfunc);

}

function getdataresult(tx) {
    var sql = "";

    var d = new Date();
    var secondsnow  = (d.getTime())/1000;

    var month = d.getMonth();
    var year = d.getFullYear();
    var day = d.getDate();

    var midnight = new Date(Date.UTC(year,month,day,"23","59","59","01"));
    var midnightsec = Math.round(((midnight.getTime())/1000));


    if(fliter == 0){

        $('#btn1').removeClass("btn btn-xs btn-primary active");
        $('#btn1').addClass("btn btn-xs btn-default");
        $('#btn2').removeClass("btn btn-xs btn-default");
        $('#btn2').addClass("btn btn-xs btn-primary active");
        sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,halftime,fulltime,RefName,DefaultHome,DefaultAway from MobileApp_Results where TournamentID = '" + id + "' and DatetimeStartSeconds <= " + midnightsec + " and DeletedateUTC = 'null'  order by DatetimeStart DESC";

    }else{
        $('#btn2').removeClass("btn btn-xs btn-primary active");
        $('#btn2').addClass("btn btn-xs btn-default");
        $('#btn1').removeClass("btn btn-xs btn-default");
        $('#btn1').addClass("btn btn-xs btn-primary active");
        sql = "select ID,_id,DatetimeStart,HomeName,AwayName,Field,Latitude,Longitude,DivisionID ,DivisionName,HomeClubID,AwayClubID,HomeTeamID,AwayTeamID,HomeScore ,AwayScore ,UpdateDateUTC ,TournamentName,TournamentID ,DatetimeStartSeconds ,DivisionOrderID,ShowToAll,Final,halftime,fulltime,RefName,DefaultHome,DefaultAway from MobileApp_Results where (HomeClubID IN (" + listfollow + ") or AwayClubID IN (" + listfollow + ")) and DatetimeStartSeconds <= " + midnightsec + " and TournamentID = '" + id + "'  and DeletedateUTC = 'null' order by DatetimeStart DESC";

    }


   // alert(sql);
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

        var timesplit = res[1].split(":")
        var h = timesplit[0];
        var m = timesplit[1];

        var ampm = h > 12 ? h-12 + ':' + m + 'PM' : h + ':' + m +'AM';
        var action = '';

        if(menu.halftime != 'null' && menu.fulltime != 'null') {
              action = "Fulltime";
        }else  if(menu.halftime != 'null' && menu.fulltime == 'null') {
                action = "Halftime";
        }else  if(menu.halftime == 'null' && menu.fulltime == 'null') {
            action = "";
        }
        var socialIOS = menu.DatetimeStart +  "||" + menu.HomeName + ' vs ' + menu.AwayName +  "||" + menu.TournamentName + "||" + menu.Field;

        var readmore = menu.ID + "||" + menu.HomeName +  "||" + menu.AwayName +  "||" + menu.HomeScore +  "||" + menu.AwayScore +  "||" + menu.HomeTeamID +  "||" + menu.AwayTeamID;

        var date2 = new Date(menu.DatetimeStart);
       // alert(date2);
        if(menu.DefaultHome == 0 && menu.DefaultAway ==0 ) {
            $('#divresults').append('<div class="panel panel-default" data-toggle="modal" data-target="#basicModalresults" onclick="resultshowmore(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\',' + menu.HomeScore + ',' + menu.AwayScore + ',' + menu.HomeTeamID + ',' + menu.AwayTeamID + ')"   >' +

                '<div class="panel-heading">' +
                '<div class="row">' +
                '<div class="col-xs-8 col-md-8"  align="left">' + menu.HomeName + ' vs ' + menu.AwayName  + '</div>' +
                '<div class="col-xs-4 col-md-4" onclick="resultssharemore(event,\'' + readmore + '\')"><img height="30px" class="imagesch"  align="right" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + menu.HomeScore + ' - ' + menu.AwayScore + '  ' + action + '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + menu.TournamentName + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + ampm + '  ' + day + '/' +  month + '/' + year + '</div>' +
                '</div>' +

                '</div>' +
                '</div>' +
                '</div>');


           // '<div class="size11 blue" style="text-align: center!important;">' +
          //  '<div style="float:left;">More</div>' +
          //  '<div  style="float:right;padding-left:100px;padding-right: 100px;" onclick="resultssharemore(event)">Share</div>' +
          //  '</div>' +
        }
        else if(menu.DefaultHome == 1 && menu.DefaultAway ==0 )
        {
            $('#divresults').append('<div class="panel panel-warning" data-toggle="modal" data-target="#basicModalresults" onclick="resultshowmore(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\',' + menu.HomeScore + ',' + menu.AwayScore + ',' + menu.HomeTeamID + ',' + menu.AwayTeamID + ')"   >' +

                '<div class="panel-heading">' +
                '<div class="row">' +
                '<div class="col-xs-8 col-md-8"  align="left">' + menu.HomeName + ' vs ' + menu.AwayName  + '</div>' +
                '<div class="col-xs-4 col-md-4" onclick="resultssharemore(event,\'' + readmore + '\')"><img height="30px" class="imagesch"  align="right" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">WBD - LBD  ' + action + '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + menu.TournamentName + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + ampm + '  ' + day + '/' +  month + '/' + year + '</div>' +
                '</div>' +

                '</div>' +
                '</div>' +
                '</div>');
        }
        else if(menu.DefaultHome == 0 && menu.DefaultAway ==1 )
        {
            $('#divresults').append('<div class="panel panel-warning" data-toggle="modal" data-target="#basicModalresults" onclick="resultshowmore(' + menu.ID + ',\'' + menu.HomeName + '\',\'' + menu.AwayName + '\',' + menu.HomeScore + ',' + menu.AwayScore + ',' + menu.HomeTeamID + ',' + menu.AwayTeamID + ')"   >' +

                '<div class="panel-heading">' +
                '<div class="row">' +
                '<div class="col-xs-8 col-md-8"  align="left">' + menu.HomeName + ' vs ' + menu.AwayName  + '</div>' +
                '<div class="col-xs-4 col-md-4" onclick="resultssharemore(event,\'' + readmore + '\')"><img height="30px" class="imagesch"  align="right" ></div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">LBD - WBD  ' + action + '</div>' +
                '</div>' +

                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + menu.TournamentName + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-xs-12 col-md-12 size11"   align="left">' + ampm + '  ' + day + '/' +  month + '/' + year + '</div>' +
                '</div>' +

                '</div>' +
                '</div>' +
                '</div>');

        }



    }

    $('#divcircle').show();
    $('#divcircle').click(function() {
        sendinfotoserver("results",id,"0")


    });
}

function resultssharemore(e,ID) {

    resultID = ID;
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation){
        e.stopPropagation();
        $('#basicModalshare').modal('show');
    }

}


function shareresults(){
    if (devicePlatformresult == "Android") {

        getsocialAndroid();
    }else{
        loadsocialIOSresult();
    }

}




function getsocialAndroid() {

    // window.plugins.socialsharing.share('Message and subject', 'The subject')

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



function saveImageToPhoneresult(url, success, error) {
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


function loadsocialIOSresult() {
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

                saveImageToPhoneresult(res.filePath, MEsuccess, MEerror);
            }
        },'jpg',50);




    }, 500);

}



function resultshowmore(ID,hometeam,awayteam,homescore,awayscore,homeidd,awayidd){

   // alert(ID + " - " + hometeam + " - " +awayteam+ " - " +homescore+ " - " +awayscore+ " - " +homeidd+ " - " +awayidd);
    gameid =ID;
    homeid = homeidd;
    awayid = awayidd;
    $('#resulthometeam').empty().append(hometeam);
    $('#resultawayteam').empty().append(awayteam);
    $('#resultscore').empty().append(homescore + '-' + awayscore);

    db.transaction(getgoals, errorCBfunc, successCBfunc);

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
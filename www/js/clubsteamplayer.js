var db;
var teamID = getUrlVars()["teamID"];
var favtop  = 0;
var followtop =0;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
   // db.transaction(getMenu, errorCBfunc, successCBfunc);
    db.transaction(getdata, errorCBfunc, successCBfunc);
}

//db.transaction(getdata, errorCBfunc, successCBfunc);


function getdata(tx) {
    var sql = "select ID,_id,ClubID,FullName,Base64,TeamID,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,Position from MobilevwApp_Base_Players where DeletedateUTC = 'null' and TeamID=" + teamID;
   // alert(sql);
    tx.executeSql(sql, [], getteamplayer_success);
}



function getteamplayer_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
        if(menu.Base64 != "null"){
            imgg = '<img src="data:image/png;base64,' + menu.Base64 + '" style="margin-top: -10px;margin-right: 15px;"  align="left" height="80" >';
        }

        $('#teamsdiv').append('<Div class="mainmenuplayers" align="left" onclick="redirectplayer(' + menu.ID + ')" >' +
            '<div >' + imgg +
            '</div>' +
            '<div class="bold size13"  >' +  menu.FullName + '</div><div class="size11"  >' + menu.Position + '</div>' +

            '</Div>');


    }

}

function redirectplayer(ID){

    window.location = "../pages/clubteamplayers.html?ClubID=" + id + "&teamID=" + ID;
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
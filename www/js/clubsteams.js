var db;
var id = getUrlVars()["ID"];
var favtop  = 0;
var followtop =0;


db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
console.log("LOCALDB - Database ready");
db.transaction(getdata, errorCBfunc, successCBfunc);

db.transaction(getimgfav, errorCBfunc, successCBfunc);



function getdata(tx) {
    var sql = "select ID ,_id,Base64 ,ClubID ,DivisionID,DivisionName,UpdateDateUTC from MobileApp_vwApp_Teams where ClubID=" + id;
   // alert(sql);
    tx.executeSql(sql, [], getteam_success);
}
function getimgfav(tx) {
    var sql = "select Fav,Follow from MobileApp_clubs where ID=" + id;
  //  alert(sql);
    tx.executeSql(sql, [], getimgfav_success);
}

function getimgfav_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

var img = "";
        var menu = results.rows.item(0);
    favtop = menu.Fav;
       followtop = menu.Follow;

    if(favtop == 0 && followtop ==0){
        $("#imgfavfollow").attr("src","../img/emptystar.png");
    }else if(favtop == 1 && followtop ==0){
        $("#imgfavfollow").attr("src","../img/fullstar.png");
    }else if(favtop == 0 && followtop ==1){
        $("#imgfavfollow").attr("src","../img/halfstar.png");
    }
    $("#imgfavfollow").click(updatefollow);
}

function updatefollow(){
    $("#imgfavfollow").attr('onclick','').unbind('click');
    if(favtop == 0 && followtop ==0){


    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_clubs set Fav = 0,Follow= 1 where ID=' + id);
        console.log("Update INTO MobileApp_clubs");
    });


        favtop = 0;
        followtop = 1;
    }else if(favtop == 1 && followtop ==0){
        clearcurrentfavteam(id)

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0');
            console.log("Update MobileApp_LastUpdatesec");
        });

        favtop = 0;
        followtop = 0;
    }else if(favtop == 0 && followtop ==1){
        addfavteam(id);
        //force only one fav
        clearotherfavteam(id)

        addfavclub();

        favtop = 1;
        followtop = 0;
    }

    db.transaction(getimgfav, errorCBfunc, successCBfunc);

}

function getteam_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
        if(menu.Base64 != "null"){
            imgg = '<img src="data:image/png;base64,' + menu.Base64 + '" style="margin-top: -10px;"  align="middle" height="80" >';
        }
       // alert(menu.DivisionName);
        $('#teamsdiv').append('<Div class="mainmenuteam" align="middle" onclick="redirectplayer(' + menu.ID + ')" >' +
            '<div style="float: left;"  >' + imgg +
            '</div>' +

            '<div class="bold size13" style="padding-top: 20px;"  >' + menu.DivisionName +
           '</div>' +
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
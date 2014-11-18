var db;
var teamID = getUrlVars()["teamID"];
var favtop  = 0;
var followtop =0;
var IDPlayer =0;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
 //   db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
   // db.transaction(getMenu, errorCBfunc, successCBfunc);
    db.transaction(getdata, errorCBfunc, successCBfunc);
}

//db.transaction(getdata, errorCBfunc, successCBfunc);


function getdata(tx) {
    var sql = "select ID,_id,ClubID,FullName,Base64,TeamID,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,Position,DeletedateUTC,NickName,Height,Weight ,DOB ,BirthPlace,SquadNo,Nationality ,Honours ,Previous_Clubs,memorable_match,Favourite_player ,Toughest_Opponent,Biggest_influence ,person_admire ,Best_goal_Scored ,Hobbies ,be_anyone_for_a_day from MobilevwApp_Base_Players where DeletedateUTC = 'null' and TeamID=" + teamID;
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
            imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  align="left" height="80" >';
        }else{

            imgg = '<img src="../img/nobase64_2.png"  align="left" height="80" >';
        }

        $('#teamsdiv').append('<Div class="mainmenuplayers" align="left"   data-toggle="modal" data-target="#basicModalplayer" onclick="loadplayerinfo(' + menu.ID + ')" >' +
            '<div style="width: 40%; height: 80px; float: left;" align="center"  >' + imgg +
            '</div>' +
            '<div style="width: 60%; height: 80px; float: left;">' +
            '<div class=" size11"  >Name: ' +  menu.FullName + '</div>' +
            '<div class="size11"  >Nickname: ' + menu.NickName + '</div>' +
            '<div class="size11"  >Height: ' + menu.Height + '</div>' +
            '<div class="size11"  >Weight: ' + menu.Weight + '</div>' +
            '<div class="size11"  >Postion: ' + menu.Position + '</div>' +
            '<div class="size11 blue">Read More</div>' +
            '</div>' +
            '</Div>');


    }

}


function loadplayerinfo(ID) {
    IDPlayer = ID;
    // $('body').css('position','fixed');
    db.transaction(loadplayerinfo2, errorCBfunc, successCBfunc);
}






function loadplayerinfo2(tx) {

    var sql = "select ID,_id,ClubID,FullName,Base64,TeamID,UpdateSecondsUTC,UpdateSecondsUTCBase64,UpdateDateUTC,UpdateDateUTCBase64,Position,DeletedateUTC,NickName,Height,Weight ,DOB ,BirthPlace,SquadNo,Nationality ,Honours,Previous_Clubs,memorable_match,Favourite_player ,Toughest_Opponent,Biggest_influence ,person_admire ,Best_goal_Scored ,Hobbies ,be_anyone_for_a_day from MobilevwApp_Base_Players where ID=" + IDPlayer;
    // alert(sql);
    tx.executeSql(sql, [], loadplayerinfo2_success);
}

function loadplayerinfo2_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    var menu = results.rows.item(0);
    $('#imgplayer').empty();
    $('#playerinfodiv').empty();
    if(menu.Base64 != "null"){
        $('#imgplayer').attr("src","data:image/png;base64," + menu.Base64);

    }else{
        $('#imgplayer').attr("src","../img/nobase64_2.png");

    }

    var res = (menu.DOB).split("T");
    var split = res[0].split("-");
    var month = split[1];
    var year = split[0];
    var day = split[2];


    $('#playerinfodiv').append('<div class=" size11  bold padding2"  >Name:</div> <div class="size11 padding2"  > ' +  menu.FullName + '</div>' +
    '<div class="size11 bold padding2 "  >Nickname:</div> <div class="size11 padding2"  >' + menu.NickName + '</div>' +
    '<div class="size11 bold padding2"  >Height:</div> <div class="size11 padding2"  > ' + menu.Height + '</div>' +
    '<div class="size11 bold padding2"  >Weight:</div> <div class="size11 padding2"  > ' + menu.Weight + '</div>' +
    '<div class="size11 bold padding2"  >Postion:</div> <div class="size11 padding2"  > ' + menu.Position + '</div>' +
    '<div class="size11 bold padding2"  >DOB:</div> <div class="size11 padding2"  > ' + day + "/" + month + "/" + year + '</div>' +
    '<div class="size11 bold padding2"  >BirthPlace:</div> <div class="size11 padding2"  > ' + menu.BirthPlace + '</div>' +
    '<div class="size11 bold padding2"  >Weight:</div> <div class="size11 padding2"  > ' + menu.Weight + '</div>' +
    '<div class="size11 bold padding2"  >Playing Number:</div> <div class="size11 padding2"  > ' + menu.SquadNo + '</div>' +
    '<div class="size11 bold padding2"  >Nationality:</div> <div class="size11 padding2"  > ' + menu.Nationality + '</div>' +
    '<div class="size11 bold padding2"  >Honours:</div> <div class="size11 padding2"  > ' + menu.Honours + '</div>' +
    '<div class="size11 bold padding2"  >Previous Clubs:</div> <div class="size11 padding2"  > ' + menu.Previous_Clubs + '</div>' +
    '<div class="size11 bold padding2"  >Most memorable match played in?:</div> <div class="size11 padding2"  > ' + menu.memorable_match + '</div>' +
    '<div class="size11 bold padding2"  >Favourite players:</div> <div class="size11 padding2"  > ' + menu.Favourite_player + '</div>' +
    '<div class="size11 bold padding2"  >Toughest opponents faced?:</div> <div class="size11 padding2"  > ' + menu.Toughest_Opponent + '</div>' +
    '<div class="size11 bold padding2"  >Biggest influence of your career?:</div> <div class="size11 padding2"  > ' + menu.Biggest_influence + '</div>' +
    '<div class="size11 bold padding2"  >Sports person you most admire?:</div> <div class="size11 padding2"  > ' + menu.person_admire + '</div>' +
    '<div class="size11 bold padding2"  >Best goal scored:</div> <div class="size11 padding2"  > ' + menu.Best_goal_Scored + '</div>' +
    '<div class="size11 bold padding2"  >Hobbies?:</div> <div class="size11 padding2"  > ' + menu.Hobbies + '</div>' +
    '<div class="size11 bold padding2"  >If you could be anyone for a day?:</div> <div class="size11 padding2"  > ' + menu.be_anyone_for_a_day + '</div>' +

    '');





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
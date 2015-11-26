var db;
var clubidtop= 0;
var IDNews = 0;
var IDhist = 0;
var IDcon = 0;
var spon= 1;
var spon2= 1;
var facebookchk= 0;
var sponsorexist = 0;
var ii = 0;
var nospor = 0;
var socialurl = "";
var firstnews = 0;
var lastnews = 0;
var newsid = 0;
var checkfornew= 0;
document.addEventListener("deviceready", onDeviceReadynews, false);

function onDeviceReadynews() {

    console.log("LOCALDB - Database ready");
    $.mobile.loading().hide();
    db.transaction(getfirstnew, errorCBfunc, successCBfunc);
}




function getfirstnew(tx) {

    var sql = "select ID from MobilevwApp_News_v_2 WHERE DeletedateUTC = 'null' ORDER BY ID Desc LIMIT 1";
    //   alert(sql);
    tx.executeSql(sql, [], getfirstnew_success);
}


function getfirstnew_success(tx, results) {

    var len = results.rows.length;

    alert(len + " - " + window.localStorage.getItem("checkfornew"));

if(len == 0 && window.localStorage.getItem("checkfornew") == null){

    window.localStorage.setItem("checkfornew", 1);

    sendinfotoserver("newsfeed2","0",window.localStorage.getItem("teamfollow"),0,0);



}else{
    var menu = results.rows.item(0);
    firstnews = menu.ID;

alert(firstnews);
    db.transaction(getlastnews, errorCBfunc, successCBfunc);

}



}


function getlastnews(tx) {

    var sql = "select ID from MobilevwApp_News_v_2 WHERE DeletedateUTC = 'null' ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getlastnews_success);
}


function getlastnews_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);


    lastnews = menu.ID;
    alert(lastnews);
    db.transaction(getdata2, errorCBfunc, successCBfunc);

}





function loadnewdata(){

    refreshdata();
    $('#newsmain').empty();
    spon = 1;
    spon2 =1 ;
    db.transaction(getdatanews, errorCBfunc, successCBfunc);
}







function numbersponsers(tx) {
    var sql = "select ID  from Mobilesponsorsclub where Club=" + clubidtop + " and DeletedateUTC = 'null'";
    // alert(sql);
    tx.executeSql(sql, [], numbersponsers_success);
}

function numbersponsers_success(tx, results) {
    var len = results.rows.length;

    nospor = len;
    // alert(nospor);

}

function getdata2(tx) {
    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' order by ID Desc Limit 1";
//alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}

function getnewfeed_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
alert(len);
    $('#newsmain').empty();

    if(len!= 0) {

            var menu = results.rows.item(0);
            var imgg = "";
            // alert(menu.Body.substring(0, 200));
        newsid = menu.ID;
        $('#divNonews').hide();
            $('#divyesnews').show();
            $('#divtitle').empty();
            $('#divbody').empty();

            $('#divtitle').append(menu.ID + " - " + menu.Title);
            $('#divbody').append(menu.Body);

        if (menu.URL == "") {
            $('#divlinks').hide();
        }else{
            $('#divlinks').show();
            $('#divlinks').empty();
            $('#divlinks').append('<li class="list-group-item" onclick="URLredirect(\'' + menu.URL + '\')" >Website Link</li>');

        }


    }else{


        $('#divyesnews').hide();
        $('#divNonews').show();

    }
}

function loadsocialnews(e,ID){
    socialurl = ID;

    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation){
        e.stopPropagation();
        $('#basicModalshare').modal('show');

    }
 //   alert(socialurl);
}

function sharenews(){


        window.plugins.socialsharing.share('Neosportz', null, null, socialurl);



}


function redirectplayer(ID){

    window.open(ID);
}

function redirectplayersystem(ID){

    window.open(ID, '_system');
}

function getsponsors(tx) {
    var sql = "select ID ,Datetime,Club,Name,Website,Image,UserID,OrderBy,Base64,CreatedateUTC,UpdatedateUTC ,DeletedateUTC ,UpdatedateUTCBase64   from Mobilesponsorsclub where Club=" + clubidtop + " and DeletedateUTC == 'null' Order by OrderBy";
    // alert(sql);
    tx.executeSql(sql, [], getsponsors_success);
}

function getsponsors_success(tx, results) {

    var len = results.rows.length;
    //alert(len);
    var count = 1;





    for (var i=0; i<len; i++) {

        if (len != 0) {
            var menu = results.rows.item(i);

            if (menu.Base64 != "null") {
                imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  height="80" >';
            }
            //   alert(menu.Name);

            $('#spondiv' + count).append('<Div  align="center" onclick="URLredirect(\'' + menu.Website + '\')" >' + imgg + '</div>');

            count++;
        }
    }
}

function loadnewfeed(ID) {
    IDNews = ID;
    // $('body').css('position','fixed');
    db.transaction(loadnewfeed2, errorCBfunc, successCBfunc);
}

function loadnewfeedreadmore(e,ID) {
    IDNews = ID;

    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation){
        e.stopPropagation();
        $('#basicModalnews').modal('show');
    }

    // $('body').css('position','fixed');
    db.transaction(loadnewfeed2, errorCBfunc, successCBfunc);
}



function loadnewfeed2(tx) {

    var sql = "select Title,replace(Body, '###$$###', '<br>') as Body from MobilevwApp_News_v_2 where ID=" + IDNews;
    // alert(sql);
    tx.executeSql(sql, [], loadnewfeed_success);
}

function loadnewfeed_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    var menu = results.rows.item(0);






    $('#newtitle').empty();
    $('#newtitle').append( '<div>' + menu.Title + '</div>');

    $('#modelnews').empty();
    $('#modelnews').append( '<div>' + menu.Body + '</div>');

}

function choosefacteam(ID){

    clearfavteam();

    addfavteam(ID);


    var daaa = new Date();
    var naaa = daaa.getTime();

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 1, hasclubdate = "' + naaa + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });

    db.transaction(getdatanews, errorCBfunc, successCBfunc);
}

function getclubsfav(tx) {
    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,History,Contacts,UpdateSecondsUTC,Color from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getclubsfav_success);
}


function getclubsfav_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";


        $('#clubfav').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="choosefacteam('+ menu.ID + ')"  >' +
            '<div class="bold size13"   >' + menu.name  +
            '</div>' +
            '</Div>');
    }

}

function showclubsfun(){

    db.transaction(getclubsfav, errorCBfunc, successCBfunc);
    $('#basicModalteams').modal('show');

}

function getnextnewfeed(){


    if (lastnews == newsid) {
        db.transaction(getdataplus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataplus, errorCBfunc, successCBfunc);
    }

}

function getpervoiusnewfeed(){

    if (firstnews == newsid) {
        db.transaction(getdataminus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataminus, errorCBfunc, successCBfunc);
    }
}

function getdataminus(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and ID > " + newsid + " and DeletedateUTC = 'null' order by ID ASC LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}

function getdataminus2(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' order by ID ASC LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}

function getdataplus(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and ID < " + newsid + " and DeletedateUTC = 'null' order by ID Desc LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}
function getdataplus2(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' order by ID Desc LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}
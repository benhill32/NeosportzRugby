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
var allnews  = 0;
var intcount = 1;
var networkconnectionnew =0;
document.addEventListener("deviceready", onDeviceReadynews, false);


function onDeviceReadynews() {
    checkonlinenews();

    $.mobile.loading().hide();

    $('#btndatenews').empty();

    if( window.localStorage.getItem("teamfollow") != 0) {

        if( window.localStorage.getItem("teamnewfeed") !=0) {
         //               $('#loadinggears').show();

            window.plugins.spinnerDialog.show(null, null, true);
            window.localStorage.setItem("newfeesactive", 0);
            db.transaction(numbersponsers, errorCBfunc, successCBfunc);

            db.transaction(getfirstnew, errorCBfunc, successCBfunc);

        }else{
            $('#divNonewfeed').show();
            $('#divyesnews').hide();
            $('#divNonews').hide();
            $('#loadinggears').hide();
            window.plugins.spinnerDialog.hide();
            $('#divNoclub').hide();

            $('#btndatenews').append("New Feed Disabled");
            window.localStorage.setItem("newfeesactive", 1);

        }


    }else{
        $('#divNoclub').show();
        $('#divyesnews').hide();
        $('#divNonews').hide();
        $('#loadinggears').hide();
        window.plugins.spinnerDialog.hide();
        $('#btndatenews').append("No Favourite Club");
        window.localStorage.setItem("newfeesactive", 1);
    }
}


function checkonlinenews(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconnectionnew = states[networkState];
//alert(states[networkState]);

}




function numbersponsers(tx) {
    var sql = "select * from Mobilesponsorsclub where Club=" + window.localStorage.getItem("teamfollow");
     //alert(sql);
    tx.executeSql(sql, [], numbersponsers_success);
}

function numbersponsers_success(tx, results) {
    var len = results.rows.length;
   // alert(len);

    var random = Math.floor((Math.random() * len) + 1);
    var menu = results.rows.item(random-1);

    var check = is_cached('http://rugby.neosportz.com/Sponsors/Clubs/' +  window.localStorage.getItem("teamfollow") + '/' + menu.Base64);




    if(len != 0) {

        if(networkconnectionnew !=0) {



            if (menu.Website == "") {
                $('#divsponsormodel').empty().append('<img class="img-responsive" src="http://rugby.neosportz.com/Sponsors/Clubs/' + window.localStorage.getItem("teamfollow") + '/' + menu.Base64 + '">')
            } else {
                var website2 = "http://" + menu.Website;
                // alert(website2);
                $('#divsponsormodel').empty().append('<div onclick="URLredirect(\'' + website2 + '\')"><img  class="img-responsive" src="http://rugby.neosportz.com/Sponsors/Clubs/' + window.localStorage.getItem("teamfollow") + '/' + menu.Base64 + '"></div>')
            }

            // alert("http://rugby.neosportz.com/Sponsors/Clubs/" +  window.localStorage.getItem("teamfollow")  + "/" + menu.Base64)


            $('#Modalsponsor').modal('show')

        }else{

            if(check == true) {


                if (menu.Website == "") {
                    $('#divsponsormodel').empty().append('<img class="img-responsive" src="http://rugby.neosportz.com/Sponsors/Clubs/' + window.localStorage.getItem("teamfollow") + '/' + menu.Base64 + '">')
                } else {
                    var website2 = "http://" + menu.Website;
                    // alert(website2);
                    $('#divsponsormodel').empty().append('<div onclick="URLredirect(\'' + website2 + '\')"><img  class="img-responsive" src="http://rugby.neosportz.com/Sponsors/Clubs/' + window.localStorage.getItem("teamfollow") + '/' + menu.Base64 + '"></div>')
                }

                // alert("http://rugby.neosportz.com/Sponsors/Clubs/" +  window.localStorage.getItem("teamfollow")  + "/" + menu.Base64)


                $('#Modalsponsor').modal('show')
            }
        }

    }
    $('#loadinggears').hide();
    window.plugins.spinnerDialog.hide();
}




function getfirstnew(tx) {

    var sql = "select ID from MobilevwApp_News_v_2 WHERE  ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' ORDER BY ID Desc";
    //   alert(sql);
    tx.executeSql(sql, [], getfirstnew_success);
}


function getfirstnew_success(tx, results) {

        var len = results.rows.length;



if(len == 0){
        sendinfotoserver("newsfeed2","0",window.localStorage.getItem("teamfollow"),0,0);

}else{

       var menu = results.rows.item(0);
    firstnews = menu.ID;


 //   alert(firstnews);

}

    db.transaction(getlastnews, errorCBfunc, successCBfunc);

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
//   alert(lastnews);

    db.transaction(getdata2, errorCBfunc, successCBfunc);
}



function getfulldaynew(day){

    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    return weekday[day];

}




function getdata2(tx) {
    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '<br>') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' order by ID Desc Limit 1";
//alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}

function getnewfeed_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#newsmain').empty();
    $('#divNoclub').hide();
    $('#btndatenews').empty();

    if(len!= 0) {

        var menu = results.rows.item(0);

        var bbb = new Date(menu.DisplayDateUTC)

        var tzDifference = bbb.getTimezoneOffset();

        var newdate = new Date(bbb.getTime() + (tzDifference * 60000))

        var day = getfulldaynew(newdate.getDay());

        var d = newdate.getDate();

        var m = newdate.getMonth() + 1;
        var y = newdate.getFullYear();




            var imgg = "";
            // alert(menu.Body.substring(0, 200));
        newsid = menu.ID;
        $('#divNonews').hide();
            $('#divyesnews').show();
            $('#divtitle').empty();
            $('#divbody').empty();

            $('#divtitle').append(menu.Title);
            $('#divbody').append(menu.Body);

        $('#btndatenews').append(day + "," + d + "/" + m + "/" + y);


        if (menu.URL == "") {
            $('#divlinks').hide();
        }else{
            $('#divlinks').show();
            $('#divlinks').empty();

            if ((menu.URL).search("facebook.com") != -1) {

                $('#divlinks').append('<li class="list-group-item" onclick="URLredirect(\'' + menu.URL + '\')" >Facebook Link</li>');

            } else if ((menu.URL).search(".pdf") != -1) {

                $('#divlinks').append('<li class="list-group-item" onclick="URLredirect(\'' + menu.URL + '\')" >View Adobe File</li>');

            } else if ((menu.URL).search("youtu.be") != -1 || (menu.URL).search("youtube") != -1) {

                $('#divlinks').append('<li class="list-group-item" onclick="URLredirect(\'' + menu.URL + '\')" >YouTube Link</li>');
            } else {

                $('#divlinks').append('<li class="list-group-item" onclick="URLredirect(\'' + menu.URL + '\')" >Website Link</li>');
            }



        }


    }else{
        window.localStorage.setItem("newfeesactive", 1);
        $('#divNoclub').hide();
        $('#divyesnews').hide();
        $('#divNonews').show();

    }
  //  alert("finsih");
    window.plugins.spinnerDialog.hide();
    $('#loadinggears').hide();
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

    if(window.localStorage.getItem("newfeesactive") == 0) {


        if (lastnews == newsid) {
            db.transaction(getdataplus2, errorCBfunc, successCBfunc);
            intcount = 1;
        } else {
            db.transaction(getdataplus, errorCBfunc, successCBfunc);
            intcount = intcount + 1;
        }
    }
}

function getpervoiusnewfeed(){

    if(window.localStorage.getItem("newfeesactive") == 0) {


        if (firstnews == newsid) {
            db.transaction(getdataminus2, errorCBfunc, successCBfunc);
            intcount = allnews;
        } else {

            db.transaction(getdataminus, errorCBfunc, successCBfunc);
            intcount = intcount - 1;
        }
    }
}

function getdataminus(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '<br>') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and ID > " + newsid + " and DeletedateUTC = 'null' order by ID ASC LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}

function getdataminus2(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '<br>') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' order by ID ASC LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}

function getdataplus(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '<br>') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and ID < " + newsid + " and DeletedateUTC = 'null' order by ID Desc LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}
function getdataplus2(tx) {

    var sql = "select ID,_id,UpdateDateUTC,Title,replace(Body, '###$$###', '<br>') as Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC,FromPhone from MobilevwApp_News_v_2 where ClubID=" + window.localStorage.getItem("teamfollow") + " and DeletedateUTC = 'null' order by ID Desc LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}
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
document.addEventListener("deviceready", onDeviceReadynews, false);

function onDeviceReadynews() {
    db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getdatanews, errorCBfunc, successCBfunc);
  //  checkfb();
}

//db.transaction(getdatanews, errorCBfunc, successCBfunc);


function checkfb(){

    if(device.platform == "iOS"){
        appAvailability.check(
            'fb://', // URI Scheme
            function() {           // Success callback
               // alert("facebook is available");
                facebookchk = 1;
            },
            function() {           // Error callback
              //  alert("facebook is not available");
                facebookchk = 0;
            }
        );

    }else  if(device.platform == "Android"){
        appAvailability.check(
            'com.facebook.katana', // URI Scheme
            function() {           // Success callback
               // alert("facebook is available");
                facebookchk = 1;
            },
            function() {           // Error callback
               // alert("facebook is not available");
                facebookchk = 0;
            }
        );

    }else{


    }
}






function getdatanews(tx) {
    var sql = "select ID from MobileApp_clubs where Fav = 1";
    //alert(sql);
    tx.executeSql(sql, [], getClubID_success);
}


function loadnewdata(){

    refreshdata();
    $('#newsmain').empty();
    spon = 1;
    spon2 =1 ;
    db.transaction(getdatanews, errorCBfunc, successCBfunc);
}




function getClubID_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;


    if(len != 0) {
        var menu = results.rows.item(0);
        clubidtop = menu.ID;
      //  db.transaction(getdata2, errorCBfunc, successCBfunc);
        db.transaction(numbersponsers, errorCBfunc, successCBfunc);

     }else{

        showclubsfun();
    }


}


function numbersponsers(tx) {
    var sql = "select ID  from Mobilesponsorsclub where Club=" + clubidtop + " and DeletedateUTC == 'null'";
   //  alert(sql);
    tx.executeSql(sql, [], numbersponsers_success);
}

function numbersponsers_success(tx, results) {
    var len = results.rows.length;

    nospor = len;
   // alert(nospor);
    db.transaction(getdata2, errorCBfunc, successCBfunc);
}

function getdata2(tx) {
    var sql = "select ID,_id,UpdateDateUTC,Title,Body,ClubID,TeamID,Hide,IsAd,Base64,URL,Hint,DisplayDateUTC,DisplaySecondsUTC,DeletedateUTC from MobilevwApp_News_v_2 where ClubID=" + clubidtop + " and DeletedateUTC = 'null' order by DisplayDateUTC Desc";
//alert(sql);
    tx.executeSql(sql, [], getnewfeed_success);
}



function getnewfeed_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    if(len!= 0) {

        var count = 0;
        $('#newsmain').empty();
        for (var i = 0; i < len; i++) {
            var menu = results.rows.item(i);
            var imgg = "";
            // alert(menu.Body.substring(0, 200));


            //  alert("i=" + i + " -" + menu.Title);
            if (menu.URL != "") {
                var imgicon = "";
                var URLnow = "";

                if ((menu.URL).search("facebook.com") != -1) {
                    imgicon = "<img src='../img/fb.png' style='padding-right: 10px' height='30' align='left'>";
                    URLnow = menu.URL;
                } else if ((menu.URL).search(".pdf") != -1) {
                    imgicon = "<img src='../img/adobe.png' style='padding-right: 10px' height='30' align='left'>";
                    URLnow = menu.URL;
                } else if ((menu.URL).search("youtu.be") != -1) {
                    imgicon = "<img src='../img/youtube.png' style='padding-right: 10px' height='30' align='left'>";
                    URLnow = menu.URL;
                } else {
                    imgicon = "<img src='../img/infohttp.png' style='padding-right: 10px' height='30' align='left'>";
                    URLnow = menu.URL;
                }


                if ((menu.Body).length <= 200) {

                    $('#newsmain').append('<Div id="divnewmain" class=" bs-callout bs-callout-info"  align="left">' +
                        '<Div id="divnew1"   onclick="URLredirect(\'' + URLnow + '\')"> ' +
                        '' + imgicon +
                        '</Div>' +

                        '<Div id="divnew2"> ' +
                        '<div class="bold size13"   >' + menu.Title + '</div>' +
                        '<div class="size11">' + menu.Body + '</div>' +
                        '</Div>' +

                        '</Div>');


                } else {
                    $('#newsmain').append('<Div  id="divnewmain" class=" bs-callout bs-callout-info" align="left"  >' +
                        '<Div id="divnew1"   onclick="URLredirect(\'' + URLnow + '\')"> ' +
                        '' + imgicon +
                        '</Div>' +

                        '<Div id="divnew2"> ' +
                        '<div class="bold size13"   >' + menu.Title + '</div>' +
                        '<div class="size11">' + menu.Body.substring(0, 200) +
                        '  <span data-toggle="modal"  class="size11 blue" data-target="#basicModal" onclick="loadnewfeed(' + menu.ID + ')"  >Read More</span></div>' +
                        '</Div>');
                }

            } else {
                imgicon = "<img src='../img/info.png' style='padding-right: 10px' height='30' align='left'>";


                if ((menu.Body).length <= 200) {


                    $('#newsmain').append('<Div  id="divnewmain" align="left"  class=" bs-callout bs-callout-success"  >' +
                        '<Div id="divnew1"> ' +
                        '' + imgicon +
                        '</Div>' +

                        '<Div id="divnew2"> ' +
                        '<div class="bold size13"   >' + menu.Title + '</div>' +
                        '<div class="size11">' + menu.Body + '</div>' +
                        '</Div>' +
                        '</Div>');

                } else {

                    $('#newsmain').append('<Div  id="divnewmain" align="left"  class=" bs-callout bs-callout-success"  >' +
                        '<Div id="divnew1" > ' +
                        '' + imgicon +
                        '</Div>' +


                        '<Div id="divnew2"> ' +
                        '<div class="bold size13"   >' + menu.Title + '</div>' +
                        '<div class="size11">' + menu.Body.substring(0, 200) +
                        '  <span data-toggle="modal"  class="size11 blue" data-target="#basicModal" onclick="loadnewfeed(' + menu.ID + ')"  >Read More</span></div>' +
                        '</Div>' +
                        '</Div>');

                }

            }


            if (count == 2 && spon2 <= nospor) {
                console.log("ii=" + ii + " -" + menu.Title);
                $('#newsmain').append('<Div id="spondiv' + spon2 + '" class="sponsordiv"></div>');

                spon2++;

                //
                count = -1;
            }
            count++;

        }
        db.transaction(getsponsors, errorCBfunc, successCBfunc);

    }else{



        $('#newsmain').append('<Div  id="divnewmain" align="left"  class=" bs-callout bs-callout-success"  >' +
            '<Div id="divnew1" > ' +
            '<img src="../img/infohttp.png" style="padding-right: 10px" height="30" align="left">' +
            '</Div>' +


            '<Div id="divnew2"> ' +
            '<div class="bold size13"   >No News Yet!</div>' +
            '</Div>');
    }
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
                imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  >';
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






function loadnewfeed2(tx) {

    var sql = "select Title,Body from MobilevwApp_News_v_2 where ID=" + IDNews;
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


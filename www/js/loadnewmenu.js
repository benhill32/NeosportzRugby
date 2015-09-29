
var schstring = "";
var resultsstring = "";
var standstring = "";
var Clubstring = "";
var IDhistall = 0;
var IDconall =0;
var styleall= "";
var favidall= 0;
var networkconall = "";
var wifiallset = 0;
var regionID = 0;
var clubfavall = 0;
var menucol = "";
var textcol = "";
document.addEventListener("deviceready", onDeviceReadymainmenu, false);


function onDeviceReadymainmenu() {
    deviceIDfunc = device.uuid;

//alert("start menu");



}

function onOfflineall(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconall = states[networkState];
//alert(states[networkState]);

}



function closemenu(){

    $("#menu").hide();
}


function getMenusch(tx) {

//alert("load menu");
    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Schedule_Menu where Hide = 0 Group by DivisionName,DivisionID  order by DivisionOrderID";
    // alert(sql);

    tx.executeSql(sql, [], getMenusch_success);
}


function getMenusch_success(tx, results) {

    var len = results.rows.length;
    // alert(len);
    schstring = "";
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        schstring += '<li><a href="#" onclick="redirectschedules2(' + menu._id + ')">'+ menu.DivisionName + '</a></li>';


    }
   // alert(schstring);

    db.transaction(getMenuresult, errorCBfunc, successCBfunc);
}



function getMenuresult(tx) {
    var sql = "select Distinct DivisionName,DivisionID,_id from MobileApp_Results_Menu  where Hide = 0  Group by DivisionName,DivisionID  order by DivisionOrderID";
    // var sql = "select Distinct DivisionName,DivisionID from MobileApp_Schedule_Menu Group by DivisionName,DivisionID  order by DivisionOrderID";


    // alert(sql);
    tx.executeSql(sql, [], getMenuresult_success);
}


function getMenuresult_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    //  alert(len);
    resultsstring = "";
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        resultsstring+='<li><a href="#" onclick="redirectresults(' + menu._id + ')">'+ menu.DivisionName + '</a></li>';


    }

    db.transaction(getMenustandings, errorCBfunc, successCBfunc);
}


function getMenustandings(tx) {
    var sql = "select _id, TournamentName,UpdateDateUTC ,OrderID from MobileApp_Results_Table_Menu  where Hide = 0 order by OrderID,TournamentName";
    //alert(sql);
    tx.executeSql(sql, [], getMenustandings_success);
}


function getMenustandings_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    // alert(len);
    standstring="";
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

        standstring +='<li><a href="#" onclick="redirectstandings(' + menu._id + ')">'+ menu.TournamentName + '</a></li>';

    }



    db.transaction(getdataclubs, errorCBfunc, successCBfunc);




}


function getdataclubs(tx) {

    var sql = "select ID,_id ,name,UpdateDateUTC,Color,TextColor ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color,Fav from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getdataclubs_success);
}

function getdataclubs_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    Clubstring= "";
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";
        var imgstring = "#clubtick" + menu.ID;
        var imgstring2 = "clubtick" + menu.ID;
        if(menu.Base64 != "null"){
            imgg = '<img src="data:image/png;base64,' + menu.Base64 + '"  align="left" height="40">';
        }

        styleall = '<span class="glyphicon glyphicon-ok" style="display:none;" id="' + imgstring2 + '" aria-hidden="true"></span>';


        if(menu.Fav == 1){

            favidall = menu.ID;
            clubfavall = menu.ID;
            menucol = "#" + menu.Color;
            textcol = "#" + menu.TextColor;
        }



        Clubstring+='<li id="clubmenu' + menu.ID + '"><a href="#clubmenuu' + menu.ID + '" data-target="clubmenuu' + menu.ID + '">'+ imgg + "  " + menu.name + '  ' + styleall + '</a>' +
            '<ul id="clubmenuu' + menu.ID + '">' +
            '<li data-toggle="modal" data-target="#basicModalclubhistory"><a href="#"  onclick="loadhistoryall(' + menu.ID + ')">Club History</a></li>' +
            '<li data-toggle="modal" data-target="#basicModalclubContact"><a href="#"   onclick="loadcontactsall(' + menu.ID + ')">Club Contacts</a></li>' +
            '<li><a href="#" onclick="updatefollowall(' + menu.ID + ',\'' + menu.Color + '\')">Set as Favourite Club</a></li>' +
            '</ul>' +
            '</li>';



    }


    if(document.getElementById("indexdiv")!=null) {

        //$("#menu").show();
    }

    db.transaction(getsyncdateall, errorCBfunc, successCBfunc);





}



function getsyncdateall(tx) {
    var sql = "select Datesecs, syncwifi,Region,isadmin,allowscore from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], getsyncdateall_success2);
}

function getsyncdateall_success2(tx, results) {
    onOfflineall();

    var len = results.rows.length;

    var menu = results.rows.item(0);
    //   alert(menu.Datesecs);
    var dateme = new Date((menu.Datesecs)*1000);
    var wifi = menu.syncwifi;
    wifiallset = wifi;
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    regionID =menu.Region;



    $('#lastsyncdate').empty();
    if(dateme.getFullYear() != 1970) {
        $('#lastsyncdate').append("<strong>Last sync time</strong> <br>" + dateme.getDate() + " " + month[dateme.getMonth()] + " " + dateme.getFullYear() + " " + (dateme.getHours()) + ":" + ("0" + dateme.getMinutes()).slice(-2) + ":" + ("0" + dateme.getSeconds()).slice(-2))
    }
    console.log("Last sync time : " + dateme.getDate() + " " + month[dateme.getMonth()] + " " + dateme.getFullYear() + " " + (dateme.getHours()) + ":" + ("0" + dateme.getMinutes()).slice(-2) + ":" + ("0" + dateme.getSeconds()).slice(-2) );



    if((wifi ==1 &&  networkconall==2) || ((wifi ==0 &&  networkconall!=0))){
        $("#settingdeleteall").css('color', 'white');
        $("#settingsync").css('color', 'white');
        $("#regioniddiv").css('color', 'white');

        $('#settingdeleteall').click(function() {
            cleardata4Changeregaionall();
        });
        $('#settingsync').click(function() {
            onclicksyncloaddata();
        });
        $('#regioniddiv').click(function() {
            onclickloadregion();
        });



    }else{

        $("#settingdeleteall").css('color', 'grey');
        $("#settingsync").css('color', 'grey');
        $("#regioniddiv").css('color', 'grey');
        $('#settingdeleteall').unbind('click');




        $('#settingsync').unbind('click');
        $('#regioniddiv').unbind('click');


    }

    if(menu.isadmin == 0){
        $('#divadminarea').hide();
    }else{
        $('#divadminarea').show();

    }

if(menu.allowscore == 0){
    $('#scoringreqdiv').show();
    $('#scoringreqdiv2').hide();
}else{
    $('#scoringreqdiv').hide();
    $('#scoringreqdiv2').show();

}

    if(wifi==1) {
        $('#btnmenu2').removeClass("btn btn-xs btn-success");
        $('#btnmenu1').removeClass("btn btn-xs btn-default")
        $('#btnmenu2').addClass("btn btn-xs btn-default");
        $('#btnmenu1').addClass("btn btn-xs btn-success");

    }else if(wifi==0) {
        $('#btnmenu1').removeClass("btn btn-xs btn-success");
        $('#btnmenu2').removeClass("btn btn-xs btn-default")
        $('#btnmenu1').addClass("btn btn-xs btn-default");
        $('#btnmenu2').addClass("btn btn-xs btn-success");

    }

    db.transaction(getregionName2all, errorCBfunc, successCBfunc);

    $('#busy').hide();


}
function nointernet(){

    window.plugins.toast.showShortCenter('Sorry couldnt update Server No Internet', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

}


function getregionName2all(tx) {

    var sql = "select Name from MobileRegion where ID=" + regionID;
    //   alert(sql);
    tx.executeSql(sql, [], getregionName2all_success);
}

function getregionName2all_success(tx, results) {

    var len = results.rows.length;

    var menu = results.rows.item(0);
    $('#regionlbl').empty();

    $('#regionlbl').append(menu.Name);


        $("#menu").show();


//alert("last Stage of menu");

    var stringapp = device.uuid;

    $("#deviceid").empty();
    $("#deviceid").append(stringapp);

    $("#appversion").empty();
    $("#appversion").append(appversionlocalf);


    $("#schedulemenudiv").empty();
    $("#resultmenudiv").empty();
    $("#standingsmenudiv").empty();
    $("#clubsmenudiv").empty();

    $("#schedulemenudiv").append(schstring);
    $("#resultmenudiv").append(resultsstring);
    $("#standingsmenudiv").append(standstring);
    $("#clubsmenudiv").append(Clubstring);

    $("#clubtick" + clubfavall).show();





    //alert($("#backgroundimg").css('background-color'));

    //alert($("#backgroundimg").css('background-color'));



    //alert(document.getElementsByClassName("mm-menu").style.backgroundColor);
   // $("#mainimgscreen").css('background-color', 'blue');
    $("#menu").css('background-color','red !important');

        $(function () {
            $('nav#menu').mmenu({
                extensions: ["border-full", "pageshadow"],
                "navbar": {
                    "title": "Neosportz Rugby"
                }
            });

        });


    alert($("#menu").css('background-color'));

    if(menucol == "#") {

        $("#backgroundimg").css('background-color','red');
        $("#menu").css('background-color','#4776D1 !important');
        //    document.getElementsByClassName("mm-menu").style.backgroundColor = "#4776D1 !important";
       // $(".mm-menu").css('background-color', '#4776D1 !important');
        //     $(".mm-menu").css("color", "red !important" );


    }else{
        var menucol1  = menucol + ' !important';
       // alert(menucol1);

        $("#backgroundimg").css('background-color',menucol);
        $("#menu").css('background-color','red !important');
        //    document.getElementsByClassName("mm-menu").style.backgroundColor = menucol + " !important";
        // $(".mm-menu").css("background",  menucol + " !important");
        //    $(".mm-menu").css("color", "red !important")
       // $(".mm-menu").css('background-color', menucol + ' !important');
    }


    alert($("#menu").css('background-color'));
}


function chkmobiledataall(id){
    onOfflineall();

    if(id=="btn1")
    {

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set syncwifi = 1');
            console.log("syncwifi on");
        });

        $('#btnmenu2').removeClass("btn btn-xs btn-success");
        $('#btnmenu2').addClass("btn btn-xs btn-default");
        $('#btnmenu1').removeClass("btn btn-xs btn-default");
        $('#btnmenu1').addClass("btn btn-xs btn-success");
        wifiallset = 1;
    }
    else if(id== "btn2")
    {
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set syncwifi = 0');
            console.log("syncwifi off");
        });
        wifiallset =0;
        $('#btnmenu1').removeClass("btn btn-xs btn-success");
        $('#btnmenu1').addClass("btn btn-xs btn-default");
        $('#btnmenu2').removeClass("btn btn-xs btn-default");
        $('#btnmenu2').addClass("btn btn-xs btn-success");
    }




    if((id=="btn1" &&  networkconall==2) || ((id== "btn2" &&  networkconall!=0))){

        $("#settingdeleteall").css('color', 'white');
        $("#settingsync").css('color', 'white');
        $("#regioniddiv").css('color', 'white');

        $('#settingdeleteall').click(function() {
            cleardata4Changeregaionall();
        });
        $('#settingsync').click(function() {
            onclicksyncloaddata();
        });
        $('#regioniddiv').click(function() {
            onclickloadregion();
        });



    }else{

        $("#settingdeleteall").css('color', 'grey');
        $("#settingsync").css('color', 'grey');
        $("#regioniddiv").css('color', 'grey');

            $('#settingdeleteall').unbind('click');

        $('#settingsync').unbind('click');

        $('#regioniddiv').unbind('click');

    }


}


function updatefollowall(ID,Color){


    $("#clubtick" + clubfavall).hide();

    clearfavteam()

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0');
            console.log("Update MobileApp_LastUpdatesec");
        });


        addfavteam(ID);



        addfavclub();


   // window.setTimeout(function(){
      //  window.location.reload();
  //  }, 1500);


        $("#clubtick" + ID).show();


    if(Color == "") {

        $("#backgroundimg").css('background-color','red');

    }else{

        $("#backgroundimg").css('background-color','#' + Color);


    }

    clubfavall = ID;

}






function redirectstandings(ID){

    if(document.getElementById("indexdiv")==null) {

        window.location = "../pages/standings.html?id=" + ID;
    }else{

        window.location = "pages/standings.html?id=" + ID;
    }

}

function redirectresults(ID){
    if(document.getElementById("indexdiv")==null) {
        window.location = "../pages/results.html?id=" + ID;
    }else{

        window.location = "pages/results.html?id=" + ID;
    }
}

function redirectschedules2(ID){
    if(document.getElementById("indexdiv")==null) {
    window.location = "../pages/schedules.html?id=" + ID;
    }else{

        window.location = "pages/schedules.html?id=" + ID;
    }
}



function loadhistoryall(ID){
    IDhistall = ID;
    //$('body').css('position','fixed');
    //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    db.transaction(loadhistoryall_next, errorCBfunc, successCBfunc);

}

function loadhistoryall_next(tx) {

    var sql = "select replace(History, '###$$###', '<br>') as History,name from MobileApp_clubs where ID=" + IDhistall;
    //  alert(sql);
    tx.executeSql(sql, [], loadhistoryall_next_success);
}

function loadhistoryall_next_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    var menu = results.rows.item(0);
    $('#clubhistorydiv').empty();
    if(document.getElementById("indexdiv")==null) {
        $('#clubhistorydiv').append('<img src="../img/info.png" height="20"> Club History : ' + menu.name + '');
    }else{

        $('#clubhistorydiv').append('<img src="img/info.png" height="20"> Club History : ' + menu.name + '');
    }
    $('#modelhistoryall').empty();
    $('#modelhistoryall').append( '<div>1</div>');
    $('#modelhistoryall').empty();
    $('#modelhistoryall').append( '<div>' + menu.History + '</div>');
}

function loadcontactsall(ID){
    IDconall = ID;

    db.transaction(loadcontactsall_next, errorCBfunc, successCBfunc);

}

function loadcontactsall_next(tx) {

    var sql = "select replace(Contacts, '###$$###', '<br>') as Contacts,name from MobileApp_clubs where ID=" + IDconall;
    //  alert(sql);
    tx.executeSql(sql, [], loadcontactsall_next_success);
}

function loadcontactsall_next_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);

    var menu = results.rows.item(0);

    $('#clubcontactdiv').empty();
    if(document.getElementById("indexdiv")==null) {
        $('#clubcontactdiv').append('<img src="../img/info.png" height="20"> Club Contact :  ' + menu.name);
    }else{
        $('#clubcontactdiv').append('<img src="img/info.png" height="20"> Club Contact :  ' + menu.name);
    }

    $('#modelcontactall').empty();
    $('#modelcontactall').append( '<div>' + menu.Contacts + '</div>');

}




function cleardata4Changeregaionall(){

    onOfflineall();


    if((wifiallset ==1 &&  networkconall==2) || ((wifiallset ==0 &&  networkconall!=0))) {
        $('#indexloadingdata').modal('show');
        db.transaction(droptables, errorCBfunc,successCBfunc);

        window.setTimeout(function(){
            createtables4Changeregaionall();
        }, 2500);
    }


}

function createtables4Changeregaionall(){

    $('#indexloadingdata').modal('hide');
    if (document.getElementById("indexdiv") != null)
    {
        weblink('index.html')
    }
    else
    {
        weblink('../index.html')
    }

}


function benclick() {
    // $('#mainfore').removeClass('mainforeground');
    //  $('#mainfore').addClass('mainforeground2');
    alert("das");
    //$('#basicModalclubContact').modal('show');

    $('body').loading({
        stoppable: true
    });
}

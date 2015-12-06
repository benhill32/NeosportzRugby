
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
var favbase64= "";
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


    db.transaction(getsyncdateall, errorCBfunc, successCBfunc);
}

function getsyncdateall(tx) {
    var sql = "select Datesecs, syncwifi,Region,isadmin,allowscore,fliterON,startpage from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], getsyncdateall_success2);
}

function getsyncdateall_success2(tx, results) {
    onOfflineall();
    checksendnews();
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
   // console.log("Last sync time : " + dateme.getDate() + " " + month[dateme.getMonth()] + " " + dateme.getFullYear() + " " + (dateme.getHours()) + ":" + ("0" + dateme.getMinutes()).slice(-2) + ":" + ("0" + dateme.getSeconds()).slice(-2) );



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

    if(menu.fliterON == 1){

        $("#switch-filter").prop("checked", true );

    }else if(menu.fliterON == 0){

        $("#switch-filter").prop("checked", false );

    }




    if(wifi==1) {

        $("#switch-onColor").prop("checked", true );



    }else if(wifi==0) {

        $("#switch-onColor").prop("checked", false );
    }

    var page2 = "";

    if(menu.startpage == 1){
        page2 = "Home";
    }else if(menu.startpage == 2){
        page2 = "Games";
    }else if(menu.startpage == 3){
        page2 = "Standings";
    }else if(menu.startpage == 4){
        page2 = "Clubs";
    }else if(menu.startpage == 5){
        page2 = "News";
    }



    $('#lblstartingpage').empty().append(page2);





    db.transaction(getregionName2all, errorCBfunc, successCBfunc);




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


    var stringapp = device.uuid;

    $("#deviceid").empty();
    $("#deviceid").append(stringapp);

    $("#appversion").empty();
    $("#appversion").append(appversionlocalf);







    $("#mm-blocker").click(closemenu());

    $("#menu").show();

    $("#spanmenu").show();

    $(function () {
        $('nav#menu').mmenu({
            "extensions": ["border-full", "pageshadow"],
            "navbar": {
                "title": "Neosportz Rugby"
            },
            "navbars": [
                {
                    "position": "bottom",
                    "content": [
                        "<a style='padding-bottom: 0px;'><img src='img/neocomhome.png' align='center' Height='50px' onclick='URLredirect('http://www.neocom.co.nz')'></a>"
                    ]
                }
            ]
        });

    });

    $('#indexloadingdata').modal('hide');


    $("#switch-onColor").bootstrapSwitch();
    $("#switch-onColor").on('switchChange.bootstrapSwitch', function(event, state) {

        if(state == true){
            chkmobiledataall(1);
        }else{
            chkmobiledataall(0);
        }
    });

    $("#switch-filter").bootstrapSwitch();
    $("#switch-filter").on('switchChange.bootstrapSwitch', function(event, state) {

        if(state == true){
            chkfilter(1);
        }else{
            chkfilter(0);
        }
    });

}

function checksendnews(){

    if(window.localStorage.getItem("allownewfeed") ==1 && window.localStorage.getItem("teamfollow") == window.localStorage.getItem("Clubedit")){
        $('#divloadnews').show();

    }else if (window.localStorage.getItem("isadmin") ==1){
        $('#divloadnews').show();

    }else{
        $('#divloadnews').hide();
    }
}


function chkfilter(id){
    if(id==1)
    {
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set fliterON = 1');
        });
        window.localStorage.setItem("fliter", "1");

        if (document.getElementById("clubpage") != null) {
            db.transaction(getfirstclub, errorCBfunc, successCBfunc);
        }
        if (document.getElementById("divschedules") != null) {
            datecheck(date,0);
        }


    }
    else if(id== 0)
    {
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set fliterON = 0');
        });
        window.localStorage.setItem("fliter", "0");

        if (document.getElementById("clubpage") != null) {
            db.transaction(getfirstclub, errorCBfunc, successCBfunc);
        }
        if (document.getElementById("divschedules") != null) {
            datecheck(date,0);
        }
    }


}

function chkmobiledataall(id){



    onOfflineall();
    if(id==1)
    {

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set syncwifi = 1');
            console.log("syncwifi on");
        });
        wifiallset = 1;
    }
    else if(id== 0)
    {
        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set syncwifi = 0');
            console.log("syncwifi off");
        });
        wifiallset =0;

    }




    if((id==1 &&  networkconall==2) || ((id== 0 &&  networkconall!=0))){

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


function updatefollowall(ID,Color,Name,Base64,textcol) {


    $("#clubtick" + clubfavall).hide();

    clearfavteam()

    db.transaction(function (tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0');
        console.log("Update MobileApp_LastUpdatesec");
    });


    addfavteam(ID);


    addfavclub();


    // window.setTimeout(function(){
    //  window.location.reload();
    //  }, 1500);


    $("#clubtick" + ID).show();
    //alert( $("#menu").css('color'));


    if (Color == "") {

        $("#backgroundimg").css('background-color', 'red');
        $("#menu").css('background-color', '#4776D1');
        $("#menu").css('color','white');
    } else {

        $("#backgroundimg").css('background-color', '#' + Color);
        $("#menu").css('background-color', '#' + Color);
        $("#menu").css('color','#' + textcol);

    }
//alert( $("#menu").css('color'));

    if(Base64 != ""){

        $("#backgroundimg1").attr("src","data:image/png;base64," + Base64);

    }


    clubfavall = ID;


    window.plugins.toast.showShortCenter('Your Favourite Club is : ' + Name, function (a) {
        console.log('toast success: ' + a)
    }, function (b) {
        alert('toast error: ' + b)
    });


    if (document.getElementById("newsmain") != null) {

        window.setTimeout(function(){
            location.reload();
        }, 1500);

    }


    if (document.getElementById("divschedules") != null) {
        window.setTimeout(function(){
        location.reload();
    }, 1500);

}

    if (document.getElementById("divresults") != null) {

        window.setTimeout(function(){
            location.reload();
    }, 1500);

}
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



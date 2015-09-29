
document.addEventListener("deviceready", onDeviceReadyscoring, false);
var deviceIDscore = 0;
var networkconscore= "";
var scoretoken= "";


function onDeviceReadyscoring() {
    deviceIDscore = device.uuid;

    onOfflinescore();
    db.transaction(getdatascore, errorCBfunc, successCBfunc);
    db.transaction(gettokenscore, errorCBfunc, successCBfunc);
}


function onOfflinescore(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = '0';
    states[Connection.ETHERNET] = '2';
    states[Connection.WIFI]     = '2';
    states[Connection.CELL_2G]  = '1';
    states[Connection.CELL_3G]  = '1';
    states[Connection.CELL_4G]  = '1';
    states[Connection.NONE]     = '0';

    networkconscore = states[networkState];
//alert(states[networkState]);

}


function getdatascore(tx) {

    var sql = "select ID ,name,Fav from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getdatascore_success);
}

function getdatascore_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    $('#idclub').empty();
    var option = '';
    for (var i = 0; i < len; i++) {
        var menu = results.rows.item(i);
        option += '<option value="' + menu.ID + '">' + menu.name + '</option>';

    }

    $('#idclub').append(option);
    $("#lblappid").empty();
    $("#lblappid").append(deviceIDscore)
}

function gettokenscore(tx) {
    var sql = "select token from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gettokenscore_success);
}

function gettokenscore_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    var menu = results.rows.item(0);

    scoretoken = menu.token;

}



function sendscorertoserver(){
    onOfflinescore();

    if(networkconscore != 0) {

       var playername = $('#idname').val();
        var club = $('#idclub').val();


        var response =   passscoretoserverscorecard("namescore=" + playername + "&clubid=" + club + "&deviceid=" + deviceIDscore + "&token=" + scoretoken)


      //  alert("applyscorer=1&namescore=" + playername + "&clubid=" + club + "&deviceid=" + deviceIDscore + "&token=" + scoretoken);
        // alert(response);

        if(response = "{'Success' : [{'Message': 'Everything is Good'}]"){

            window.plugins.toast.showShortCenter('Thanks you for applying! You will be notified within the next couple of days.', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});


        }else{

            window.plugins.toast.showLongCenter('Something when wrong sorry.', function (a) {console.log('toast success: ' + a)}, function (b) {alert('toast error: ' + b)});

        }
    }
    else{

        alert("You don't have access to internet!");
    }



}
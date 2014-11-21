var db;
var dbCreated = false;
var id = getUrlVarsfunc()["id"];
var orientationstand = "";
document.addEventListener("deviceready", onDeviceReadystand(), false);
var devicePlatformfstand;
function onDeviceReadystand() {
  //  db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
 //   console.log("LOCALDB - Database ready");
    db.transaction(getstandings, errorCBfunc, successCBfunc);
    devicePlatformfstand = device.platform;

}
//db.transaction(getstandings, errorCBfunc, successCBfunc);

function getorient(strorein){
    orientationstand = strorein;
  //  alert(orientationstand);
    db.transaction(getstandings, errorCBfunc, successCBfunc);
}

function getstandings(tx) {

    var sql = "select _id,Games,Won,Drawn,Lost,ForScore,AgainstScore,Difference,ClubID,Name,abbreviation,TournamentID,FlagPoints,UpdateDateUTC ,TournamentName,Bonus from MobileStandings where TournamentID = '" + id + "' order by FlagPoints DESC,Difference DESC";
   // alert(sql);
    tx.executeSql(sql, [], getstandings_success);
}

function getstandings_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert(orientationstand);
    $('#divstandings').empty();
    $('#divstandingsheader').empty();
    $('#divstandingsheader').append('<Div align="left" id="divmenustandings" style="float: left;" ></Div>');

    $('#divstandings').append('<Div align="left" id="idteamname" style="float: left;" ></Div>');

    if (orientationstand == "landscape") {
        $('#divmenustandings').append('<Div  class="standheaderteam bold" >Team name</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >P</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >W</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >D</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >L</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >B</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >F</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >A</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >DF</Div>');
        $('#divmenustandings').append('<Div  class="standheader bold" >PT</Div>');

    $('#divstandings').append('<Div align="left" id="idgamesp" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="left" id="idgamesW" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="left" id="idgamesD" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="left" id="idgamesL" class="score1"  style="float: left;" ></Div>');
        $('#divstandings').append('<Div align="left" id="idgamesB" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="left" id="idgamesF" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="left" id="idgamesA" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="left" id="idgamesGD" class="score1"  style="float: left;" ></Div>');
    $('#divstandings').append('<Div align="right" id="idgamesFP" class="score1"  style="float: left;" ></Div>');
    }
    if (orientationstand == "portrait") {
        $('#divmenustandings').append('<Div  class="standheaderteam  bold" >Team name</Div>');
        $('#divmenustandings').append('<Div  class="standheader2  bold" >P</Div>');
        $('#divmenustandings').append('<Div  class="standheader2 bold" >W</Div>');
        $('#divmenustandings').append('<Div  class="standheader2  bold" >D</Div>');
        $('#divmenustandings').append('<Div  class="standheader2  bold" >L</Div>');
        $('#divmenustandings').append('<Div  class="standheader2  bold" >PTS</Div>');

        $('#divstandings').append('<Div align="left" id="idgamesp" class="score2"  style="float: left;" ></Div>');
        $('#divstandings').append('<Div align="left" id="idgamesW" class="score2"  style="float: left;" ></Div>');
        $('#divstandings').append('<Div align="left" id="idgamesD" class="score2"  style="float: left;" ></Div>');
        $('#divstandings').append('<Div align="left" id="idgamesL" class="score2"  style="float: left;" ></Div>');
        $('#divstandings').append('<Div align="right" id="idgamesFP" class="score2"  style="float: left;" ></Div>');

    }

var height= 0;
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        if (orientationstand == "portrait") {

            $('#idteamname').append('<Div class="score3 bold"  >' + menu.abbreviation + '</Div>');

        }else{
            $('#idteamname').append('<Div class="score3 bold"  >' + menu.Name + '</Div>');
        }
        $('#idgamesp').append('<Div class="score3" style="border-left:1px solid lightgray;"  >' + menu.Games + '</Div>');
        $('#idgamesW').append('<Div class="score3" >' + menu.Won + '</Div>');
        $('#idgamesD').append('<Div class="score3"  >' + menu.Drawn + '</Div>');
        $('#idgamesL').append( '<Div class="score3" >' + menu.Lost + '</Div>');
        $('#idgamesB').append( '<Div class="score3" >' + menu.Bonus + '</Div>');
        $('#idgamesF').append('<Div class="score3" >' + menu.ForScore + '</Div>');
        $('#idgamesA').append('<Div class="score3" >' + menu.AgainstScore + '</Div>');
        $('#idgamesGD').append( '<Div class="score3" >' + menu.Difference + '</Div>');
        $('#idgamesFP').append('<Div class="score3" >' + (menu.FlagPoints + menu.Bonus) + '</Div>');



    }




    $('#idteamname').append('<Div  class="standfooter" ></Div>');
    $('#idgamesp').append('<Div  class="standfooter" ></Div>');
    $('#idgamesW').append('<Div  class="standfooter" ></Div>');
    $('#idgamesD').append('<Div  class="standfooter" ></Div>');
    $('#idgamesB').append('<Div  class="standfooter" ></Div>');
    $('#idgamesL').append('<Div  class="standfooter" ></Div>');
    $('#idgamesF').append('<Div  class="standfooter" ></Div>');
    $('#idgamesA').append('<Div  class="standfooter" ></Div>');
    $('#idgamesGD').append('<Div  class="standfooter" ></Div>');
    $('#idgamesFP').append('<Div  class="standfooter" ></Div>');



 //   '<Div class="floatL hide">' + menu.AgainstScore + '</Div>' +
  //  '<Div class="floatL hide">' + menu.Difference + '</Div>' +
  //  '<Div class="floatL">' + menu.FlagPoints + '</Div>' +

}









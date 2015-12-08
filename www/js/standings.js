var db;
var dbCreated = false;

var firstt =0;
var Lastt= 0;
var IDt = 0;
document.addEventListener("deviceready", onDeviceReadystand(), false);
var devicePlatformfstand;

function onDeviceReadystand() {


    window.setTimeout(function(){


        devicePlatformfstand = device.platform;
        db.transaction(getfirsttournie, errorCBfunc, successCBfunc);

    }, 1000);


}





function getfirsttournie(tx) {

    var sql = "select TournamentID from MobileStandings WHERE DeletedateUTC = 'null' group by TournamentID ORDER BY TournamentID ASC LIMIT 1";
      // alert(sql);
    tx.executeSql(sql, [], getfirsttournie_success);
}


function getfirsttournie_success(tx, results) {
        var len = results.rows.length;
        var menu = results.rows.item(0);
        firstt = menu.TournamentID;
  //  alert(firstt);
    db.transaction(getlastttournie, errorCBfunc, successCBfunc);
}





function getlastttournie(tx) {

    var sql = "select TournamentID from MobileStandings WHERE DeletedateUTC = 'null' group by TournamentID ORDER BY TournamentID DESC LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [],getlastttournie_success);
}


function getlastttournie_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);


    Lastt = menu.TournamentID;
  //  alert(Lastt);

    db.transaction(getstandings, errorCBfunc, successCBfunc);
}



function getstandings(tx) {


    var sql = "select _id,Games,Won,Drawn,Lost,ForScore,AgainstScore,Difference,ClubID,Name,abbreviation,TournamentID,FlagPoints,UpdateDateUTC ,TournamentName,Bonus from MobileStandings where TournamentID = " + firstt + " order by (FlagPoints+Bonus) DESC,Difference DESC";
  //  alert(sql);
    tx.executeSql(sql, [], getstandings_success);
}


function getstandings_success2(tx, results) {
    var len = results.rows.length;
    var menu = results.rows.item(0);

    var sql = "select _id,Games,Won,Drawn,Lost,ForScore,AgainstScore,Difference,ClubID,Name,abbreviation,TournamentID,FlagPoints,UpdateDateUTC ,TournamentName,Bonus from MobileStandings where TournamentID = " + menu.TournamentID + " order by (FlagPoints+Bonus) DESC,Difference DESC";
    //  alert(sql);
    tx.executeSql(sql, [], getstandings_success);

}







function getstandings_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;

    $('#divstandings').empty();
    $('#divstandingsheader').empty();
    $('#divstandingsheader').append('<Div align="left" id="divmenustandings" style="float: left;" ></Div>');

    $('#divstandings').append('<Div align="left" id="idteamname" style="float: left;" ></Div>');

  //  if (orientationstand == "landscape") {
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
  //  }
  // if (orientationstand == "portrait") {
 //       $('#divmenustandings').append('<Div  class="standheaderteam  bold" >Team name</Div>');
  //      $('#divmenustandings').append('<Div  class="standheader2  bold" >P</Div>');
    //    $('#divmenustandings').append('<Div  class="standheader2 bold" >W</Div>');
      //  $('#divmenustandings').append('<Div  class="standheader2  bold" >D</Div>');
        //$('#divmenustandings').append('<Div  class="standheader2  bold" >L</Div>');
 //       $('#divmenustandings').append('<Div  class="standheader2  bold" >PTS</Div>');

   //     $('#divstandings').append('<Div align="left" id="idgamesp" class="score2"  style="float: left;" ></Div>');
     //   $('#divstandings').append('<Div align="left" id="idgamesW" class="score2"  style="float: left;" ></Div>');
  //      $('#divstandings').append('<Div align="left" id="idgamesD" class="score2"  style="float: left;" ></Div>');
   //     $('#divstandings').append('<Div align="left" id="idgamesL" class="score2"  style="float: left;" ></Div>');
     //   $('#divstandings').append('<Div align="right" id="idgamesFP" class="score2"  style="float: left;" ></Div>');

   // }

var height= 0;



    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

         $('#idteamname').append('<Div class="score3 bold"  >' + menu.Name + '</Div>');

        $('#idgamesp').append('<Div class="score3" style="border-left:1px solid lightgray;"  >' + menu.Games + '</Div>');
        $('#idgamesW').append('<Div class="score3" >' + menu.Won + '</Div>');
        $('#idgamesD').append('<Div class="score3"  >' + menu.Drawn + '</Div>');
        $('#idgamesL').append( '<Div class="score3" >' + menu.Lost + '</Div>');
        $('#idgamesB').append( '<Div class="score3" >' + menu.Bonus + '</Div>');
        $('#idgamesF').append('<Div class="score3" >' + menu.ForScore + '</Div>');
        $('#idgamesA').append('<Div class="score3" >' + menu.AgainstScore + '</Div>');
        $('#idgamesGD').append( '<Div class="score3" >' + menu.Difference + '</Div>');
        $('#idgamesFP').append('<Div class="score3" >' + (menu.FlagPoints + menu.Bonus) + '</Div>');
        if(i==1) {
            IDt = menu.TournamentID;
            $('#btntournie').empty().append(menu.TournamentName);
        }
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


function getdataminus(tx) {

    var sql = "select TournamentID from MobileStandings where TournamentID < " + IDt + " group by TournamentID  ORDER BY TournamentID Desc LIMIT 1";
    alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}

function getdataminus2(tx) {

    var sql = "select TournamentID from MobileStandings group by TournamentID  ORDER BY TournamentID Desc LIMIT 1";
    alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}

function getdataplus(tx) {

    var sql = "select TournamentID from MobileStandings where TournamentID > " + IDt + " group by TournamentID ORDER BY TournamentID ASC LIMIT 1";
    alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}
function getdataplus2(tx) {

    var sql = "select TournamentID from MobileStandings group by TournamentID  ORDER BY TournamentID ASC LIMIT 1";
   alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}




function getpervoiustournie(){
  //  alert("pervoius");

    alert(firstt + " - " + IDt);


    if (firstt == IDt) {
        db.transaction(getdataminus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataminus, errorCBfunc, successCBfunc);
    }
}
function getnexttournie(){

    alert(Lastt + " - " + IDt);
//alert("next");
    if (Lastt == IDt) {
        db.transaction(getdataplus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataplus, errorCBfunc, successCBfunc);
    }

}







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
  //    alert(sql);
    tx.executeSql(sql, [], getstandings_success);

}







function getstandings_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
//alert("length " + len);
    $('#divstandings').empty();
    $('#divstandingsheader').empty();
    $('#divstandingsheader').append('<div class="row"><Div align="left" id="divmenustandings" style="float: left;" ></Div></Div>');



  //  if (orientationstand == "landscape") {
        $('#divmenustandings').append('<Div  class="col-xs-3 bold" >Team name</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >P</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >W</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >D</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >L</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >B</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >F</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >A</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >DF</Div>');
        $('#divmenustandings').append('<Div  class="col-xs-1 bold" >PT</Div>');

    $('#divstandings').append('<div class="row"><Div align="left" id="divstandings2" ></Div></div>');

    $('#divstandings2').append('<Div align="left" id="idteamname" class="col-xs-3" ></Div>');

    $('#divstandings2').append('<Div align="left" id="idgamesp" class="score1 col-xs-1"  ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesW" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesD" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesL" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesB" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesF" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesA" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="left" id="idgamesGD" class="score1 col-xs-1"   ></Div>');
    $('#divstandings2').append('<Div align="right" id="idgamesFP" class="score1 col-xs-1"   ></Div>');

var height= 0;



    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);

         $('#idteamname').append('<Div class="bold"  >' + menu.Name + '</Div>');

        $('#idgamesp').append('<Div style="border-left:1px solid lightgray;"  >' + menu.Games + '</Div>');
        $('#idgamesW').append('<Div >' + menu.Won + '</Div>');
        $('#idgamesD').append('<Div   >' + menu.Drawn + '</Div>');
        $('#idgamesL').append( '<Div  >' + menu.Lost + '</Div>');
        $('#idgamesB').append( '<Div  >' + menu.Bonus + '</Div>');
        $('#idgamesF').append('<Div  >' + menu.ForScore + '</Div>');
        $('#idgamesA').append('<Div  >' + menu.AgainstScore + '</Div>');
        $('#idgamesGD').append( '<Div  >' + menu.Difference + '</Div>');
        $('#idgamesFP').append('<Div  >' + (menu.FlagPoints + menu.Bonus) + '</Div>');
        if(i==0) {
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
   // alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}

function getdataminus2(tx) {

    var sql = "select TournamentID from MobileStandings group by TournamentID  ORDER BY TournamentID Desc LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}

function getdataplus(tx) {

    var sql = "select TournamentID from MobileStandings where TournamentID > " + IDt + " group by TournamentID ORDER BY TournamentID ASC LIMIT 1";
   // alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}
function getdataplus2(tx) {

    var sql = "select TournamentID from MobileStandings group by TournamentID  ORDER BY TournamentID ASC LIMIT 1";
  // alert(sql);
    tx.executeSql(sql, [], getstandings_success2);
}




function getpervoiustournie(){
  //  alert("pervoius");

    //alert(firstt + " - " + IDt);


    if (firstt == IDt) {
        db.transaction(getdataminus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataminus, errorCBfunc, successCBfunc);
    }
}
function getnexttournie(){

   // alert(Lastt + " - " + IDt);
//alert("next");
    if (Lastt == IDt) {
        db.transaction(getdataplus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataplus, errorCBfunc, successCBfunc);
    }

}







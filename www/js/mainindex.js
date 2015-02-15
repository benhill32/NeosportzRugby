var db;
var deviceIDfunc;
var year;

document.addEventListener("deviceready", onDeviceReadymainindex, false);

function onDeviceReadymainindex() {
    deviceIDfunc = device.uuid;

    loadindexmessage();
}


function loadindexmessage() {
    db.transaction(checkclubsinsert, errorCBfunc, successCBfunc);
}

function checkclubsinsert(tx){
    var sql = "select ID from MobileApp_clubs";
   //  alert(sql);
    tx.executeSql(sql, [], checkclubsinsert_success);

}

function checkclubsinsert_success(tx, results) {
    var len = results.rows.length;

    if(len != 0) {
        db.transaction(gethasclub, errorCBfunc, successCBfunc);
    }
}

function getbackground(tx) {
   // alert($('#mainbackground').css('opacity'));

    var sql = "select Base64 from MobileApp_clubs where Fav =1 LIMIT 1";
     //alert(sql);
    tx.executeSql(sql, [], getbackground_success);
}

function getbackground_success(tx, results) {

    var len = results.rows.length;
    //alert(len);
    if(len != 0) {
        var menu = results.rows.item(0);

        var base64 = menu.Base64;

        $('#mainbackground').css('background-image', 'url(data:image/png;base64,' + base64 + ')');
    }
}



function gethasclub(tx) {
    var sql = "select hasclub,hasclubdate from MobileApp_LastUpdatesec";
    //  alert(sql);
    tx.executeSql(sql, [], gethasclub_success);
}


function gethasclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);

    var hasclub = menu.hasclub;
    var hasclubdate =menu.hasclubdate;

    var da4 = new Date();
    var na4 = da4.getTime();

    var dif = na4-hasclubdate;


    if(hasclub == 0) {
        //   if(hasclub == 0 && dif > "600000"){
        //  alert($('#mainfore').attr('class'));
        $('#mainfore').removeClass('mainforeground');
        $('#mainfore').addClass('mainforeground2');
        // alert($('#mainfore').attr('class'));
        $('#basicModalnofav').modal('show');

    }

}

function hadclubfunction(){

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 1');
        console.log("Update MobileApp_LastUpdatesec");
    });
    clearcurrentfavteam(344);
  //  passscoretoserver("Favclub=0&deviceid=" + deviceIDfunc + "&token=" + apptoken)


    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');
}


function hadclubchecklater(){
    var daa = new Date();
    var naa = daa.getTime();

    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set hasclub = 0, hasclubdate = "' + naa + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');


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
    $('#mainfore').removeClass('mainforeground2');
    $('#mainfore').addClass('mainforeground');

}

function showregion(){

    db.transaction(getshowregion, errorCBfunc, successCBfunc);
    $('#basicModalregions').modal('show');
    $('#mainfore').removeClass('mainforeground');
    $('#mainfore').addClass('mainforeground2');

}

function loadarchiveyear(){

    $('#basicarchivemodel').modal('show');
    $('#mainfore').removeClass('mainforeground');
    $('#mainfore').addClass('mainforeground2');

    db.transaction(archiveyearben, errorCBfunc, successCBfunc);



}

function archiveyearben(tx) {
    var sql = "select Year from MobileArchiveYears order by Year";
     // alert(sql);
    tx.executeSql(sql, [], archiveyear_success);
}

function archiveyear_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
  //  alert(len);
    $('#archiveyeardiv').empty();
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";

        $('#archiveyeardiv').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="getresultstandings('+ menu.Year + ')"  >' +
        '<div class="bold size13"   >' + menu.Year  +
        '</div>' +
        '</Div>');
    }
}

function getresultstandings(ID){
    year = ID;

    db.transaction(checkresultsloadedarchive, errorCBfunc, successCBfunc);


}


function checkresultsloadedarchive(tx) {
    var sql = "select ID from MobileApp_ResultsArchive order by ID";
    // alert(sql);
    tx.executeSql(sql, [], checkresultsloadedarchive_success);
}

function checkresultsloadedarchive_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;


   if(len != 0){
       showresultssatndingmodel();

   }else{
       showyesnomodel();

   }

}
function showresultssatndingmodel() {
    $('#basicstandingresultmodel').modal('show');
}

function showyesnomodel(){
    $('#basicarchiveyesno').modal('show');

    $('#archiveyearyesNO').empty();
    $('#archiveyearyesNO').append('<Div class="modal-body"  id="archiveyearyes" data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="loadarchiveyeardata('+ year + ')"  >' +
    '<div class="bold size13"   >Yes' +
    '</div>' +
    '</Div>');

    $('#archiveyearyesNO').append('<Div class="modal-body"  id="archiveyearmo" data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="loadarchiveyear()"  >' +
    '<div class="bold size13"   >No ' +
    '</div>' +
    '</Div>');

}

function loadarchivestandresults(id){

    alert(id + "-" + year);

}


function getshowregion(tx) {
    var sql = "select ID ,Name from MobileRegion order by name";
  //  alert(sql);
    tx.executeSql(sql, [], getshowregion_success);
}

function getshowregion_success(tx, results) {
    // $('#busy').hide();
    var len = results.rows.length;
//alert(len);
    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        var imgg = "";

        $('#regiondivID').append('<Div class="modal-body"  data-dismiss="modal" align="left" style="border-bottom: 1px solid #e5e5e5;" onclick="chooseregion('+ menu.ID + ')"  >' +
        '<div class="bold size13"   >' + menu.Name  +
        '</div>' +
        '</Div>');
    }
}

function chooseregion(ID){

    $('#indexloadingdata').modal('show')
    $('#mainfore').removeClass('mainforeground');
    $('#mainfore').addClass('mainforeground2');


    db.transaction(function(tx) {
        tx.executeSql('Update MobileApp_LastUpdatesec set  Region = "' + ID + '"');
        console.log("Update MobileApp_LastUpdatesec");
    });



    refreshdata();

}



function showclubsfun(){

    db.transaction(getclubsfav, errorCBfunc, successCBfunc);
    $('#basicModalteams').modal('show');


    $('#mainfore').removeClass('mainforeground');
    $('#mainfore').addClass('mainforeground2');

}


function getclubsfav(tx) {
    var sql = "select ID,_id ,name,UpdateDateUTC ,Base64,History,Contacts,UpdateSecondsUTC,Color from MobileApp_clubs order by name";
    //alert(sql);
    tx.executeSql(sql, [], getclubsfav_success);
}


function getclubsfav_success(tx, results) {
   // $('#busy').hide();
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







var db;
var IDhist = 0;
var IDcon = 0;
var ID = 0;
var FirstID = 0;
var LastID = 0;
var clubname = 0;
var clubnewfeed = 0;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
 //   db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    console.log("LOCALDB - Database ready");
    db.transaction(getfirstclub, errorCBfunc, successCBfunc);

   // alert("Fav " + window.localStorage.getItem("fliter"));
}




function getfirstclub(tx) {

    var sql = "select ID from MobileApp_clubs WHERE DeletedateUTC = 'null' ORDER BY ID ASC LIMIT 1";
 //   alert(sql);
    tx.executeSql(sql, [], getfirstclub_success);
}


function getfirstclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);


    FirstID = menu.ID;

    db.transaction(getlastclub, errorCBfunc, successCBfunc);

}

function getlastclub(tx) {

    var sql = "select ID from MobileApp_clubs WHERE DeletedateUTC = 'null' ORDER BY ID DESC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getlastclub_success);
}


function getlastclub_success(tx, results) {

    var len = results.rows.length;
    var menu = results.rows.item(0);


    LastID = menu.ID;

    db.transaction(getclub, errorCBfunc, successCBfunc);

}

function getclub(tx) {
    var sql = "";

        if(window.localStorage.getItem("teamfollow") == 0){
            sql = "select ID,_id,Newfeed ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID ASC LIMIT 1";
        }else{
            sql = "select ID,_id,Newfeed ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs WHERE ID = " + window.localStorage.getItem("teamfollow");
        }

        $('#spanleft').show();
        $('#spanright').show();






    tx.executeSql(sql, [], getclub_success);
}


function getclub_success(tx, results) {

    var len = results.rows.length;

    var menu = results.rows.item(0);
    $('#divhistory').empty();
    $('#divContacts').empty();
    $('#divTeams').empty();
    $('#divPlayers').empty();
    $('#btnclub').empty();
    $('#btnclub').empty();
    $('#btnclub').append(menu.name);
    clubname = menu.ID;
    clubnewfeed = menu.Newfeed;
    $('#divhistory').append(menu.History);
   // alert(clubname);

    // parse a string for numbers
    try {
        var numbers = new PhoneNumberParser();

        var contacts = menu.Contacts;

        numbers.parse(contacts);
        var pnumbers = [];
        for (i = 0; i < numbers.items.length; i++) {



            if(jQuery.inArray( numbers.items[i], pnumbers ) == "-1") {
                contacts = contacts.replace(new RegExp(numbers.items[i],'g'),"<a href='tel:" + numbers.items[i] + "'>" + numbers.items[i] + "</a>");
                //
                pnumbers.push(numbers.items[i]);
            }

        }




        var emails = extractEmails(contacts);
        for (i = 0; i < emails.length; i++) {
            contacts = contacts.replace(new RegExp(emails[i],'g'),"<a href='mailto:" + emails[i] + "'>" + emails[i] + "</a>");
        }


        $("#divContacts").append(contacts);
    }
    catch(err) {
        $("#divContacts").append(menu.Contacts);

    }

if(menu.ID == window.localStorage.getItem("teamfollow")){

    $('#spanfullstar').show();
    $('#spanemptystar').hide();


}else{
    $('#spanfullstar').hide();
    $('#spanemptystar').show();


}


    ID = menu.ID;
    $('.panel-info').show();





    db.transaction(getteams, errorCBfunc, successCBfunc);
    db.transaction(getplayers, errorCBfunc, successCBfunc);
}


function addfollow() {
   // alert("add");
    $('#spanfullstar').show();
    $('#spanemptystar').hide();

    addfavteam(clubname);
    //force only one fav
    clearotherfavteam(clubname);

    addfavclub();
    window.localStorage.setItem("teamfollow", clubname);
    window.localStorage.setItem("teamnewfeed", clubnewfeed);
    checksendnews();
}

function removefollow() {
    //alert("remove");
    $('#spanfullstar').hide();
    $('#spanemptystar').show();

    clearcurrentfavteam(clubname);
    window.localStorage.setItem("teamfollow", "0");
    window.localStorage.setItem("teamnewfeed", "0");
    if(window.localStorage.getItem("fliter") == 1) {
        window.localStorage.setItem("fliter", "0");

        db.transaction(function(tx) {
            tx.executeSql('Update MobileApp_LastUpdatesec set fliterON = 0');
        });
       // $("#switch-filter").prop("checked", false );
        //location.reload(true);

      //  db.transaction(getfirstclub, errorCBfunc, successCBfunc);
    }

    checksendnews();



}




function getdataminus(tx) {

    var sql = "select ID,_id,Newfeed ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs where ID < " + ID + "  ORDER BY ID Desc LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getdataminus2(tx) {

    var sql = "select ID,_id,Newfeed ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID Desc LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}

function getdataplus(tx) {

    var sql = "select ID,_id,Newfeed ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs where ID > " + ID + " ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}
function getdataplus2(tx) {

    var sql = "select ID,_id,Newfeed ,name,UpdateDateUTC ,Base64,replace(History, '###$$###', '<br>') as History,replace(Contacts, '###$$###', '<br>') as Contacts,UpdateSecondsUTC,Color from MobileApp_clubs ORDER BY ID ASC LIMIT 1";
    //alert(sql);
    tx.executeSql(sql, [], getMenu_success);
}


function getMenu_success(tx, results) {

    var len = results.rows.length;
//alert(len);
    $('#divhistory').empty();
    $('#divContacts').empty();
    $('#divTeams').empty();
    $('#divPlayers').empty();
    $('#btnclub').empty();

        var menu = results.rows.item(0);
        var imgg = "";





    clubname = menu.ID;
    clubnewfeed = menu.Newfeed
  //  alert(clubname);
    if(menu.ID == window.localStorage.getItem("teamfollow")){

        $('#spanfullstar').show();
        $('#spanemptystar').hide();


    }else{
        $('#spanfullstar').hide();
        $('#spanemptystar').show();


    }






    $('#btnclub').append(menu.name);
    ID = menu.ID;


        $('#divhistory').append(menu.History);


    try {
    var numbers = new PhoneNumberParser();

    var contacts = menu.Contacts;

    numbers.parse(contacts);
    var pnumbers = [];
    for (i = 0; i < numbers.items.length; i++) {



        if(jQuery.inArray( numbers.items[i], pnumbers ) == "-1") {
            contacts = contacts.replace(new RegExp(numbers.items[i],'g'),"<a href='tel:" + numbers.items[i] + "'>" + numbers.items[i] + "</a>");
            //
            pnumbers.push(numbers.items[i]);
        }

    }




    var emails = extractEmails(contacts);
    for (i = 0; i < emails.length; i++) {
        contacts = contacts.replace(new RegExp(emails[i],'g'),"<a href='mailto:" + emails[i] + "'>" + emails[i] + "</a>");
    }


    $("#divContacts").append(contacts);
    }
    catch(err) {
        $("#divContacts").append(menu.Contacts);

    }

    db.transaction(getteams, errorCBfunc, successCBfunc);
    db.transaction(getplayers, errorCBfunc, successCBfunc);
    $('.panel-info').show();
}


function getpervoiusclub(){

        if (FirstID == ID) {
            db.transaction(getdataminus2, errorCBfunc, successCBfunc);
        } else {
            db.transaction(getdataminus, errorCBfunc, successCBfunc);
        }


}
function getnextclub(){


    if (LastID == ID) {
        db.transaction(getdataplus2, errorCBfunc, successCBfunc);
    } else {
        db.transaction(getdataplus, errorCBfunc, successCBfunc);
    }



}


function getteams(tx) {
    var sql = "select ID, Name ,DivisionName,ClubID from MobileApp_vwApp_Teams where ClubID=" + ID;
    tx.executeSql(sql, [], getteam_success);
}


function getteam_success(tx, results) {

    var len = results.rows.length;
    $("#divcreateteams").empty();

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);
        $('#divTeams').append(menu.Name + " - " + menu.DivisionName + "<br>");

        $("#divcreateteams").append('<div class="panel panel-info">' +
            '<div class="panel-heading">' + menu.DivisionName + '</div>' +
            '<div class="panel-body" id="divTeamss' + menu.ID + '">' +
            '</div>' +
            '</div>' +
        '');



    }

}

function getplayers(tx) {
    var sql = "select ID,_id,ClubID,FullName,Base64,TeamID,Position from MobilevwApp_Base_Players where DeletedateUTC = 'null' and ClubID=" + ID;
    // alert(sql);
    tx.executeSql(sql, [], getteamplayer_success);
}

function getteamplayer_success(tx, results) {

    var len = results.rows.length;

    for (var i=0; i<len; i++) {
        var menu = results.rows.item(i);



        $('#divPlayers').append(menu.FullName + " - " + menu.Position + "<br>");


        $("#divTeamss" + menu.TeamID).append(menu.FullName + " - " + menu.Position + "<br>");


    }



}


var PhoneNumberParser = function() {

    var minimum = 9;            // typical minimum phone number length
    this.items = [];

    var public = PhoneNumberParser.prototype;
    public.parse = function(str) {
        var items = this.items = [];

        var i = 0, n = '', min = minimum;

        while(i < str.length) {
            switch(str[i]) {
                case '+':                                   // start of international number
                    if (n.length >= min) items.push(n);
                    n = str[i];
                    min = minimum + 2;                      // at least 2 more chars in number
                    break;
                case '-': case '.': case '(': case ')':     // ignore punctuation
                break;
                case ' ':
                    if (n.length >= min) {              // space after consuming enough digits is end of number
                        items.push(n);
                        n = '';
                    }
                    break;
                default:
                    if (str[i].match(/[0-9]/)) {            // add digit to number
                        n += str[i];
                        if (n.length == 1 && n != '0') {
                            min = 3;                        // local number (extension possibly)
                        }
                    } else {
                        if (n.length >= min) {
                            items.push(n);                  // else end of number
                        }
                        n = '';
                    }
                    break;
            }
            i++;
        }

        if (n.length >= min) {              // EOF
            items.push(n);
        }
    }


};

function extractEmails (text)
{
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}



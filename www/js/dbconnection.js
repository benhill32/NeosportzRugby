var db;
var deviceplatformdb;
document.addEventListener("deviceready", onDeviceReadydbconn, false);


function onDeviceReadydbconn() {
    deviceplatformdb = device.platform;

    if(deviceplatformdb == "iOS"){
      //  alert(deviceplatformdb);
       // db = window.sqlitePlugin.openDatabase("../Library/Caches/NeosportzFootball", "1.1", "Neosportz_Football", 200000);

        var db = window.sqlitePlugin.openDatabase({name: "Neosportz_Football", location: 1}, successCBfunc, errorCBfunc);
    }else if(deviceplatformdb == "Android"){
       // alert(deviceplatformdb);
       // db = window.sqlitePlugin.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
        var db = window.sqlitePlugin.openDatabase({name: "Neosportz_Football", androidDatabaseImplementation: 2, androidLockWorkaround: 1}, successCBfunc, errorCBfunc);

    }
}


//db = window.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);


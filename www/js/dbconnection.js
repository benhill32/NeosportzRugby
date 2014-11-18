var db;
var deviceplatformdb;
document.addEventListener("deviceready", onDeviceReadydbconn, false);


function onDeviceReadydbconn() {
    deviceplatformdb = device.platform;

    if(deviceplatformdb == "iOS"){
      //  alert(deviceplatformdb);
        db = window.sqlitePlugin.openDatabase("../Library/Caches/NeosportzFootball", "1.1", "Neosportz_Football", 200000);
    }else if(deviceplatformdb == "Android"){
       // alert(deviceplatformdb);
        db = window.sqlitePlugin.openDatabase("Neosportz_Football", "1.1", "Neosportz_Football", 200000);
    }
}
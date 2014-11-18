var db;
var deviceplatformdb;
document.addEventListener("deviceready", onDeviceReadydbconn, false);


function onDeviceReadydbconn() {
    deviceplatformdb = device.platform;

    if(deviceplatformdb == "iOS"){
        alert(deviceplatformdb);
        db = window.sqlitePlugin.openDatabase("../Library/Caches/NeosportzRugby", "1.1", "NeosportzRugby", 200000);
    }else if(deviceplatformdb == "Android"){
        alert(deviceplatformdb);
        db = window.sqlitePlugin.openDatabase("NeosportzRugby", "1.1", "NeosportzRugby", 200000);
    }
}
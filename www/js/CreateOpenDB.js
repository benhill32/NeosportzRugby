
function droptables(){


    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Results_Menu ');
        console.log("MobileApp_Results_Menu table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Schedule_Menu ');
        console.log("MobileApp_Schedule_Menu table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_LastUpdatesec ');
        console.log("MobileApp_LastUpdatesec table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Results ');
        console.log("MobileApp_Results table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_clubs ');
        console.log("MobileApp_clubs table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Schedule ');
        console.log("MobileApp_Schedule table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_clubsimages ');
        console.log("MobileApp_clubsimages table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_vwApp_Teams ');
        console.log("MobileApp_vwApp_Teams table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobilevwApp_Base_Players ');
        console.log("MobilevwApp_Base_Players table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobilevwApp_News_v_2 ');
        console.log("MobilevwApp_News_v_2 table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileApp_Players_Images ');
        console.log("MobileApp_Players_Images table is Dropped");
    });
    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileStandings ');
        console.log("MobileStandings table is Dropped");
    });

    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE Mobilesponsorsclub ');
        console.log("Mobilesponsorsclub table is Dropped");
    });

    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE Mobilesponsorsclub ');
        console.log("Mobilesponsorsclub table is Dropped");
    });

    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE MobileScoringTable ');
        console.log("MobileScoringTable table is Dropped");
    })

    db.transaction(function(tx) {
        tx.executeSql('Drop TABLE Mobilescoringbreakdown ');
        console.log("Mobilescoringbreakdown table is Dropped");
    });

}

function createDB(tx) {




    //  tx.executeSql('Drop TABLE MobileApp_LastUpdatesec ');
    //  console.log("MobileApp_LastUpdatesec table is Dropped");
    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_LastUpdatesec (Datesecs TEXT NULL, datemenus TEXT NULL,syncwifi INTEGER NOT NULL,isadmin INTERGER NOT NULL,token TEXT NOT NULL,hasclub INTERGER NOT NULL,hasclubdate TEXT NULL,fliterON INTERGER  NULL)');
    console.log("MobileApp_LastUpdatesec table is created");
    //   tx.executeSql('INSERT INTO MobileApp_LastUpdatesec (Datesecs,datemenus) VALUES ("0", "0" )');
    //   console.log("INSERT INTO MobileApp_LastUpdatesec");
    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Results (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,DatetimeStart TEXT NOT NULL,HomeName TEXT NOT NULL,AwayName TEXT NOT NULL,Field TEXT NOT NULL,Latitude TEXT NOT NULL,Longitude TEXT NOT NULL,DivisionID INTEGER NOT NULL,DivisionName TEXT NOT NULL,HomeClubID INTEGER NOT NULL,AwayClubID INTEGER NOT NULL,HomeTeamID INTEGER NOT NULL,AwayTeamID INTEGER NOT NULL,HomeScore INTEGER NOT NULL,AwayScore INTEGER NOT NULL,UpdateDateUTC TEXT NOT NULL,TournamentName TEXT NOT NULL,TournamentID INTEGER NOT NULL,DatetimeStartSeconds TEXT NOT NULL,DivisionOrderID INTEGER NOT NULL,ShowToAll INTEGER NOT NULL,Semi INTEGER NOT NULL,Final INTEGER NOT NULL,DeletedateUTC TEXT NOT NULL,halftime TEXT NOT NULL,fulltime TEXT NOT NULL )');
    console.log("MobileApp_Results table is created");
    // tx.executeSql('Drop TABLE MobileApp_clubs ');
    // console.log("MobileApp_Results_Menu table is Dropped");
    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_clubs (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,name TEXT NOT NULL,UpdateDateUTC TEXT NOT NULL,UpdateDateUTCBase64 TEXT NOT NULL,Base64 TEXT NOT NULL,History TEXT NOT NULL,Contacts TEXT NOT NULL,UpdateSecondsUTC TEXT NOT NULL,UpdateSecondsUTCBase64 TEXT NOT NULL,Color TEXT NOT NULL, Fav INTEGER NOT NULL, Follow INTEGER NOT NULL,DeletedateUTC  TEXT NOT NULL )');
    console.log("Mobileclubs table is created");
    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Schedule (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,DatetimeStart TEXT NOT NULL,HomeName TEXT NOT NULL,AwayName TEXT NOT NULL,Field TEXT NOT NULL,Latitude TEXT NOT NULL,Longitude TEXT NOT NULL,DivisionID INTEGER NOT NULL,DivisionName TEXT NOT NULL,HomeClubID INTEGER NOT NULL,AwayClubID INTEGER NOT NULL,HomeTeamID INTEGER NOT NULL,AwayTeamID INTEGER NOT NULL,UpdateDateUTC TEXT NOT NULL,TournamentName TEXT NOT NULL,TournamentID INTEGER NOT NULL,DatetimeStartSeconds TEXT NOT NULL,DivisionOrderID INTEGER NOT NULL,ShowToAll INTEGER NOT NULL,Semi INTEGER NOT NULL,Final INTEGER NOT NULL,Cancel INTEGER NOT NULL,DeletedateUTC TEXT NOT NULL,halftime TEXT NOT NULL,fulltime TEXT NOT NULL )');
    console.log("MobileApp_Schedule table is created");
    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_clubsimages (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,UpdateDateUTCBase64 TEXT NULL,Base64 TEXT NULL,UpdateSecondsUTCBase64 TEXT NOT NULL)');
    console.log("MobileApp_clubsimages table is created");
    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_vwApp_Teams (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,Name TEXT NOT NULL,Base64 TEXT NULL,ClubID INTEGER NOT NULL,DivisionID INTEGER NOT NULL,DivisionName TEXT NOT NULL,UpdateSecondsUTC TEXT NOT NULL,UpdateSecondsUTCBase64 TEXT NOT NULL,UpdateDateUTC TEXT NOT NULL,UpdateDateUTCBase64 TEXT NOT NULL,DeletedateUTC TEXT NOT NULL)');
    console.log("MobileApp_vwApp_Teams table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobilevwApp_Base_Players (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,ClubID INTEGER NOT NULL,FullName TEXT NOT NULL,Base64 TEXT NULL,TeamID INTEGER NOT NULL,UpdateSecondsUTC TEXT NOT NULL,UpdateSecondsUTCBase64 TEXT NOT NULL,UpdateDateUTC TEXT NOT NULL,UpdateDateUTCBase64 TEXT NOT NULL,Position TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,NickName TEXT NOT NULL,Height TEXT NOT NULL,Weight TEXT NOT NULL,DOB TEXT NOT NULL,BirthPlace TEXT NOT NULL,SquadNo TEXT NOT NULL,Nationality TEXT NOT NULL,Honours TEXT NOT NULL,Previous_Clubs TEXT NOT NULL,memorable_match TEXT NOT NULL,Favourite_player TEXT NOT NULL,Toughest_Opponent TEXT NOT NULL,Biggest_influence TEXT NOT NULL,person_admire TEXT NOT NULL,Best_goal_Scored TEXT NOT NULL,Hobbies TEXT NOT NULL,be_anyone_for_a_day TEXT NOT NULL)');
    console.log("MobilevwApp_Base_Players table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileApp_Players_Images (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,Base64 TEXT NULL,UpdateDateUTCBase64 TEXT NOT NULL,UpdateSecondsUTCBase64 TEXT NOT NULL,DeletedateUTC TEXT NOT NULL)');
    console.log("MobileApp_Players_Images table is created");
    //alert('CREATE TABLE IF NOT EXISTS MobilevwApp_News_v_2 (ID INTEGER NOT NULL,_id INTEGER NOT NULL,UpdateDateUTC TEXT NULL,Title TEXT NOT NULL,Body NOT TEXT NULL,ClubID INTEGER NOT NULL,TeamID INTEGER NULL,Hide INTEGER NULL,IsAd INTEGER NULL,Base64 TEXT NULL,URL TEXT NULL,Hint TEXT NULL,DisplayDateUTC TEXT NOT NULL,DisplaySecondsUTC TEXT NOT NULL');

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobilevwApp_News_v_2 (ID INTEGER NOT NULL primary key,_id INTEGER NOT NULL,UpdateDateUTC TEXT NULL,Title TEXT NOT NULL,Body TEXT NULL,ClubID INTEGER NOT NULL,TeamID TEXT NULL,Hide TEXT NULL,IsAd TEXT NULL,Base64 TEXT NULL,URL TEXT NULL,Hint TEXT NULL,DisplayDateUTC TEXT NOT NULL,DisplaySecondsUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL,FromPhone Text NOT NULL)');
    console.log("MobilevwApp_News_v_2 table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileScoringTable (ID INTEGER NOT NULL primary key,Name TEXT NOT NULL, Value INTEGER NOT NULL,UpdatedateUTC TEXT NOT NULL,DeletedateUTC TEXT NOT NULL)');
    console.log("MobileScoringTable table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS MobileStandings (_id INTEGER NOT NULL primary key,Games INTEGER NOT NULL,Won INTEGER NOT NULL,Drawn INTEGER NOT NULL,Lost INTEGER NOT NULL,ForScore INTEGER NOT NULL,AgainstScore INTEGER NOT NULL,Difference INTEGER NOT NULL,ClubID INTEGER NOT NULL,Name TEXT NULL,TournamentID INTEGER NOT NULL,FlagPoints INTEGER NOT NULL,UpdateDateUTC TEXT NULL,TournamentName TEXT NULL,DeletedateUTC TEXT NOT NULL)');
    console.log("MobileStandings table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS Mobilesponsorsclub (ID INTEGER NOT NULL primary key,Datetime TEXT NULL,Club INTEGER NOT NULL,Name TEXT NOT NULL,Website TEXT NULL,Image TEXT NULL,UserID TEXT NULL,OrderBy INTEGER NULL,Base64 TEXT NULL,CreatedateUTC TEXT NULL,UpdatedateUTC TEXT NULL,DeletedateUTC TEXT NULL,UpdatedateUTCBase64 TEXT NULL)');
    console.log("Mobilesponsorsclub table is created");


    tx.executeSql('CREATE TABLE IF NOT EXISTS Mobilescreenimage (_id INTEGER NOT NULL primary key,Base64 TEXT NULL,BackgroundColor TEXT NULL,SoftwareFade TEXT NULL,UpdateDateUTC TEXT NULL,TopText TEXT NULL,BottomText TEXT NULL)');
    console.log("Mobilescreenimage table is created");

    tx.executeSql('CREATE TABLE IF NOT EXISTS Mobilescoringbreakdown (ID INTEGER NOT NULL primary key,CreatedateUTC TEXT NULL,UpdatedateUTC TEXT NULL,DeletedateUTC TEXT NULL,TeamID INTEGER NOT NULL,GameID INTEGER NOT NULL,PlayerID INTEGER NOT NULL,ScoringID INTEGER NOT NULL,Time TEXT NULL)');
    console.log("Mobilescoringbreakdown table is created");
}



function CleanDB() {

        db.transaction(function (tx) {
            tx.executeSql('Delete from MobileApp_Results where DeletedateUTC != "null"');
            console.log('Clean MobileApp_Results where ID');
        });

    db.transaction(function(tx) {
            tx.executeSql('Delete from MobileApp_clubs where DeletedateUTC != "null"');
            console.log('Clean MobileApp_clubs where ID');
    });

    db.transaction(function(tx) {
            tx.executeSql('Delete from MobileApp_Schedule where DeletedateUTC != "null"');
            console.log('Clean MobileApp_Schedule where ID');
    });


    db.transaction(function(tx) {
            tx.executeSql('Delete from MobileApp_vwApp_Teams where DeletedateUTC != "null"');
            console.log('Clean MobileApp_vwApp_Teams where ID');
    });

    db.transaction(function(tx) {
            tx.executeSql('Delete from MobilevwApp_News_v_2 where DeletedateUTC != "null"');
            console.log('Clean MobilevwApp_News_v_2 where ID');
    });

    db.transaction(function(tx) {
            tx.executeSql('Delete from MobilevwApp_Base_Players where DeletedateUTC != "null"');
            console.log('Clean MobilevwApp_Base_Players where ID');
    });

    db.transaction(function(tx) {
            tx.executeSql('Delete from MobileApp_Players_Images where DeletedateUTC != "null"');
            console.log('Clean MobileApp_Players_Images where ID');
    });

    db.transaction(function(tx) {
            tx.executeSql('Delete from Mobilesponsorsclub where DeletedateUTC != "null"');
            console.log('Clean Mobilesponsorsclub');
        });



}




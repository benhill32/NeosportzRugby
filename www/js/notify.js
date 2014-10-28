var gcm = require('../lib/node-gcm');
var message = new gcm.Message();

//API Server Key
var sender = new gcm.Sender('AIzaSyA85VeqbrA-HsfNE4_DkiBSRH6dFQ9_oiw');
var registrationIds = [];

// Value the payload data to send...
message.addData('message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
message.addData('title','Push Notification Sample' );
message.addData('msgcnt','3'); // Shows up in the notification in the status bar
message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

// At least one reg id required
registrationIds.push('APA91bHjeyxOoiq35HLzoIcxe5YJNL8cxSNOetYHAz836G1N6DBpEOXI3oQkr8RSp-cCgX0t5wYSI-U5JrExndCjL9r1pewD943euTXS3jF3UVg43xSD9i8SHo_wcObbiX97n5gkuRw80mPGtjZmqLo4BPCqk1Tkpw');

/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function (result) {
    console.log(result);
});

require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyA85VeqbrA-HsfNE4_DkiBSRH6dFQ9_oiw"
destination = ["APA91bHjeyxOoiq35HLzoIcxe5YJNL8cxSNOetYHAz836G1N6DBpEOXI3oQkr8RSp-cCgX0t5wYSI-U5JrExndCjL9r1pewD943euTXS3jF3UVg43xSD9i8SHo_wcObbiX97n5gkuRw80mPGtjZmqLo4BPCqk1Tkpw"]
data = {:message => "PhoneGap Build rocks!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)

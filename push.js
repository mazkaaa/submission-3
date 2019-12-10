var webPush = require('web-push');
 
const vapidKeys = {
	"publicKey": "BLGyOU_n3bJwvIKfFWPLpE5SnhJnZG-_D68890m0Gw0XexinN9U_Oj06DEGJ7u9FuIiPU-Le9Ij_18VYeiXmdcU",
	"privateKey": "g2L5arRCJnEXltekmyB49WhN51XNPl7daAt81MMPVrA"
};
 
 
webPush.setVapidDetails(
	'mailto:hello.mazka@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)
var pushSubscription = {
	"endpoint": "https://fcm.googleapis.com/fcm/send/fD0Vo8qapDE:APA91bGH0OzszP5fSzut2HAxEU_3ck26DdCmZ3jf0CNUtT1iQKCdpVVItO3JGTTf1m8If5WvTgn8wCLX0MjXjcyHH-BGRruEVQ50Rc2yNPG7Rd1pqPbMhnmsLdQbF-BmHGYz5Veb-aar",
	"keys": {
		"p256dh": "BHAtPTbHmyUotrH1tMispCp0DTPixLcXZhsbusrxvRxFhYT0GKsY0W8UJZugcHOo/lzemcwqC5F9yrLKIQZWmfs=",
		"auth": "L+oNtvdqW703qpXzvZg7mw=="
	}
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
	gcmAPIKey: '484973273532',
	TTL: 60
};
webPush.sendNotification(
	pushSubscription,
	payload,
	options
);
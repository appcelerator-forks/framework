/*** Mobile Framework by GEONN SOLUTION 1.0***/
//Global function and variable declaration

var _ = require('underscore')._;
var API = require('api');
var COMMON = require('common'); 
var PUSH = require('push');
var DBVersionControl = require('DBVersionControl');

DBVersionControl.checkAndUpdate();

//register for push
//PUSH.registerPush();
//if (OS_IOS) {
//	Titanium.UI.iPhone.setAppBadge("0");
//}
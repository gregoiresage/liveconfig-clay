var appinfo = require('../../appinfo.json');

var liveconfig = require('liveconfig');

var Clay = require('clay');
var clayConfig = require('config.json');
// patch the configuration
clayConfig.push({ "type": "text", "id" : "UUID", "defaultValue": appinfo.uuid });
clayConfig.push({ "type": "text", "id" : "WATCHTOKEN", "defaultValue": Pebble.getWatchToken() });

var customClay = require('custom-clay');
var clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});

Pebble.addEventListener('showConfiguration', function(e) {
  liveconfig.connect(appinfo.uuid, function(id, value) {
    var config = {};
    config[id] = value;
    console.log(JSON.stringify(config));
    Pebble.sendAppMessage(config);
  });

  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) { return; }

  // Send settings to Pebble watchapp
  Pebble.sendAppMessage(clay.getSettings(e.response), function(e) {
    console.log('Sent config data to Pebble');
  }, function() {
    console.log('Failed to send config data!');
    console.log(JSON.stringify(e));
  });
});
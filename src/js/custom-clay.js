module.exports = function(minified) {
  var Clay = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;

  Clay.on(Clay.EVENTS.AFTER_BUILD, function() {
    var uuid = Clay.getItemById('UUID').get();
    var watchtoken = Clay.getItemById('WATCHTOKEN').get();
    var connection = new WebSocket("wss://liveconfig.fletchto99.com/forward/" + uuid + "/" + watchtoken);
    connection.onopen = function() {
        connection.send(JSON.stringify({id: 'background', value: 65535}));

        var onchange = function() {
          connection.send(JSON.stringify({id: this.id, value: this.get()}));
        };
      
        Clay.getItemByAppKey('enableBackground').on('change', onchange);
        Clay.getItemByAppKey('background').on('change', onchange);
    };
    // hack to hide the texts
    Clay.getItemById('UUID').set('');
    Clay.getItemById('WATCHTOKEN').set('');
  });
};
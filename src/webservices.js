var request = require("request");
var x2j = require("xml2json");
var API_KEY = "CCBDC1DA89F160AF"

var find_show_by_name = function(name, cb) {
    var url = "http://thetvdb.com/api/GetSeries.php?seriesname="+name;
    std_request(url, cb);
};

var find_episode = function(show_id, season, episode, cb) {
    var url = "http://thetvdb.com/api/" + API_KEY + "/series/"
    + show_id + "/default/" + season + "/" + episode + "/en.xml";
    std_request(url, cb);
};

var std_request = function(url, cb) {
    request(url, function (error, response, body) {
        var err = null;
        var val = null;
        if (response.statusCode === 200) {
            val = x2j.toJson(body, {object: true, sanitize: false});
            if (val.Error) {
                err = val.Error;
                val = null;
            }
            cb(err, val);
        } else {
            cb("Could not complete the request", null);
        }
    });
};

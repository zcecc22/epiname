var PATTERNS = [/S(\d{1,2})E(\d{1,2})/i,
                /(\d{1,2})X(\d{1,2})/i,
                /Season (\d{1,2}) Episode (\d{1,2})/i];

var get_media_info = function(filename) {
    var value = null;
    for (var i = 0; i < PATTERNS.length; i++) {
        if(PATTERNS[i].test(filename)) {
            value = {};
            s_str = filename.split(PATTERNS[i]);
            value.season = parseInt(s_str[1], 10).toString();
            value.episode = parseInt(s_str[2], 10).toString();
            value.seriesname = s_str[0].replace(/\W+/g, " ").trim();
            break;
        }
    };

    return value;
};

exports.get_media_info = get_media_info;

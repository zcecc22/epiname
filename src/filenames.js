var SHOW_PATTERNS = [/S(\d{1,2})E(\d{1,2})/i,
                /(\d{1,2})X(\d{1,2})/i,
                /Season (\d{1,2}) Episode (\d{1,2})/i,
                /(\d{1})(\d{2})/i];

var MOVIE_PATTERNS = [/(\d{4})/i];

var get_show_info = function(filename) {
    var value = null;
    for (var i = 0; i < SHOW_PATTERNS.length; i++) {
        if(SHOW_PATTERNS[i].test(filename)) {
            value = {};
            s_str = filename.split(SHOW_PATTERNS[i]);
            value.season = parseInt(s_str[1], 10).toString();
            value.episode = parseInt(s_str[2], 10).toString();
            value.seriesname = s_str[0].replace(/\W+/g, " ").trim();
            break;
        }
    };

    return value;
};

var get_movie_info = function(filename) {
    var value = null;
    for (var i = 0; i < MOVIE_PATTERNS.length; i++) {
        if(MOVIE_PATTERNS[i].test(filename)) {
            value = {};
            s_str = filename.split(MOVIE_PATTERNS[i]);
            value.moviename = s_str[0].replace(/\W+/g, " ").trim();
            value.year = s_str[1].toString();
            break;
        }
    };

    return value;
};

exports.get_show_info = get_show_info;
exports.get_movie_info = get_movie_info;

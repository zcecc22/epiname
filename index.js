#!/usr/bin/env node

var ws = require('./src/webservices');
var fn = require('./src/filenames');
var program = require('commander');
var promptly = require('promptly');
var async = require('async');
var path = require('path');
var fs = require('fs');

var rename_show = function(file_path, seriesname, seriesid, season, episode) {
    ws.find_episode(seriesid, season, episode,
        function(err, episode_obj) {
            if(err){
                console.log('An Error Occured:');
                console.log(err);
            } else {
                if(season.length == 1) season = '0' + season;
                if(episode.length == 1) episode = '0' + episode;
                var new_name = seriesname + '.S'
                    + season + 'E' + episode + '.'
                    + episode_obj.EpisodeName + path.extname(file_path);
                console.log(file_path + ' -> ' + new_name);
                fs.renameSync(file_path, path.join(path.dirname(file_path), new_name));
            }
        });
};

var get_show_list = function(shows) {
    var l = [];
    for (var i = 0; i < shows.length; i++) {
        l.push(shows[i].SeriesName);
    };
    return l;
};

function list(val) {
  return val.split(',');
}

program.version('0.0.1');
program.option('-m, --movie', 'Enable Movie mode. (Default set to TV Show mode.)');
program.parse(process.argv);

async.each(program.args, function(item, callback){
    var file_path = item;
    if(fs.existsSync(file_path)){
        var filename = path.basename(file_path);

        if(program.movie){
            //Movie Mode
        } else {

            var show_info = fn.get_show_info(filename);
            ws.find_show_by_name(show_info.seriesname, function(err, shows) {
                if(err){
                    console.log('An Error Occured:');
                    console.log(err);
                } else {
                    if(shows.length > 1){
                        setTimeout(function() {
                            promptly.prompt('', function(err, value) {
                                    index = parseInt(value, 10) - 1;
                                    rename_show(file_path, shows[index].SeriesName,
                                    shows[index].seriesid, show_info.season, show_info.episode);
                                });
                            console.log('Please enter N° of matching show for: ['
                                + show_info.seriesname + ']');
                            var l = get_show_list(shows);
                            for (var i = 0; i < l.length; i++) {
                                console.log((i+1).toString() + ': ' + l[i]);
                            };

                        }, 3000);

                    } else if (shows.length == 1) {
                        rename_show(file_path, shows[0].SeriesName,
                            shows[0].seriesid, show_info.season, show_info.episode);
                    } else if (shows.length == 0) {
                        console.log('No match found for: ' + show_info.seriesname);
                    }
                }
            });
        }
    } else {
        console.log('Input file[' + file_path + '] does not exist.');
    }
    callback(null);
},  function(err){});


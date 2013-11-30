#!/usr/bin/env node

var ws = require('./src/webservices');
var fn = require('./src/filenames');
var program = require('commander');
var promptly = require('promptly');
var path = require('path');
var fs = require('fs');

var rename_show = function(file_path, seriesname, seriesid, season, episode) {
    console.log('Matching Show Name: ' + seriesname +
                        ' [ID:' + seriesid + ']');
    ws.find_episode(seriesid, season, episode,
        function(err, episode) {
            if(err){
                console.log('An Error Occured:');
                console.log(err);
            } else {
                console.log('Matching Episode Name: ' + episode.EpisodeName);
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

program.version('0.0.1');
program.option('-m, --movie', 'Enable Movie mode. (Default set to TV Show mode.)');
program.option('-f, --file [file]', 'File to rename.');
program.parse(process.argv);

if(program.file && fs.existsSync(program.file)){
    var filename = path.basename(program.file);

    if(program.movie){
        console.log('Input file: ' + filename + ' [Movie]');
    } else {
        console.log('Input file: ' + filename + ' [Show]');
        var show_info = fn.get_show_info(filename);
        console.log('Show Name: ' + show_info.seriesname + '/S:'
            + show_info.season + '/E:' + show_info.episode);
        ws.find_show_by_name(show_info.seriesname, function(err, shows) {
            if(err){
                console.log('An Error Occured:');
                console.log(err);
            } else {
                if(shows.length > 1){
                    var l = get_show_list(shows);
                    for (var i = 0; i < l.length; i++) {
                        console.log((i+1).toString() + ': ' + l[i]);
                    };
                    promptly.prompt('Please enter N° of matching show.', function(err, value) {
                        index = parseInt(value, 10) - 1;
                        rename_show(program.file, shows[index].SeriesName,
                        shows[index].seriesid, show_info.season, show_info.episode);
                    });
                } else if (shows.length == 1) {
                    rename_show(program.file, shows[0].SeriesName,
                        shows[0].seriesid, show_info.season, show_info.episode);
                } else if (shows.length == 0) {
                    console.log('No match found.');
                }
            }
        });
    }
} else {
    console.log('Input file not specified or does not exist.');
}


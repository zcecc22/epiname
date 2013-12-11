#!/usr/bin/env node

var ws = require("./src/webservices");
var fn = require("./src/filenames");
var program = require("commander");
var promptly = require("promptly");
var async = require("async");
var path = require("path");
var fs = require("fs");

var rename_show = function(file_path, seriesname, seriesid, season, episode) {
    ws.find_episode(seriesid, season, episode,
        function(err, episode_obj) {
            if(err){
                console.log("An Error Occured:");
                console.log(err);
            } else {
                if(season.length == 1) season = "0" + season;
                if(episode.length == 1) episode = "0" + episode;
                var new_name = seriesname + ".S"
                    + season + "E" + episode + "."
                    + episode_obj.EpisodeName + path.extname(file_path);
                console.log(file_path + " -> " + new_name);
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

var name_to_show = {};

program.version("0.0.1");
program.parse(process.argv);

async.eachSeries(program.args, function(item, callback){
    var file_path = item;
    if(fs.existsSync(file_path)){
        var filename = path.basename(file_path);
        var show_info = fn.get_show_info(filename);

        if(show_info === null){
            var movie_info = fn.get_movie_info(filename);
            if(movie_info === null){
                console.log("No pattern match for " + filename + " .");
                callback(null);
            } else {
                //MM
            }
        } else {
            if(show_info.seriesname in name_to_show){
                var show_o = name_to_show[show_info.seriesname];
                rename_show(file_path, show_o.SeriesName,
                            show_o.seriesid, show_info.season, show_info.episode);
                callback(null);
            } else {
                ws.find_show_by_name(show_info.seriesname, function(err, shows) {
                    if(err){
                        console.log("An Error Occured:");
                        console.log(err);
                        callback(null);
                    } else {
                        if(shows.length > 1){
                            setTimeout(function() {
                                promptly.prompt("", function(err, value) {
                                        index = parseInt(value, 10) - 1;
                                        name_to_show[show_info.seriesname] = shows[index];
                                        rename_show(file_path, shows[index].SeriesName,
                                        shows[index].seriesid, show_info.season, show_info.episode);
                                        callback(null);
                                    });
                                console.log("Please enter N° of matching show for: ["
                                    + show_info.seriesname + "]");
                                var l = get_show_list(shows);
                                for (var i = 0; i < l.length; i++) {
                                    console.log((i+1).toString() + ": " + l[i]);
                                };

                            }, 100);

                        } else if (shows.length == 1) {
                            name_to_show[show_info.seriesname] = shows[0];
                            rename_show(file_path, shows[0].SeriesName,
                                shows[0].seriesid, show_info.season, show_info.episode);
                            callback(null);
                        } else if (shows.length == 0) {
                            console.log("No match found for: " + show_info.seriesname);
                            callback(null);
                        }
                    }
                });
            }
        }
    } else {
        console.log("Input file [" + file_path + "] does not exist.");
        callback(null);
    }
},  function(err){});


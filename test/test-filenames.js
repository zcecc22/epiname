var assert  = require("assert");
var fn = require("../src/filenames");

describe("Filenames", function() {

  it("get show info should parse filenames", function() {
    res = fn.get_show_info("The.Big.Bang.Theory.S01E02.Release.1999.mp4");
    assert.equal('1', res.season);
    assert.equal('2', res.episode);
    assert.equal('The Big Bang Theory', res.seriesname);
  });

  it("get show info should parse filenames", function() {
    res = fn.get_show_info("The.Big.Bang.Theory.s01e02.Release.1999.mp4");
    assert.equal('1', res.season);
    assert.equal('2', res.episode);
    assert.equal('The Big Bang Theory', res.seriesname);
  });

  it("get show info should parse filenames", function() {
    res = fn.get_show_info("The.Big.Bang.Theory.1x2.Release.1999.mp4");
    assert.equal('1', res.season);
    assert.equal('2', res.episode);
    assert.equal('The Big Bang Theory', res.seriesname);
  });

  it("get show info should parse filenames", function() {
    res = fn.get_show_info("The.Big.Bang.Theory.Season 1 Episode 2.Release.1999.mp4");
    assert.equal('1', res.season);
    assert.equal('2', res.episode);
    assert.equal('The Big Bang Theory', res.seriesname);
  });

  it("get show info should parse filenames", function() {
    res = fn.get_show_info("The.Big...Bang.Theory.S01E02.Release.1999.mp4");
    assert.equal('1', res.season);
    assert.equal('2', res.episode);
    assert.equal('The Big Bang Theory', res.seriesname);
  });

  it("get show info should parse filenames", function() {
    res = fn.get_show_info("Stargate.SG1.S10E22.Release.1999.mp4");
    assert.equal('10', res.season);
    assert.equal('22', res.episode);
    assert.equal('Stargate SG1', res.seriesname);
  });

  it("get movie info should parse filenames", function() {
    res = fn.get_movie_info("Man.of.Steel.2013.DVDRip.H264.AAC.mp4");
    assert.equal('2013', res.year);
    assert.equal('Man of Steel', res.moviename);
  });

});

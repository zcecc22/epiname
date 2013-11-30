var assert  = require("assert");
var ws = require("../src/webservices");

describe("Web Services", function() {

  it("find show by name should return a JSON object", function(done) {
    ws.find_show_by_name("Big Bang Theory", function(err, value) {
      assert.equal(null, err);
      assert.equal("80379", value.Data.Series.seriesid);
      done();
    });
  });

  it("find episode should return a JSON object", function(done) {
    ws.find_episode("80379", "1", "3", function(err, value) {
      assert.equal(null, err);
      assert.equal("The Fuzzy Boots Corollary", value.Data.Episode.EpisodeName);
      done();
    });
  });

});

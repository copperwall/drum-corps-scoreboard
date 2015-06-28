var express = require('express');
var router = express.Router();
var Promise = require('promise');
var score_scraper = require('../score_scraper');

/* GET home page. */
router.get('/', function(req, res, next) {
   score_scraper.getEventList().then(function(list) {
      var competitions = list.competitions.slice(0,3);
      return Promise.all(competitions.map(score_scraper.getCompetition));
   }).then(function(competitions) {
     res.render('index', { competitions: competitions });
   });
});

module.exports = router;

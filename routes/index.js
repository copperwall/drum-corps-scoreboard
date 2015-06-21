var express = require('express');
var router = express.Router();
var score_scraper = require('../score_scraper');

/* GET home page. */
router.get('/', function(req, res, next) {
   score_scraper.getEventList().then(function(list) {
      return score_scraper.getAllCompetitions(list);
   }).then(function(competitions) {
     var scores = competitions.map(score_scraper.printScores).join('\n');
     res.render('index', { title: 'Express', scores: scores });
   });
});

module.exports = router;

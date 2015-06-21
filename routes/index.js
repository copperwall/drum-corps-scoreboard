var express = require('express');
var router = express.Router();
var score_scraper = require('../score_scraper');

/* GET home page. */
router.get('/', function(req, res, next) {
   score_scraper.getEventList().then(function(list) {
      return score_scraper.getAllCompetitions(list);
   }).then(function(competitions) {
     res.render('index', { competitions: competitions });
   });
});

module.exports = router;

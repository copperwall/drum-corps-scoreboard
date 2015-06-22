// Score Scraper
var Promise = require('promise'),
    request = require('request-promise'),
    redis   = require('then-redis')

module.exports = (function score_scraper() {
   var apiURL = 'http://bridge.competitionsuite.com/api/orgscores/GetCompetitionsByOrganization/jsonp?organization=96b77ec2-333e-41e9-8d7d-806a8cbe116b&showTrainingEvents=false&callback=jQuery110203862365521490574_1434780076616&_=1434780076617';
   var cache = redis.createClient();

   return {
      getEventList: function() {
         // Check cache
         return cache.get('scoreboard:timeout').then(function(value) {
            if (!value) {
               // Cache MISS
               return request(apiURL).then(function(res) {
                  var json = /\(([^(]+)\);/.exec(res)[1];
                  // set cache data
                  cache.set('scoreboard:scores', json);
                  // set cache timeout value
                  cache.set('scoreboard:timeout', 1);
                  // set cache timeout expiration to five minutes
                  cache.expire('scoreboard:timeout', 300);

                  return JSON.parse(json);
               });
            } else {
               // Cache HIT
               return cache.get('scoreboard:scores').then(function(json) {
                  return JSON.parse(json);
               });
            }
         });
      },
      getAllCompetitions: function(eventList) {
         // Grab data for all events in list.
         return Promise.all(eventList.competitions.map(this.getCompetition));
      },
      getCompetition: function(event) {
         // Grab data for given event object
         var guid = event.competitionGuid;
         return request('http://bridge.competitionsuite.com/api/orgscores/GetCompetition/jsonp?competition='
           + guid + '&callback=jQuery11020556208913680166_1434787087901&_=1434787087903').then(parseJSON);
      }
   }

   // Private methods
   function parseJSON(res) {
      var json = /\(([^(]+)\);/.exec(res)[1];
      return JSON.parse(json);
   }
})();

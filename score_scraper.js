// Score Scraper
var Promise = require('promise');
var request = require('request-promise');

module.exports = (function score_scraper() {
   // API URLs
   var apiURL = 'http://bridge.competitionsuite.com/api/orgscores/GetCompetitionsByOrganization/jsonp?organization=96b77ec2-333e-41e9-8d7d-806a8cbe116b&showTrainingEvents=false&callback=jQuery110203862365521490574_1434780076616&_=1434780076617';

   // Methods
   return {
      // getEventList
      getEventList: function() {
         // Grab list of event information.
         return request(apiURL).then(parseJSON);
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
      },

      // DEBUG
      printScores: function(competition) {
         var output = '';

         output += competition.name + " @ " + competition.location + '\n\n';

         var rounds = competition.rounds.sort(function(a, b) {
            // reverse alphabetically
            // World -> Open -> All
            if (a.name < b.name) {
               return 1;
            } else if (a.name > b.name) {
               return -1;
            } else {
               return 0;
            }
         });

         rounds.forEach(function(round) {
            output += '\t' + round.name +'\n\n';

            round.performances.forEach(function(performance) {
               output += '\t\t' + performance.rank + '\t' + performance.name + '\t' + performance.score + '\n';
            });
            output += '\n';
         });

         return output;
      }
   }

   // Private methods
   function parseJSON(res) {
      var json = /\(([^(]+)\);/.exec(res)[1];
      return JSON.parse(json);
   }
})();

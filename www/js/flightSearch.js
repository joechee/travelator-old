var key = "ah073547609068753174253186360430"; // Should move this to server side


var FlightSearch = function ($scope, $http) {
  this.$scope = $scope;
  this.$http = $http;
  this.i = new ItineraryGenerator($scope, $http);
};


function convertDateToString(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}
function pad(digit) {
  var string = digit.toString();
  if (string.length === 1) {
    string = "0" + string;
  }
  return string;
}

FlightSearch.prototype.search = function (location, maxPrice, startDate, endDate, callback) {


  var $http = this.$http;

  var url = 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/' +
            '{market}/{currency}/{locale}/{originPlace}/{destinationPlace}/' +
            '{outboundPartialDate}/{inboundPartialDate}?apiKey=' + key;


  var market = "GB";
  var currency = "SGD";
  var locale = "en-GB";
  var originPlace = "SG";
  var destinationPlace = "anywhere";
  var outboundPartialDate = convertDateToString(new Date(new Date().getTime() + 7000000000));
  var inboundPartialDate = convertDateToString(new Date(new Date().getTime() + 8000000000));

  url = url
    .replace("{market}", market)
    .replace("{currency}", currency)
    .replace("{locale}", locale)
    .replace("{originPlace}", originPlace)
    .replace("{destinationPlace}", destinationPlace)
    .replace("{outboundPartialDate}", outboundPartialDate)
    .replace("{inboundPartialDate}", inboundPartialDate);

  $http({
    url: url,
    method: 'GET'
  }).success(function (res) {
    if (callback) {
      callback(res);
    }
  });
};


FlightSearch.prototype.parse = function (result, callback) {

  /*
  What should be done here is to come up with a set of json variables


  [{
    startDate
    endDate
    numberOfDaysHoliday
    location
  }]
  */
  var self = this;

  function parseCarriers(carriers) {
    var returnCarriers = {};
    for (var i = 0; i < carriers.length; i++) {
      var carrier = carriers[i];
      returnCarriers[carrier.CarrierId] = carrier.Name;
    }
    return returnCarriers;
  }

  function parsePlaces(places) {
    var returnPlaces = {};
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      returnPlaces[place.PlaceId] = place.Name;
    }
    return returnPlaces;
  }

  function parseQuotes(quotes, carriers, places) {
    var returnQuotes = [];
    for (var i = 0; i < quotes.length; i++) {
      var originalQuote = quotes[i];
      var newQuote = {};
      newQuote['startDate'] = new Date(originalQuote.OutboundLeg.DepartureDate);
      newQuote['endDate'] = new Date(originalQuote.InboundLeg.DepartureDate);
      newQuote['location'] = places[originalQuote.OutboundLeg.DestinationId];
      newQuote.price = originalQuote.MinPrice;
      returnQuotes.push(newQuote);
    }
    return returnQuotes;
  }

  function putPhotos(quotes, callback) {
    function done() {
      callback();
    }
    var requestsMade = 0;
    for (var i = 0; i < quotes.length; i++) {
      requestsMade++;
      (function (i) {
        var quote = quotes[i];
        self.i.generate(quote.location, 1, function (res) {
          quote.photo = res.placesToVisit[0][0].photo;
          requestsMade--;
          if (requestsMade === 0) {
            done();
          }
        }, function (res) {
          requestsMade--;
          quotes[i] = false;
          if (requestsMade === 0) {
            done();
          }
        });
      })(i);
    }
    if (requestsMade === 0) {
      done();
    }
  }

  var carriers = parseCarriers(result.Carriers);
  var places = parsePlaces(result.Places);
  var quotes = parseQuotes(result.Quotes, carriers, places);
  putPhotos(quotes, function () {
    quotes = quotes.filter(function (quote) {
      return quote !== false;
    });
    callback(quotes);
  });
};

FlightSearch.prototype.test = function () {
  var self = this;
  this.search("anywhere",100, new Date() - 100000, new Date(), function (res) {

    self.parse(res, function (result) {
    });
  });
};

FlightSearch.prototype.checkValidLocation = function (location) {
  var valid = [
    "Singapore",
    "anywhere"
  ];

  return (valid.indexOf(location) !== -1);
    
};



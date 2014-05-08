angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope, $state) {

  $scope.new = function () {
    $state.go('tab.flightSearch'); 
  };

})
.controller('FlightSearchCtrl', function ($scope, $http, $state) {
  var f = new FlightSearch($scope, $http);

  $scope.run = function () {
    var $scope = this;
    $scope.location = "anywhere";
    if (f.checkValidLocation($scope.location)) {
      var timeout = setTimeout(function () {
        var innerQuoteData = eval(JSON.stringify(quoteData));
        $scope.$apply(function ($scope) {
          for (var i = 0; i < innerQuoteData.length; i++) {
            innerQuoteData[i].numberOfDays = moment(innerQuoteData[i].endDate).diff(moment(innerQuoteData[i].startDate), "days");
            innerQuoteData[i].startDate = moment(innerQuoteData[i].startDate).format("MMM Do");
            innerQuoteData[i].endDate = moment(innerQuoteData[i].endDate).format("MMM Do");
          }
          $scope.quotes = innerQuoteData;
        });
      }, 2000);
      f.search($scope.location,100, new Date() - 100000, new Date(), function (res) {
        f.parse(res, function (res) {
          for (var i = 0; i < res.length; i++) {
            res[i].numberOfDays = moment(res[i].endDate).diff(moment(res[i].startDate), "days");
            res[i].startDate = moment(res[i].startDate).format("MMM Do");
            res[i].endDate = moment(res[i].endDate).format("MMM Do");
          }
          $scope.quotes = res;
          clearTimeout(timeout);
        });
      });
    } else {
      alert("invalid location!");
    }
  };

  $scope.select = function (quote) {
    var $scope = this;
    $state.go('tab.itinerary', {
      location: quote.location,
      days: quote.numberOfDays
    });
  };
  //f.test();

  var i = new ItineraryGenerator($scope, $http);
  //i.test();

  var lr = new LocationRenderer($scope, $http);
  //lr.test();

})

.controller('ItineraryCtrl', function ($scope, $http, $state, $stateParams) {
  var i = new ItineraryGenerator($scope, $http);
  i.generate($stateParams.location, $stateParams.days, function (res) {
    $scope.itinerary = res.placesToVisit;
  }, function (res) {
    alert('generation failed!');
  });

  $scope.select = function (place) {
    var $scope = this;
    $state.go('tab.context', {
      place: place.name
    });
  };


})

.controller('ContextCtrl', function ($scope, $http, $stateParams) {
  var lr = new LocationRenderer($scope, $http);
  lr.searchGoogle($stateParams.place, function (res) {
    $scope.wikiHTML = res;
  });

});




var quoteData = [{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Darwin","price":392,"photo":"https://irs2.4sqi.net/img/general/125x125/CT1VB4JORR2CZASXOPJUIQGNBB3GSONOZYC4QN32RUQMTKRA.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Chennai","price":329,"photo":"https://irs1.4sqi.net/img/general/125x125/7143154_j6wUhXmljSHHPsdb7FfVI7nk0pFrM4YsY5_skslQNTk.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Rome Fiumicino","price":1427,"photo":"https://irs0.4sqi.net/img/general/125x125/13130045_PK5W0IatdNjgTQKTm1Nknu6LIpL4OXdGb6MyUaTtBt0.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Fukuoka","price":700,"photo":"https://irs3.4sqi.net/img/general/125x125/330078_ARerp2ZBLw0mFtjUiU3cEM4qzCtVfbW2REwGrrAaM5w.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Tokyo Haneda","price":1267,"photo":"https://irs1.4sqi.net/img/general/125x125/15263750_FuLqHGb4envHeBjxNKNiZF5lxdNvz9ee71bROQARSVE.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Phnom Penh","price":127,"photo":"https://irs2.4sqi.net/img/general/125x125/VKZL0N4T3415AB5B1O5OPN5XT5G2WZ34XDWMQJKSLPELBOZY.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Male","price":870,"photo":"https://irs0.4sqi.net/img/general/125x125/3946125_keO8zOcdpoKewWPh6N4Q2K8HrGZrQLMK07H5gtZybMA.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Male","price":747,"photo":"https://irs0.4sqi.net/img/general/125x125/3946125_keO8zOcdpoKewWPh6N4Q2K8HrGZrQLMK07H5gtZybMA.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Amsterdam","price":2057,"photo":"https://irs2.4sqi.net/img/general/125x125/RfPms_BXtJIrn0-K-I6My6OLOs4sIrnLhWkO6Tn-kG4.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Amsterdam","price":1167,"photo":"https://irs2.4sqi.net/img/general/125x125/RfPms_BXtJIrn0-K-I6My6OLOs4sIrnLhWkO6Tn-kG4.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Moscow Domodedovo","price":994,"photo":"https://irs2.4sqi.net/img/general/125x125/Jn8YUw1wa92K9xXEpCWIdL4uIFHMvlTxnxILu2xkLcw.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Stockholm Arlanda","price":1144,"photo":"https://irs0.4sqi.net/img/general/125x125/11093415_fGxfdgx9du6LP-qZgLs41grnzR9eRBs6q-MfJqnCMtU.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Krabi","price":139,"photo":"https://irs1.4sqi.net/img/general/125x125/iILDbW4ZqKVGEXaRP8mJ7ZipyOaWjnQoDodiR4_zFak.jpg"},{"startDate":"2014-07-28T00:00:00.000Z","endDate":"2014-08-09T00:00:00.000Z","location":"Birmingham","price":1734,"photo":"https://irs3.4sqi.net/img/general/125x125/993964_BCxm3UjsgntD9vo5QEXGjIdHTdJCxILkLHlnH7fkWic.jpg"}];

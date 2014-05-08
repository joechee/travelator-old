var ItineraryGenerator = function ($scope, $http) {
	this.$scope = $scope;
	this.$http = $http;
};


// TODO: Take into account the time of the year when generating itinerary as well
ItineraryGenerator.prototype.generate = function (location, numberOfDays, callback, errCallback) {
	/*
		This should produce the following JSON:
		{
			placesToVisit: [
				[Array of <Place>],
				[Array of <Place>] // One array for each number of days
			]
		}
	*/
	var fourSquareUrl = 'https://api.foursquare.com/v2/venues/explore';
	var self = this;
	var $http = this.$http;

	$http({
		url: fourSquareUrl,
		method: 'GET',
		params: {
			near: location,
			client_id: 'MAMMERC1PRKLUAM2FP0TVIGC5FLWBVV0YQ5CGHA14ABEQF35',
			client_secret: 'Q5CTPBNC3CVMJ5VWRTRHTQ0WLOPU0KO5BL4E5NDIR00O0VHS',
			v: '20140401',
			section: 'sights'
		}
	}).success(function (res) {
		res = res.response;
		var rawPlaces = res.groups[0].items;
		var places = rawPlaces.map(function (rawPlace) {
			var place = {
				lat: rawPlace.venue.location.lat,
				long: rawPlace.venue.location.lng,
				address: rawPlace.venue.location.address,
				name: rawPlace.venue.name,
				id: rawPlace.venue.id
			};
			return place;
		})

		places.splice(numberOfDays * 3);

		function putPhoto(place, callback) {
			$http({
				url: 'https://api.foursquare.com/v2/venues/' + place.id + '/photos',
				params: {
					client_id: 'MAMMERC1PRKLUAM2FP0TVIGC5FLWBVV0YQ5CGHA14ABEQF35',
					client_secret: 'Q5CTPBNC3CVMJ5VWRTRHTQ0WLOPU0KO5BL4E5NDIR00O0VHS',
					v: '20140401'
				},
				method: 'GET'
			}).success(function (res) {
				var photoObj = res.response.photos.items[0];
				var prefix = photoObj.prefix;
				var suffix = photoObj.suffix;
				var size = '125x125';
				place.photo = prefix + size + suffix;
				callback();
			}).error(function () {
				putPhoto(place, callback);
			});
		}
		if (places.length === 0) {
			errCallback();
			return;
		}

		var done = 0;
		for (var i = 0; i < places.length; i++) {
			putPhoto(places[i], function () {
				done++;
				if (done === places.length) {
					next();
				}
			});
		}

		function next() {
			var placesToVisit =[];
			var currentDay;
			while (places.length > 0) {
				if (placesToVisit.length > numberOfDays) {
					break;
				}
				currentDay = [];
				for (var i = 0; i < 3; i++) {
					var currentPlace = places.shift();
					if (currentPlace) {
						currentDay.push(currentPlace);
					}					
				}
				placesToVisit.push(currentDay);
			}

			if (callback) {
				callback({
					placesToVisit: placesToVisit
				});
			}
		}
	}).error(function (res) {
		errCallback();
	});

};

ItineraryGenerator.prototype.test = function () {
	this.generate("Singapore,SG", 3, function (res) {
		console.log(res);
		
	});
};



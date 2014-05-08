/*


 var creole = new creole({
      interwiki: {
          MeatballWiki: 'http://www.usemod.com/cgi-bin/mb.pl?',
          TiddlyWiki: 'http://www.tiddlywiki.com/#',
          WikiCreole: 'http://www.wikicreole.org/wiki/',
          Palindrome: function(link) {
                  return 'http://www.example.com/wiki/' + link.split('').reverse().join('');
              }
      },
      linkFormat: '#'
  });
  
  var div = document.createElement('div');
  creole.parse(div, "* This is [[Wikipedia:Wikitext|wikitext]]");

  */

function LocationRenderer($scope, $http) {
  this.$scope = $scope;
  this.$http = $http;
}


LocationRenderer.prototype.renderJSON = function (city, location, callback) {
  /*

  renderJSON should return a json that has the following specifications:

  {
    name: <name of place>
    wikitext: <wiki article that is closest to the place>
  }

  */

  var self = this;
  var $http = this.$http;
  var url = 'http://wikitravel.org/wiki/en/api.php?action=query&rvprop=content&prop=revisions&titles={title}&format=json';

  url = url.replace('{title}', city);

  $http({
    url: url,
    method: 'GET'
  }).success(function (res) {
    var pages = res.query.pages;
    var text;
    for (var i in pages) {
      var page = pages[i];
      text = page.revisions[0]['*'];
    }

    var links = self.getLinks(city, text);

    var wikiTexts = self.getLinkTexts(links, function (linkTexts) {
      linkTexts[city] = text;
      var closestLink = self.search(linkTexts, location, city);
      if (callback) {
        callback({
          name: closestLink,
          wikitext: linkTexts[closestLink]
        });
      }
    });

  });

};

LocationRenderer.prototype.search = function (linkTexts, location, city) {
  var maxLengthLinkText = city;
  var maxMatchesLength = 0;
  for (var i in linkTexts) {
    var matches = linkTexts[i].match(location);
    if (matches && matches.length >= maxMatchesLength) {
      maxLengthLinkText = i;
    }
  }
  return maxLengthLinkText;
};

LocationRenderer.prototype.renderPage = function () {


};




LocationRenderer.prototype.getLinks = function (title, text) {
  var regexString = '\\[\\[(' + title + '/[^\\]]+)\\]\\]';
  var regex = new RegExp(regexString, 'g');
  var match = regex.exec(text);
  var url = 'http://wikitravel.org/wiki/en/api.php?action=query&rvprop=content&prop=revisions&titles={title}&format=json';
  var links = {};

  function parse(text) {
    // Just removes everything after the hex, if there is a hex at all
    return text.split('#')[0].split('|')[0];
  }
  while (match !== null) {
    links[parse(match[1])] = url.replace('{title}', parse(match[1]));
    match = regex.exec(text);   
  }
  return links;
};

LocationRenderer.prototype.getLinkTexts = function (links, callback) {
  /*

  the callback return value should be of the form:

  {
    linkTitle: linkText
    ...
  }

  */
  var $http = this.$http;
  var url = 'http://wikitravel.org/wiki/en/api.php?action=query&rvprop=content&prop=revisions&titles={title}&format=json';
  var linkTexts = {};

  var requestsMade = 0;
  for (var i in links) {
    (function (linkTitle) {
      requestsMade++;
      $http({
        url: links[i],
        method: 'GET'
      }).success(function (res) {
        var pages = res.query.pages;
        var text;
        for (var i in pages) {
          var page = pages[i];
          text = page.revisions[0]['*'];
        }

        linkTexts[linkTitle] = text; 

        requestsMade--;
        if (requestsMade === 0) {
          done();
        }
      });
    })(i);
  }

  function done() {
    callback(linkTexts);
  }

};

LocationRenderer.prototype.searchGoogle = function (location, callback) {
  var $http = this.$http;
  var $iframe = document.createElement('iframe');
  $iframe.style = 'display:hidden';
  $iframe.src = 'http://www.google.com/search?q=site:en.wikipedia.org '+location+'&btnI';
  // Poll the iframe
  $http(
    {
      url: 'http://www.google.com/search?q=site:en.wikipedia.org '+location+'&btnI',
      method: 'GET'
    }
  ).success(function (data) {
    var match = data.match(/<div id="mw-content-text"(.|\n)*<noscript>/)[0] + '</noscript></div>';
    callback(match);
  }).error(function () {
    alert('failure!');
  });

  //.^$*+?()[{\|

  /*
  setTimeout(function () {
    callback($iframe.contentDocument.querySelector('#mw-content-text').innerHTML);
  }, 4000);
  
  window.document.body.appendChild($iframe);
  */  
  // Extract main text from I'm Lucky page 

};

LocationRenderer.prototype.test = function () {
  /*
  this.renderJSON("Singapore", "Clarke Quay", function (res) {
    //console.log(res);
  });
  */
};




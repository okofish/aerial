/*
  Adapted from Apple's TVMLAudioVideo example app
*/

Videos = [];

App.onLaunch = function(options) {

  var BASEURL = options.BASEURL;

  var scripts = [`${BASEURL}/templates/Index.xml.js`,`${BASEURL}/templates/Loading.xml.js`,`${BASEURL}/js/underscore-min.js`];
  evaluateScripts(scripts, function(success) {
    if (success) {
      // create loading screen
      var loading = Loading(),
        loadingPARSER = new DOMParser(),
        loadingdoc = loadingPARSER.parseFromString(loading, "application/xml");
      navigationDocument.pushDocument(loadingdoc);

      // get and display video list
      getVideoList(function(videoList) {
        Videos = videoList;

        var index = Template(videoList, _),
          PARSER = new DOMParser(),
          doc = PARSER.parseFromString(index, "application/xml");

        doc.addEventListener("select", startPlayback);
        doc.addEventListener("play", startPlayback);

        navigationDocument.replaceDocument(doc, loadingdoc);
      })

    } else {

      //TODO: Display error as alert dialog
      var error = new Error("Playback Example: unable to evaluate scripts.");
      throw (error);
    }
  });
};

function startPlayback(event) {

  var id = event.target.getAttribute("id"),
    videos = Videos[id];


  var player = new Player();

  // each location/time pair is one playlist
  player.playlist = new Playlist();

  videos.forEach(function(metadata) {
    var video = new MediaItem('video', metadata.url);

    video.title = metadata.title;
    video.subtitle = metadata.subtitle;

    //TODO: Add video screenshots to each playlist as artwork
    //video.artworkImageURL = metadata.artworkImageURL;

    // not relevant for this, but it seems to be best practice
    video.contentRatingDomain = 'movie';
    video.contentRatingRanking = 200;

    player.playlist.push(video);
  });

  player.play();

}

function getVideoList(cb) {

  // from http://stackoverflow.com/a/2970667
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.addEventListener("load", function() {
    var locationVids = _.groupBy(_.flatten(_.pluck(xhr.response, 'assets'), true), function(obj) {
      return camelize(obj['accessibilityLabel'] + ' ' + obj['timeOfDay'])
    });

    var videoObjects = _.mapObject(locationVids, function(vidObjs) {
      return _.map(vidObjs, function(video) {
        return {
          'title': video['accessibilityLabel'] + ', ' + capitalize(video['timeOfDay']),
          'url': video['url'],
          'subtitle': video['id'].toUpperCase()
        }
      })
    });

    // execute callback
    cb(videoObjects);

  }, false);
  xhr.open("GET", 'http://a1.phobos.apple.com/us/r1000/000/Features/atv/AutumnResources/videos/entries.json', true);
  xhr.send();
  return xhr;
}

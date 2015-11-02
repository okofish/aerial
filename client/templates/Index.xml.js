var Template = function(videos, _) {

  // composing list of XML objects for each playlist
  var videoListItems = _.map(_.sortBy(_.pairs(videos), function(pair) {
    return pair[0];
  }).reverse(), function(playlist) {
    return '<listItemLockup id="' + playlist[0] + '"><title>' + playlist[1][0]['title'] + '</title></listItemLockup>'
  });

  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<document>' +
    '<listTemplate>' +
    '<list>' +
    '<header>' +
    '<title>Aerial</title>' +
    '</header>' +
    '<section>' +
    videoListItems.join('') +
    '<description style="background-color: transparent">All videos are property of Apple Inc.</description>' +
    '</section>' +
    '</list>' +
    '</listTemplate>' +
    '</document>';
}

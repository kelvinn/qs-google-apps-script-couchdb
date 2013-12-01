function doGet(e) {
   return ContentService.createTextOutput("GET Success");
}

function doPost(e) {

  var json_content = Utilities.jsonParse(e.postData.contents);
  var json_items = json_content.items;
  var feed = json_content.status.feed;
  var date_now = new Date();
  var added = date_now.toISOString();
  var json_list = [];
  var category = undefined;
  
  // This searches the feed name for several known strings, and sets the category
  if (feed.indexOf("feeds.foursquare.com") !== -1){
    category = "foursquare";
  }
  if (feed.indexOf("ws.audioscrobbler.com") !== -1){
    category = "lastfm";
  }
  if (feed.indexOf("delicious") !== -1){
    category = "delicious";
  }
  var s;
  for (var i = 0; i < json_items.length; i++) {

    var source_id = json_items[i].id;
    var message = htmlentities(json_items[i].title);
    s = json_items[i].published;
    
    // JS expects number of ms since epoch, but SuperFeedr gives # of sec.
    // So we * 1000
    var date = new Date(json_items[i].published * 1000);
    
    geo = json_items[i].geo;
    if (geo) {
      var coordinates = geo.coordinates;
    }
    
    var link = json_items[i].permalinkUrl;

    json_list[i] = {
      "action": "service", 
      "quantity": "1.0",
      "category": category,
      "link": link,
      "message": message,
      "added": added,
      "start": date.toISOString(),
      "source_id": source_id
    };
    if (coordinates) {
             json_list[i].coordinates = coordinates; 
    }
    
  }
  
  data = {"docs":json_list};

  if (data) {    
    // COMMENT BELOW TO PREVENT SYNC
    var result = saveToCouchDB(data);
    //Logger.log(result);
  }
  
  return ContentService.createTextOutput("POST Success");
  
}


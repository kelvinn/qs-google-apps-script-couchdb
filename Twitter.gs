/**
 * Twitter RSS Feeds - Google Apps Script
 *
 * Google Apps Script to use Twitter API v1.1 to create RSS feeds of
 * user's timeline, search results, user's favorites, or Twitter
 * Lists.
 *
 * @author Amit Agarwal <amit@labnol.org>
 * @author Mitchell McKenna <mitchellmckenna@gmail.com>
 * @author Kelvin Nicholson <kelvin@kelvinism.com>
 */

function initiateTwitter() {
  // Get your Twitter keys from dev.twitter.com/apps
  var CONSUMER_KEY = "ABCDABCDABCDABCDABCDABCD";
  var CONSUMER_SECRET = "ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD";
  var USERNAME = "ABCDABCDABCDABCD";

  ScriptProperties.setProperty("TWITTER_CONSUMER_KEY", CONSUMER_KEY);
  ScriptProperties.setProperty("TWITTER_CONSUMER_SECRET", CONSUMER_SECRET);
  ScriptProperties.setProperty("TWITTER_USERNAME", USERNAME);
       
  connectTwitter();
  
}

function mainTwitter() {
  var json_data = fetchTwitter();
  if (json_data) {    
    // COMMENT BELOW TO PREVENT SYNC
    var result = saveToCouchDB(json_data);
    Logger.log(result);
  }
}

function fetchTwitter() {
  
  username = ScriptProperties.getProperty("TWITTER_USERNAME");

  feed = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + username;
  
  oAuth();
  
  var db = ScriptDb.getMyDb();
  
  var since_id = ""
  
  var latest_id = db.query({service_name: "twitter"});
  obj = latest_id.next();
  if (obj.id) {  
    since_id = obj.id;
    // If you uncomment the below, you will see all the recent tweets
    feed += "&since_id=" + since_id;
  }
  
  var options =
      {
        "method": "get",
        "oAuthServiceName":"twitter",
        "oAuthUseToken":"always"
      };

  try {
      
    var result = UrlFetchApp.fetch(feed, options);
    
    if (result.getResponseCode() === 200) {
      var tweets = Utilities.jsonParse(result.getContentText());
      
      if (tweets) {
        var len = tweets.length;
        var date_now = new Date();
        var added = date_now.toISOString();
        
        var json_list = [];
        
        if (len) {
          
          for (var i = 0; i < len; i++) {

            var sender = tweets[i].user.screen_name;
            var message = htmlentities(tweets[i].text); // func defined in Core.gs
            var date = new Date(tweets[i].created_at);
            var coordinates = tweets[i].coordinates;
            var in_reply_to_status_id = tweets[i].in_reply_to_status_id;
            var in_reply_to_user_id = tweets [i].in_reply_to_user_id;
                            
            // Logger.log(message);
            
            if (i === 0) {
              // This is stored so we don't copy additional tweets to database
              latest_id = tweets[i].id_str;
            }
            
            json_list[i] = {
              "action": "service", 
              "quantity": "1.0",
              "category": "twitter",
              "sender": sender,
              "message": message,
              "added": added,
              "start": date.toISOString(),
              "source_id": tweets[i].id_str
            }; 
            
            if (coordinates) {
             json_list[i].coordinates = coordinates; 
            }
            if (in_reply_to_status_id) {
              json_list[i].in_reply_to_status_id = in_reply_to_status_id;
            }
            if (in_reply_to_user_id) {
              json_list[i].in_reply_to_user_id = in_reply_to_user_id;
            }
            
          }
          
          if (since_id) {
            var record = db.query({service_name: "twitter"}).next();
            record.id = latest_id;
            db.save(record);
          } else { 
            var item = {
              id: latest_id,
              service_name: "twitter"
            }
            var record = db.save(item);
          }
          
          data = {"docs":json_list};
          
          return data;
        }
      }
    }
  } catch (e) {
    Logger.log(e.toString());
  }
}

function connectTwitter() {
    oAuth();

    var search = "https://api.twitter.com/1.1/application/rate_limit_status.json";

    var options =
    {
        "method": "get",
        "oAuthServiceName":"twitter",
        "oAuthUseToken":"always"
    };

    try {
        var result = UrlFetchApp.fetch(search, options);
    } catch (e) {
        Logger.log(e.toString());
    }
}

function oAuth() {
    var oauthConfig = UrlFetchApp.addOAuthService("twitter");
    oauthConfig.setAccessTokenUrl("https://api.twitter.com/oauth/access_token");
    oauthConfig.setRequestTokenUrl("https://api.twitter.com/oauth/request_token");
    oauthConfig.setAuthorizationUrl("https://api.twitter.com/oauth/authorize");
    oauthConfig.setConsumerKey(ScriptProperties.getProperty("TWITTER_CONSUMER_KEY"));
    oauthConfig.setConsumerSecret(ScriptProperties.getProperty("TWITTER_CONSUMER_SECRET"));
}
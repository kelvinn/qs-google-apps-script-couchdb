function saveToCouchDB(data){
  var COUCHDB_USERNAME = "your_username";
  var COUCHDB_PASSWORD = "your_password";
  var COUCHDB_DATABASE = "your_database_name";
  
  var url       = 'https://' + COUCHDB_USERNAME + '.cloudant.com/' + COUCHDB_DATABASE + '/_bulk_docs';
  var params = {
    "method"  : "post", 
    "contentType":"application/json",
    "validateHttpsCertificates" :false,
    "payload" : JSON.stringify(data),
    "headers":{ 
      "Authorization": "Basic " + Utilities.base64Encode(COUCHDB_USERNAME + ":" + COUCHDB_PASSWORD)
    }
  }
  return UrlFetchApp.fetch(url, params);
}
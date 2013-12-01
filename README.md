qs-google-apps-script-couchdb
=============================

The non-technical summary: this is a set of scripts that you can view, edit, and run within Google Docs; the scripts record various events in your life.

The technical summary: these scripts run in Google Apps Script, so are in JavaScript. They poll various web services for new events, and then push them into CouchDB / Cloudant. This is useful for anybody interested in Quantified Self. Although services do exist that do something similar, many people would be reluctant to allow those services access to email / calendars / files. Google Apps Script allows an easy to understand script to perform these operations, and it is run from without your own account.

Source services currently supported:

- [x] Twitter 29/11/2013
- [ ] Gmail
- [ ] FourSquare


Destination services currently supported:

- [x] CouchDB / Cloudant


// curl "localhost:8080/say" -G  --data-urlencode 'text=あいうえお'
var express = require('express');
var GoogleHome = require("google-home-push");
var IP = require("ip");
var port = 8080;
let options = {
   language: "ja",
   speed: 1,       // [0.25, 4.0]
   timeout: 5000
};
var myGoogle = new GoogleHome("グーグル", options);
var app = express();

app.use('/static', express.static('static'));
app.use(express.json());
app.use('/*', function (req, res, next) {
  console.log(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }));
  console.log(req.url);
  next();
});
app.get('/say', function (req, res) {
  console.log("Query: " + req.query.text);
  if (req.headers['x-vanx-jobid'] && new Date().getHours() < 7 && new Date().getHours() < 8) {
    console.log("x-vanx-jobid" + req.headers['x-vanx-jobid']);
    // do nothing
  } else if (req.query.text) {
    myGoogle.speak(req.query.text);
  }
  res.end();
});

app.post('/slack', function (req, res) {
  console.log(req.body);
  if (req.body.challenge) {
    res.send('{ "challenge": "' + req.body.challenge + '" }');
  } else if (req.body.event && req.body.event.text) {
    var who = "";
    if ( req.body.event.user === "U03HJE7P6" ){
      who = "お父さんより。";
    } else if ( req.body.event.user === "U0413NKTWNL"){
      who = "お母さんより。";
    } else if ( req.body.event.user === "U040DUBH4TV"){
      who = "ゴンより。";
    } else if ( req.body.event.user === "U040B2YJ96H"){
      who = "ユンより。";
    }
    myGoogle.speak(who + req.body.event.text);
  }
  res.end();
});

app.get('/push/:file', function (req, res) {
  myGoogle.push("http://" + IP.address() + ":" + port + "/static/" + req.params.file );
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



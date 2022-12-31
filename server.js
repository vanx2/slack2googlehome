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

app.post('/slack', function (req, res) {
  if (req.body.challenge) {
    res.send('{ "challenge": "' + req.body.challenge + '" }');
  } else if (req.body.event && req.body.event.text) {
    myGoogle.speak(req.body.event.text);
  }
  res.end();
});

app.get('/push/:file', function (req, res) {
  myGoogle.push("http://" + IP.address() + ":" + port + "/static/" + req.params.file );
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})



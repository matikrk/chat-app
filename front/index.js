const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('./appConfig.json');
app.set('view engine', 'ejs');

app.use(express.static('public'));

//app.get('/', function(req, res) {
//    res.sendFile(__dirname + '/static/index.html');
//});


app.get('/', function (req, res) {
    res.render('index', { wsLocation: config.wsLocations })
});

const httpPort = process.env.PORT || 8080;
http.listen(httpPort, function() {
    console.log(`listening on *:${httpPort}`);
});

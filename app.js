var express = require('express');
var request = require('request');
var querystring = require('querystring');

var redirect_uri = 'http://localhost:8888/callback';
var client_id;
var client_secret;

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res) {
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri
        }));
});

app.get('/callback', function(req, res) {
    var code = req.query.code;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code',
            client_id: client_id,
            client_secret: client_secret
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.redirect('/#' +
                querystring.stringify({
                    access_token: access_token
                }));
        }
    });
});

if (process.argv.length != 4) {
    console.log("Usage: node app.js <client_id> <client_secret>");
} else {
    client_id = process.argv[2];
    client_secret = process.argv[3];
    console.log('Listening on 8888...');
    app.listen(8888);
}

var PORT = 8888;
var MAX_TILES = 100;

var express = require('express');
var request = require('request');
var querystring = require('querystring');

var redirect_uri = 'http://localhost:' + PORT + '/callback';
var client_id;
var client_secret;

var app = express();
app.use(express.static(__dirname + '/public'));

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

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
    var options = {
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

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.redirect('/#' +
                querystring.stringify({
                    access_token: access_token
                }));
        }
    });
});

function getUserID(access_token, callback) {
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };
    request.get(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(access_token, body['id']);
        }
    });
}

function getUserPlaylists(access_token, id, callback) {
    var options = {
        url: 'https://api.spotify.com/v1/users/' + id + '/playlists',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };
    request.get(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var playlists = [];
            body['items'].forEach(function(item) {
                playlists.push(item['id']);
            });
            callback(access_token, id, playlists);
        }
    });
}

function getPlaylistImages(access_token, id, playlist, callback) {
    var options = {
        url: 'https://api.spotify.com/v1/users/' + id + '/playlists/' + playlist + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };
    request.get(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var images = [];
            body['items'].forEach(function(item) {
                if (item['track']['album']['images'] != undefined) {
                    item['track']['album']['images'].forEach(function(image) {
                        images.push(image['url']);
                    });
                }
            });
            callback(access_token, images);
        }
    });
}

function getPlaylistsImages(access_token, id, playlists, callback, _images) {
    _images = _images || [];
    playlist = playlists.shift();
    if (playlist == undefined) {
        callback(access_token, _images);
    }
    getPlaylistImages(access_token, id, playlist, function(access_token, images) {
        _images = _images.concat(images);
        getPlaylistsImages(access_token, id, playlists, callback, _images);
    });
}

app.get('/tiles', function(req, res) {
    var access_token = req.query.access_token;
    getUserID(access_token, function(access_token, id) {
        getUserPlaylists(access_token, id, function(access_token, id, playlists) {
            getPlaylistsImages(access_token, id, playlists, function(access_token, images) {
                // Remove duplicate album art images.
                images = images.filter(function(elem, pos) {
                    return images.indexOf(elem) == pos;
                });
                images = shuffle(images).slice(0, MAX_TILES);
                res.send(200, images);
            });
        });
    });
});

if (process.argv.length != 4) {
    console.log("Usage: node app.js <client_id> <client_secret>");
} else {
    client_id = process.argv[2];
    client_secret = process.argv[3];
    console.log('Listening on ' + PORT + '...');
    app.listen(PORT);
}

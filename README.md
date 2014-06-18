Spotify Tiles
===

Tiles lets you to view the album art of your favorite Spotify artists in full-screen, tiled across your browser. Album art is selected at random using your public playlists.

 <img align="center" src="https://raw.githubusercontent.com/mpillar/spotify-tiles/master/public/example.png"/>

Getting Started
---

To run spotify tiles, you will need to obtain a client ID and client secret from the Spotify developer site (if I ever decide to host this application somewhere, users will not need to do this, of course). Set your redirect URI to `http://localhost:8888/callback`.

After you have obtained your ID and secret, initialize the project with `npm install` and launch node.js as follows:

    node app.js <client_id> <client_secret>

Todo
---

* Use session instead of `access_token` URL parameter.
* Load more album art when user reaches the bottom of the page.
* Better loading message; do not hide spinner div until all the album art has loaded.

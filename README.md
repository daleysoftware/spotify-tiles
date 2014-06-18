Spotify Tiles
===

Spotify Tiles allows you to view the album art of your favorite artists in full-screen, tiled across your browser.

Albums are selected at random using the user's playlists.

Getting Started
---

To run spotify tiles, you will need to obtain a client ID and client secret from the Spotify developer site (if I ever decide to host this application somewhere, users will not need to do this, of course). Set your redirect URI to http://localhost:8888/callback.

After you have obtained your ID and secret, launch the application as follows:

    node app.js <client_id> <client_secret>

TODO
---

This is a work in progress.

Login using oAuth2 is done (copied from the Spotify template); still need to complete the actual queries for tiles and visualization (possibly using d3).

README.md will be updated as this work is completed.

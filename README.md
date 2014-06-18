Spotify Tiles
===

Tiles allows you to view the album art of your favorite artists in full-screen, tiled across your browser.

Albums covers are selected at random using the user's public playlists.

Getting Started
---

To run spotify tiles, you will need to obtain a client ID and client secret from the Spotify developer site (if I ever decide to host this application somewhere, users will not need to do this, of course). Set your redirect URI to http://localhost:8888/callback.

After you have obtained your ID and secret, initialize the project with `npm install` and launch node.js as follows:

    node app.js <client_id> <client_secret>

TODO
---

This is a work in progress.

* Still need to complete the actual frontend (the backend work is done).
* Use session instead of `access_token` URL parameter.

README.md will be updated as this work is completed.

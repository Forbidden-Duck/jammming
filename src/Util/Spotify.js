import { ClientID, RedirectURI } from "../spotifytokens.json";
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // Check user access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresMatch[1]);
            // Clear parameters to allow for a new access token once expired
            window.setTimeout(() => accessToken = "", expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
            window.location =
                `https://accounts.spotify.com/authorize?client_id=${ClientID}&response_type=token` +
                `&scope=playlist-modify-public playlist-read-private&redirect_uri=${RedirectURI}`;
        }
    },

    search(term) {
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(res => {
            return res.json();
        }).then(jsonRes => {
            if (!jsonRes.tracks) {
                return [];
            }
            return jsonRes.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            });
        });
    },

    findPlaylistTracks(name) {
        if (!name) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;

        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(res => res.json()).then(jsonRes => {
            userID = jsonRes.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists?limit=50`, {
                headers: headers
            }).then(res => res.json())
                .then(jsonRes => {
                    const playlist = jsonRes.items.find(track => track.name === name);
                    if (!playlist) {
                        return;
                    }
                    const tracksHREF = `${playlist.tracks.href}?limit=100`;
                    return fetch(tracksHREF, {
                        headers: headers
                    }).then(res => res.json())
                        .then(jsonRes => {
                            return jsonRes.items.map(track => {
                                return {
                                    id: track.track.id,
                                    name: track.track.name,
                                    artist: track.track.artists[0].name,
                                    album: track.track.album.name,
                                    uri: track.track.uri
                                };
                            })
                        })
                });
        });
    },

    findPlaylist(name) {
        if (!name) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;

        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(res => res.json()).then(jsonRes => {
            userID = jsonRes.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists?limit=50`, {
                headers: headers
            }).then(res => res.json())
                .then(jsonRes => {
                    const playlist = jsonRes.items.find(track => track.name === name);
                    if (!playlist) {
                        return;
                    }
                    return {
                        name: playlist.name,
                        id: playlist.id,
                        owner: playlist.owner,
                        public: playlist.public,
                        uri: playlist.uri
                    }
                });
        });
    },

    updatePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }

        return Spotify.findPlaylist(name).then(playlist => {
            return Spotify.findPlaylistTracks(name).then(playlistTracks => {
                if (!playlist) {
                    return;
                }

                // Filter
                trackURIs = trackURIs.filter(item => !playlistTracks.find(track => track.uri === item));

                const accessToken = Spotify.getAccessToken();
                const headers = { Authorization: `Bearer ${accessToken}` };
                let userID;

                return fetch(`https://api.spotify.com/v1/me`, {
                    headers: headers
                }).then(res => res.json()).then(jsonRes => {
                    userID = jsonRes.id;
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlist.id}/tracks`, {
                        headers: headers,
                        method: "POST",
                        body: JSON.stringify({ uris: trackURIs })
                    });
                });
            });
        });
    },

    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }

        return Spotify.findPlaylist(name).then(playlist => {
            if (playlist) {
                return Spotify.updatePlaylist(name, trackURIs);
            }

            const accessToken = Spotify.getAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            let userID;

            return fetch(`https://api.spotify.com/v1/me`, {
                headers: headers
            }).then(res => res.json()).then(jsonRes => {
                userID = jsonRes.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ name: name })
                }).then(res => res.json())
                    .then(jsonRes => {
                        const playlistID = jsonRes.id;
                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                            headers: headers,
                            method: "POST",
                            body: JSON.stringify({ uris: trackURIs })
                        });
                    });
            });
        });
    }
};

export default Spotify;
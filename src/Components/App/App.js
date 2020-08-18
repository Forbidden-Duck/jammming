import React from 'react';
import './App.css';
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../Util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);

    // Storage
    const cacheSearch = localStorage.getItem("searchResults");
    const cachePlaylist = localStorage.getItem("playlist");

    this.state = {
      searchResults: cacheSearch ? JSON.parse(cacheSearch).tracks : [],
      playlistName: cachePlaylist ? JSON.parse(cachePlaylist).name || "New Playlist" : "New Playlist",
      playlistTracks: cachePlaylist ? JSON.parse(cachePlaylist).tracks : [],
      playlistSaved: true
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.findPlaylist = this.findPlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(item => item.id === track.id)) {
      return
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
    localStorage.setItem("playlist", JSON.stringify({
      name: this.state.playlistName,
      tracks: tracks
    }));
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(item => item.id !== track.id);
    this.setState({ playlistTracks: tracks });
    localStorage.setItem("playlist", JSON.stringify({
      name: this.state.playlistName,
      tracks: tracks
    }));
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    if (!this.state.playlistTracks || this.state.playlistTracks.length < 1) {
      return;
    }

    this.setState({ playlistSaved: false });
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
      .then(() => {
        this.setState({
          playlistTracks: [],
          playlistSaved: true
        });
      });
  }

  findPlaylist(name) {
    Spotify.findPlaylistTracks(name)
      .then(playlist => {
        this.setState({
          playlistTracks: playlist
        });
      })
  }

  search(term) {
    Spotify.search(term).then(res => {
      this.setState({ searchResults: res });
      localStorage.setItem("searchResults", JSON.stringify({ tracks: res }))
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              filter={this.state.playlistTracks}
              onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              playlistSaved={this.state.playlistSaved}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onFind={this.findPlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

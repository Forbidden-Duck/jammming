import React from "react";
import "./Playlist.css";
import Tracklist from "../Tracklist/Tracklist";

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleClickFind = this.handleClickFind.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
        localStorage.setItem("playlist", JSON.stringify({
            name: event.target.value,
            tracks: this.props.playlistTracks
        }));
    }

    handleClickSave() {
        this.props.onSave();
    }

    handleClickFind() {
        this.props.onFind(this.props.playlistName);
    }

    render() {
        return (
            <div className="Playlist">
                <input
                    defaultValue="New Playlist"
                    type="Text" value={this.props.playlistName}
                    onChange={this.handleNameChange} />
                <Tracklist
                    tracks={this.props.playlistTracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true} />
                <div className="container">
                    <button className="Playlist-button Button-save" onClick={this.handleClickSave}>{this.props.playlistSaved ? "SAVE TO PLAYLIST" : "SAVING"}</button>
                    <button className="Playlist-button Button-find" onClick={this.handleClickFind}>FIND PLAYLIST</button>
                </div>
            </div>
        );
    }
}

export default Playlist;
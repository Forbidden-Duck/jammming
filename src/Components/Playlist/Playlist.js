import React from "react";
import "./Playlist.css";
import Tracklist from "../Tracklist/Tracklist";

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    handleClick() {
        this.props.onSave();
    }

    render() {
        return (
            <div className="Playlist">
                <input defaultValue="New Playlist" onChange={this.handleNameChange} />
                <Tracklist
                    tracks={this.props.playlistTracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true} />
                <button className="Playlist-save" onClick={this.handleClick}>{ this.props.playlistSaved ? "SAVE TO PLAYLIST" : "SAVING" }</button>
            </div>
        );
    }
}

export default Playlist;
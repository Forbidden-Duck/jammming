import React from "react";
import "./Tracklist.css";
import Track from "../Track/Track";

class Tracklist extends React.Component {
    render() {
        return (
            <div className="Tracklist">
                {this.props.tracks && this.props.tracks
                .filter(track => !this.props.filter || !this.props.filter.find(item => item.id === track.id))
                .map(track => {
                    return <Track
                        key={track.id}
                        track={track}
                        onAdd={this.props.onAdd}
                        onRemove={this.props.onRemove}
                        isRemoval={this.props.isRemoval} />;
                })}
            </div>
        );
    }
}

export default Tracklist;
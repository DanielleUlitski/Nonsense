import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react';

@inject(allStores => ({
    newRoom: allStores.usersStore.newRoom
}))
class GameLink extends Component {

    newRoom = () => {
        this.props.newRoom(this.props.gameType);
    }

    render() {
        return (
            <div className="game-link">
                <span className="game-title">{this.props.gameType}</span> <br />
                {console.log(this.props.link)}
                <Link onClick={this.newRoom} to={this.props.link}><img className="image-link" src={this.props.src} /></Link>
            </div>
        )
    }
}

export default GameLink;
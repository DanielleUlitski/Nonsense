import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react';
import '../styles/btn.css'
import '../styles/home.css'

@inject(allStores => ({
    newRoom: allStores.usersStore.newRoom
}))
class GameLink extends Component {

    newRoom = () => {
        this.props.newRoom(this.props.gameType);
    }

    render() {
        return (
            <span className="game-link" id={this.props.gameType}>
                <span className="game-title">{this.props.gameType}</span> <br />
                <img className="image-link" src={this.props.src} />
                <p className="description">
                    {this.props.gameType === "drawing" ? "In this game you will draw a shared drawing with your freinds." : "In this game you can write a continud story with all of you freinds"}
                </p>
                <div className="btn-holder">
                    <Link onClick={this.newRoom} to={this.props.link}>
                        <div className="button">
                            <p className="btnText">PLAY NOW</p>
                            <div className="btnTwo play">
                                <p className="btnText2">
                                    <div className="play-img"></div>
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </span>
        )
    }
}

export default GameLink;
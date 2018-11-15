import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import GameResults from './GameResults'
import '../styles/gameScreen.css';
import GameCanvas from './GameCanvas';
import StoryScreen from './StoryScreen';
import SendInvite from './SendInviteModal';

@inject(allStores => ({
    start: allStores.usersStore.start,
    finish: allStores.usersStore.finish,
    currentPlayers: allStores.usersStore.currentPlayers,
    socket: allStores.usersStore.socket,
    currentUser: allStores.usersStore.currentUser
}))

@observer
class GameScreen extends Component {
    @observable gameinProgress = false;
    @observable gameEnded = false;
    @observable bool = false;

    componentDidMount() {
        this.props.socket.on('start', () => {
            this.gameinProgress = true;
        })
    }

    @action invite = () => {
        this.bool = this.bool ? false : true;
    }

    start = () => {
        this.props.socket.emit('start');
    }

    finish = () => {
        // this.gameinProgress = false;
        this.gameEnded = true;
        this.props.finish();
    }

    render() {
        return (
            <div className="game-screen">
                {this.gameEnded ? <GameResults /> : null}
                <h2>LET THE NONSENSE BEGIN!</h2>
                <div style={{ display: (this.props.currentPlayers[0] === this.props.currentUser.userName) ? "block" : "none" }} classNane="start-finish">
                    {this.gameinProgress ?
                        <button className="finish">FINISH</button> :
                        <span>
                            <button onClick={this.invite} className="invite" >Invite</button>
                            <button onClick={this.start} className="start" >Start</button>
                        </span>
                    }
                </div>
                <div className="players">
                    <h4>PLAYERS:</h4>
                    <ul>
                        {this.props.currentPlayers.map(p => { return <li key={p}>{p}</li> })}
                    </ul>
                </div>
                <div className="game-board">
                    {this.props.match.params.gameType === "drawing" ? <GameCanvas style={{ display: this.gameinProgress ? "block" : "none" }} /> : <StoryScreen style={{ visibility: this.gameinProgress ? "visibile" : "hidden" }} />}
                </div>
                <SendInvite bool={this.bool} inv={this.invite} />
            </div>
        )
    }
}

export default GameScreen;
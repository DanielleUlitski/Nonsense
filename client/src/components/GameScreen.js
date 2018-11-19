import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import GameResults from './GameResults'
import '../styles/gameScreen.css';
import GameCanvas from './GameCanvas';
import StoryScreen from './StoryScreen';
import SendInvite from './SendInviteModal';
import ColorPallete from './ColorPallete';

@inject(allStores => ({
    start: allStores.usersStore.start,
    finish: allStores.usersStore.finish,
    currentPlayers: allStores.usersStore.currentPlayers,
    socket: allStores.usersStore.socket,
    pass: allStores.usersStore.pass,
    currentUser: allStores.usersStore.currentUser,
    yourTurn: allStores.usersStore.yourTurn,
    timer: allStores.usersStore.timer,
    finalProduct: allStores.usersStore.finalProduct,
    resetVariables: allStores.usersStore.resetVariables
}))

@observer
class GameScreen extends Component {
    @observable gameinProgress = false;
    @observable gameEnded = false;
    @observable bool = false;

    componentDidMount() {
        this.props.socket.on('start', () => {
            this.gameinProgress = true;
            this.gameEnded = false;
        })
    }

    @action invite = () => {
        this.bool = this.bool ? false : true;
    }

    start = () => {
        this.props.start();
    }

    finish = (e) => {
        // this.gameinProgress = false;
        this.props.finish(this.props.match.params.gameType);
        e.target.href = this.refs.canvas.toDataURL();
        e.target.download = "mypainting.png";
    }

    setRefs = (refs) => {
        this.refs = refs
    }

    setGameState = (bool) => {
        this.gameEnded = bool;
    }

    pass = () => {
        this.props.pass();
    }

    renderGameBoard = (gameType) => {
        switch (gameType) {
            case "drawing":
                return (
                    <span>
                        <GameCanvas setGameState={this.setGameState} gameinProgress={this.gameinProgress} />
                        <ColorPallete />
                    </span>
                )
            case "story":
                return <StoryScreen setGameState={this.setGameState} gameinProgress={this.gameinProgress} />
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="game-screen">
                {(this.props.finalProduct) ? <GameResults gameType={this.props.match.params.gameType} /> : null}
                <div className="game-info">
                    <h2>LET THE NONSENSE BEGIN!</h2>
                    <div style={{ display: (this.props.currentPlayers[0] === this.props.currentUser.userName) ? "block" : "none" }} classNane="start-finish">
                        {
                            this.gameinProgress ?
                                <span>
                                    <a href="#" onClick={this.finish} className="finish start-fin-btn">FINISH</a>
                                </span> :
                                <span>
                                    <button onClick={this.invite} className="invite start-fin-btn" >Invite</button>
                                    <button onClick={this.start} className="start start-fin-btn" >Start</button>
                                </span>
                        }
                    </div>
                    {
                        this.props.yourTurn ?
                            <span>
                                <button onClick={this.pass} className="pass start-fin-btn">Pass</button>
                                <h4 className="indicator">Your Turn!</h4>
                                {/* <span className="timer">{this.props.timer}</span> */}
                            </span> :
                            null
                    }
                    <div className="players">
                        <h4>PLAYERS:</h4>
                        <ul>
                            {this.props.currentPlayers.map(p => { return <li key={p}>{p}</li> })}
                        </ul>
                    </div>
                </div>
                <div className="game-board">
                    {this.renderGameBoard(this.props.match.params.gameType)}
                </div>
                <SendInvite bool={this.bool} inv={this.invite} />
            </div>
        )
    }
}

export default GameScreen;
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
    pass: allStores.usersStore.pass,
    currentUser: allStores.usersStore.currentUser,
    yourTurn: allStores.usersStore.yourTurn,
    timer: allStores.usersStore.timer,
    finalProduct: allStores.usersStore.finalProduct,
    resetVariables: allStores.usersStore.resetVariables,
    themeWord: allStores.usersStore.word,
    startGame: allStores.usersStore.startGame,
    gameinProgress: allStores.usersStore.gameinProgress,
    getPlayers: allStores.usersStore.getPlayers,
}))

@observer
class GameScreen extends Component {
    @observable gameEnded = false;
    @observable bool = false;

    componentDidMount() {
        this.props.socket.on('start', () => {
            this.props.startGame()
            this.gameEnded = false;
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })
    }

    componentWillUnmount() {
        this.props.socket.emit('leaveRoom');
    }

    @action invite = () => {
        this.bool = this.bool ? false : true;
    }

    start = () => {
        this.props.start();
    }

    finish = () => {
        // this.gameinProgress = false;
        this.props.finish(this.props.match.params.gameType);
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
                return <GameCanvas setGameState={this.setGameState} gameinProgress={this.props.gameinProgress} />
            case "story":
                return <StoryScreen setGameState={this.setGameState} gameinProgress={this.props.gameinProgress} />
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="game-screen">
                {(this.props.finalProduct) ? <GameResults gameType={this.props.match.params.gameType} /> : null}
                <div className="game-info">

                    {this.props.gameinProgress ?
                        <div className="themeWord-title">
                            <h4>Your theme word is:</h4>
                            {this.props.themeWord}
                            {
                                this.props.yourTurn ?
                                    <div>
                                        <h4 className="indicator">Your Turn!</h4>

                                        <div className="btn-holder" onClick={this.pass} style={{ display: this.props.match.params.gameType === "story" ? "none" : "block" }}>
                                            <div className="button">
                                                <p className="btnText">PASS</p>
                                                <div className="btnTwo">
                                                    <p className="btnText2">
                                                        <div className="pass-img"></div>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <button   className="pass start-fin-btn">Pass</button> */}
                                        {/* <div className="timer">{this.props.timer}</div> */}
                                    </div> :
                                    null
                            }
                        </div> :

                        <h2 className="themeWord-title">LET THE NONSENSE BEGIN!</h2>
                    }

                    <div style={{ display: (this.props.currentPlayers[0] === this.props.currentUser.userName) ? "block" : "none" }} classNane="start-finish">
                        <div className="players">
                            <h4>PLAYERS:</h4>

                            {this.props.currentPlayers.map(p => { return <span key={p}>{p}</span> })}

                        </div>
                        {
                            this.props.gameinProgress ?
                                <div className="game-btns">
                                    <div className="btn-holder" onClick={this.finish}>
                                        <div className="button cancle">
                                            <p className="btnText">FINISH</p>
                                            <div className="btnTwo cancle2">
                                                <p className="btnText2">
                                                    <div className="finish-img"></div>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <button onClick={this.finish} className="finish start-fin-btn">FINISH</button> */}
                                </div> :
                                <div className="game-btns">
                                    <div className="btn-holder" onClick={this.invite}>
                                        <div className="button">
                                            <p className="btnText">INVITE</p>
                                            <div className="btnTwo">
                                                <p className="btnText2">
                                                    <div className="invite-img"></div>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <button onClick={this.invite} className="invite start-fin-btn" >Invite</button> */}
                                    
                                    <div className="btn-holder" onClick={this.start}>
                                        <div className="button accept">
                                            <p className="btnText">START</p>
                                            <div className="btnTwo accept2">
                                                <p className="btnText2">
                                                    <div className="start-img"></div>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <button onClick={this.start} className="start start-fin-btn" >Start</button> */}
                                </div>
                        }
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
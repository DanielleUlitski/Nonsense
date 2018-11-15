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
    currentPlayers: allStores.usersStore.currentPlayers
}))

@observer
class GameScreen extends Component {
    @observable gameinProgress = false;
    @observable gameEnded = false;
    @observable bool = false;

    @action invite = () => {
        this.bool = this.bool ? false : true;
    }

    start = () => {
        this.gameinProgress = true;
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
                <div classNane="start-finish">
                    {this.gameinProgress ? <button className="finish">FINISH</button> : <span>
                            <button onClick={this.invite} className="invite" >Invite</button>
                            <button onClick={this.start} className="start" >Start</button>
                        </span>
                    }
                </div>
                <div className="game-board">
                    {this.props.match.params.gameType === "drawing" ? <GameCanvas style={{ visibility: this.gameinProgress ? "visibile" : "hidden" }} /> : <StoryScreen style={{ visibility: this.gameinProgress ? "visibile" : "hidden" }} />}
                </div>
                <div className="players">
                    <h4>PLAYERS:</h4>
                    <ul>
                        {this.props.currentPlayers.map(p => { return <li key={p.userName}>{p.userName}</li> })}
                    </ul>
                </div>
                <SendInvite bool={this.bool} inv={this.invite} />
            </div>
        )
    }
}

export default GameScreen;
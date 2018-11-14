import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import GameResults from './GameResults'
import '../styles/gameScreen.css';
import GameCanvas from './GameCanvas';
import StoryScreen from './StoryScreen';

@inject(allStores => ({
    start: allStores.usersStore.start,
    finish: allStores.usersStore.finish,
    invite: allStores.usersStore.invite,
    currentPlayers: allStores.usersStore.currentPlayers
}))

@observer
class GameScreen extends Component {
    @observable gameinProgress = false;
    @observable gameEnded = false;

    invite = () => {
        this.props.invite();
    } 

    start = () => {
        this.gameinProgress = true;
        this.props.start();
    }
    
    finish = () => {
        this.gameEnded = true;
        this.props.finish();
    }

    render() {
        return (
            <div className="gameScreen">
            {this.gameEnded ? <GameResults /> : null}
                <h2>LET THE NONSENSE BEGIN!</h2>
                <div classNane="startFinish">
                    {this.gameinProgress ?
                        <button className="finish">FINISH</button> :
                        <span>
                            <button className="invite" ></button>
                            <button className="start" onClick={this.start} ></button>
                        </span>
                    }
                </div>
                <div className="payers">
                    <h4>PLAYERS:</h4>
                    {this.props.currentPlayers.map(p => {return <p key={p.userName}>{p.userName}</p>})}
                </div>
                <div className="gameBoard">
                    {this.props.match.params.gameType==="drawing" ? <GameCanvas /> : <StoryScreen />}
                </div>
            </div>
        )
    }
}

export default GameScreen;
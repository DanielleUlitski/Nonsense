import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import '../styles/canvas.css'

@inject(allStores => ({
    socket: allStores.usersStore.socket,
    getPlayers: allStores.usersStore.getPlayers,
    yourTurn: allStores.usersStore.yourTurn,
    startTurn: allStores.usersStore.startTurn,
    finalProductSet: allStores.usersStore.finalProductSet,
    getStoreis: allStores.historyStore.getStoreis,
    currentUser: allStores.usersStore.currentUser
}))
@observer
class StoryScreen extends Component {

    @observable displayError = "";

    @observable timout = undefined;

    @observable canvas = null;

    yPositions = 50;
    
    @observable sentenceInp = "";
    
    @observable keyInp = "";

    @observable previosKey = "";
    
    @observable userName = this.props.currentUser.userName
    
    componentDidMount() {
        this.canvas = this.refs.canvas
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.canvas.style.width = "712px";
        this.canvas.style.height = "712px";
        
        this.props.socket.on('nextTurn', (key) => {
            this.showKey(key);
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })

        this.props.socket.on('yourTurn', (key) => {
            this.props.startTurn();
        })

        this.props.socket.on('finish', (story) => {
            this.props.finalProductSet(story);
            this.props.getStoreis(this.userName)
        })
    }

    showKey = (key) => {
        let ctx = this.canvas.getContext("2d")
        ctx.font = "30px ../styles/crawley.regular.ttf";
        ctx.fillText("Your key word is: " + key, 10, this.yPositions);
        this.yPositions += 40;
        this.previosKey = key;
    }

    handleInpt = (e) => {
        this[e.target.name] = e.target.value;
    }

    @action send = () => {
        if (!this.props.yourTurn) {
            this.displayError = "its not your turn"
            this.timout = setTimeout(() => {
                this.displayError = ""
            }, 2000);
        } else {
            let ctx = this.canvas.getContext("2d")
            ctx.font = "30px ariel";
            ctx.fillText(this.previosKey+this.sentenceInp, 10, this.yPositions);
            this.yPositions += 40;
            ctx.fillText(this.keyInp, 10, this.yPositions);
            this.yPositions += 40;
            this.props.socket.emit('updateStory', (this.previosKey+" "+this.sentenceInp), this.keyInp);
            this.sentenceInp = "";
            this.keyInp = "";
            this.previosKey = "";
        }
    }

    render() {
        return (
            <div>
                <span>{this.displayError}</span>
                <div style={{ display: this.props.gameinProgress ? "block" : "none" }}>
                    <canvas ref="canvas" className="crawley-font" />
                    <textarea rows="4" cols="50" className="sentence" value={this.sentenceInp} onChange={this.handleInpt} name="sentenceInp" placeholder="write you sentence" />
                    <input className="keyword" vakue={this.keyInp} onChange={this.handleInpt} name="keyInp" placeholder="write the key word for the next player" />
                    <button onClick={this.send}>SEND</button>
                </div>
            </div>
        );
    }
}
export default StoryScreen;
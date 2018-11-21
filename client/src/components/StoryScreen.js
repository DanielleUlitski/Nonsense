import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import '../styles/canvas.css'
import '../styles/storyScreen.css'
import '../styles/btn.css'

@inject(allStores => ({
    socket: allStores.usersStore.socket,
    getPlayers: allStores.usersStore.getPlayers,
    yourTurn: allStores.usersStore.yourTurn,
    startTurn: allStores.usersStore.startTurn,
    finalProductSet: allStores.usersStore.finalProductSet,
    getStories: allStores.historyStore.getStories,
    currentUser: allStores.usersStore.currentUser,
    pass: allStores.usersStore.pass
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

        this.props.socket.on('nextTurn', (key) => {
            this.props.startTurn('story')
            this.showKey(key);
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })

        this.props.socket.on('finish', (story) => {
            this.props.finalProductSet(story.text, "story");
            this.props.getStories(this.userName)
        })
    }

    showKey = (key) => {
        let ctx = this.canvas.getContext("2d")
        ctx.font = "10pt appFont";
        ctx.fillText(key, 10, this.yPositions);
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
            ctx.font = "10pt appFont";
            ctx.fillText(" " + this.sentenceInp, 35, this.yPositions);
            this.yPositions += 30;
            
            this.props.socket.emit('updateStory', (this.previosKey + " " + this.sentenceInp), this.keyInp);
            this.props.pass();
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
                    <div className="text-area">
                        <input className="sentence" value={this.sentenceInp} onChange={this.handleInpt} name="sentenceInp" placeholder="write you sentence" /><br/>
                        <input className="keyword" value={this.keyInp} onChange={this.handleInpt} name="keyInp" placeholder="write the key word for the next player" />
                        
                        <div className="btn-holder btn-holder-send" onClick={this.send}>
                            <div className="button button-send">
                                <p className="btnText">send</p>
                                <div className="btnTwo">
                                    <p className="btnText2">
                                        <div className="send-img"></div>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default StoryScreen;
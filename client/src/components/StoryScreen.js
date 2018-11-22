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

    @observable userName = this.props.currentUser.userName;

    @observable currentKeyCode = null;

    componentDidMount() {
        this.canvas = this.refs.canvas
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        this.props.socket.on('yourTurn', () => {
            this.props.startTurn('story');
        })

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
        ctx.font = "15pt appFont";
        ctx.fillText(key, 10, this.yPositions);
        this.previosKey = key;
    }

    @action pressHandle = (e) => {
        this.currentKeyCode = e.keyCode || e.charCode;
    }

    handleInpt = (e) => {
        if (e.target.name === 'sentenceInp' && this.sentenceInp.length >= 80 && this.currentKeyCode != 8) {
            this.displayError = "you can only input up to 80 letters in your sentence";
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timout = setTimeout(() => {
                this.displayError = "";
                this.timeout = null;
            }, 2000);
        } else if (e.target.name === 'keyInp' && (e.target.value[e.target.value.length - 1] === " " || this.keyInp.length >= 10) && this.currentKeyCode != 8) {
            this.displayError = "the key word goes here, not the key sentence";
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timout = setTimeout(() => {
                this.displayError = "";
                this.timeout = null;
            }, 2000);
        } else {
            this[e.target.name] = e.target.value;
        }
    }

    @action send = () => {
        if (!this.props.yourTurn) {
            this.displayError = "its not your turn"
            this.timout = setTimeout(() => {
                this.displayError = "";
                this.timeout = null;
            }, 2000);
        } else {
            if (this.keyInp != "") {
                let ctx = this.canvas.getContext("2d")
                ctx.font = "15pt appFont";
                ctx.fillText(" " + this.sentenceInp, 35, this.yPositions);
                this.yPositions += 30;

                this.props.socket.emit('updateStory', (this.previosKey + " " + this.sentenceInp), this.keyInp);
                this.props.pass();
                this.sentenceInp = "";
                this.keyInp = "";
                this.previosKey = "";
            } else {
                this.displayError = "key must be filled with one word"
                this.timout = setTimeout(() => {
                    this.displayError = "";
                    this.timeout = null;
                }, 2000);
            }
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: this.props.gameinProgress ? "block" : "none" }}>
                    <canvas ref="canvas" className="crawley-font" />
                    <div className="text-area">
                        <div style={{ display: "inline-block", width: "80%" }}>
                            <input className="sentence" value={this.sentenceInp} onKeyDown={this.pressHandle} onChange={this.handleInpt} name="sentenceInp" placeholder="write you sentence" /><br />
                            <input className="keyword" value={this.keyInp} onKeyDown={this.pressHandle} onChange={this.handleInpt} name="keyInp" placeholder="write the key word for the next player" />
                        </div>
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
                    <span>{this.displayError}</span>
                </div>
            </div>
        );
    }
}
export default StoryScreen;
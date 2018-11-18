import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import '../styles/canvas.css'

@inject(allStores => ({
    update: allStores.usersStore.update,
    socket: allStores.usersStore.socket,
    getPlayers: allStores.usersStore.getPlayers,
    yourTurn: allStores.usersStore.yourTurn,
    startTurn: allStores.usersStore.startTurn
}))
@observer
class StoryScreen extends Component {

    @observable displayError = "";

    @observable timout = undefined;

    componentDidMount() {
        this.props.socket.on('storyUpdates', (key) => {
            this.showKey(key);
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })

        this.props.socket.on('yourTurn', () => {
            this.props.startTurn();
        })
    }

    @action send = () => {
        if (!this.props.yourTurn) {
            this.displayError = "its not your turn"
            this.timout = setTimeout(() => {
                this.displayError = ""
            }, 2000);
        }
    }

    render() {
        return (
            <div>
                <span>{this.displayError}</span>
                <span className="prev-keyword">
                    {}
                </span>
                <input className="sentence" />
                <input className="keyword" />
                <button onClick={this.send}></button>
            </div>
        );
    }
}
export default StoryScreen;
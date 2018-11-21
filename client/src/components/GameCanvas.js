import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import '../styles/canvas.css'
import ColorPallete from './ColorPallete';

@inject(allStores => ({
    update: allStores.usersStore.update,
    socket: allStores.usersStore.socket,
    yourTurn: allStores.usersStore.yourTurn,
    startTurn: allStores.usersStore.startTurn,
    finalProductSet: allStores.usersStore.finalProductSet,
    currentPlayers: allStores.usersStore.currentPlayers,
    currentUser: allStores.usersStore.currentUser,
    updateSequence: allStores.usersStore.updateSequence,
    stopTimer: allStores.usersStore.stopTimer,
    color: allStores.usersStore.color,
    getDrawings: allStores.historyStore.getDrawings
}))
@observer
class GameCanvas extends Component {

    @observable pressed = false;

    @observable x = null;

    @observable y = null;

    @observable canvas = undefined;

    componentDidMount() {
        this.canvas = this.refs.canvas
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        this.props.socket.on('incomingUpdates', (x, y, isNewLine, color) => {
            if (this.props.currentPlayers[0] === this.props.currentUser.userName) {
                this.props.updateSequence(x, y, isNewLine, color);
            }
            this.draw(x, y, isNewLine, color);
        })

        this.props.socket.on('yourTurn', () => {
            this.props.startTurn("drawing");
        })

        this.props.socket.on('finish', (drawing) => {
            this.props.stopTimer()
            this.props.setGameState(true);
            this.props.getDrawings(this.props.currentUser.userName);
            this.props.finalProductSet(drawing.sequences, "drawing");
        })
    }

    draw = (x, y, newLine, color) => {
        const ctx = this.canvas.getContext('2d');
        if (newLine) {
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.arc(x, y, 0.25, 0, Math.PI * 2);
        ctx.stroke();
    }

    mouseMove = (e) => {
        if (!this.props.yourTurn) return;
        this.getPos(e);
        if (this.pressed) {
            this.props.update(this.x, this.y, false);
        }

    }

    @action mouseDown = (e) => {
        this.pressed = true;
        this.getPos(e)
        if (this.props.yourTurn) this.props.update(this.x, this.y, true, this.props.color);
    }

    @action mouseUp = () => {
        this.pressed = false;
    }

    @action getPos = (e) => {
        const canvas = this.refs.canvas;
        const bounds = canvas.getBoundingClientRect();
        this.x = e.pageX - bounds.left;
        this.y = e.pageY - bounds.top;

        this.x /= bounds.width;
        this.y /= bounds.height;

        this.x *= canvas.width;
        this.y *= canvas.height;
    }

    render() {
        return (
            <div style={{ display: this.props.gameinProgress ? "block" : "none" }}>
                <canvas onTouchMove={this.mouseMove} onTouchEnd={this.mouseUp} onTouchStart={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseDown={this.mouseDown} ref="canvas" />
                <ColorPallete />
            </div>
        );
    }
}
export default GameCanvas;
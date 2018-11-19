import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import '../styles/canvas.css'

@inject(allStores => ({
    update: allStores.usersStore.update,
    socket: allStores.usersStore.socket,
    getPlayers: allStores.usersStore.getPlayers,
    yourTurn: allStores.usersStore.yourTurn,
    startTurn: allStores.usersStore.startTurn,
    finalProductSet: allStores.usersStore.finalProductSet
}))
@observer
class GameCanvas extends Component {

    @observable pressed = false;

    @observable x = null;

    @observable y = null;

    @observable color = "rgba(0, 0, 0, 1)";

    componentDidMount() {
        const canvas = this.refs.canvas
        canvas.width = 1024;
        canvas.height = 1024;
        canvas.style.width = "712px";
        canvas.style.height = "712px";
        this.props.socket.on('incomingUpdates', (x, y, isNewLine) => {
            this.draw(x, y, this.color, isNewLine);
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })

        this.props.socket.on('yourTurn', () => {
            this.props.startTurn();
        })

        this.props.socket.on('finish', (drawing) => {
            this.props.finalProductSet(drawing);
        })
    }

    draw = (x, y, color, newLine) => {
        const ctx = this.refs.canvas.getContext('2d');
        if (newLine) ctx.moveTo(x, y);
        ctx.fillStyle = color;
        // ctx.fillRect(x, y, 2, 2);
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.stroke();
    }

    mouseMove = (e) => {
        console.log(this.props.yourTurn);
        if (!this.props.yourTurn) return;
        this.getPos(e);
        if (this.pressed) {
            this.props.update(this.x, this.y, false);
            // this.draw(this.x, this.y, this.color);
        }

    }

    @action mouseDown = (e) => {
        this.pressed = true;
        this.getPos(e)
        if (this.props.yourTurn) this.props.update(this.x, this.y, true);
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
            <canvas style={{ display: this.props.gameinProgress ? "block" : "none" }} onTouchMove={this.mouseMove} onTouchEnd={this.mouseUp} onTouchStart={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseDown={this.mouseDown} ref="canvas" />
        );
    }
}
export default GameCanvas;
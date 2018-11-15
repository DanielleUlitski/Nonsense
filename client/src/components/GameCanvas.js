import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';

@inject(allStores => ({
    update: allStores.usersStore.update,
    socket: allStores.usersStore.socket,
    getPlayers: allStores.usersStore.getPlayers
}))
@observer
class GameCanvas extends Component {

    @observable pressed = false;

    @observable x = null;

    @observable y = null;

    @observable color = "rgba(0, 0, 0, 1)";

    @observable yourTurn = true;

    componentDidMount() {
        const canvas = this.refs.canvas
        canvas.width = 1024;
        canvas.height = 1024;
        canvas.style.width = "712px";
        canvas.style.height = "712px";
        this.props.socket.on('incomingUpdates', (x, y) => {
            this.draw(x, y, this.color);
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })
    }

    draw = (x, y, color) => {
        console.log(x + " " + y);
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.stroke();
    }

    mouseMove = (e) => {
        if (!this.yourTurn) return;
        this.getPos(e);
        if (this.pressed) {
            this.props.update(this.x, this.y);
            // this.draw(this.x, this.y, this.color);
        }

    }

    @action mouseDown = (e) => {
        this.pressed = true;
        this.getPos(e)
        this.props.update(this.x, this.y);
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
            <canvas onTouchMove={this.mouseMove} onTouchEnd={this.mouseUp} onTouchStart={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseDown={this.mouseDown} ref="canvas" />
        );
    }
}
export default GameCanvas;
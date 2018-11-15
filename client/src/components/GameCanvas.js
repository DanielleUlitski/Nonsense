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
        this.props.socket.on('incomingUpdates', (x, y) => {
            this.draw(x, y, this.color);
        })

        this.props.socket.on('userJoined', (arr) => {
            this.props.getPlayers(arr)
        })
    }

    draw = (x, y, color) => {
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
        this.x = e.clientX;
        this.y = e.clientY;
    }

    render() {
        return (
            <canvas onTouchMove={this.mouseMove} onTouchEnd={this.mouseUp} onTouchStart={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseDown={this.mouseDown} ref="canvas" width={900} height={900} />
        );
    }
}
export default GameCanvas;
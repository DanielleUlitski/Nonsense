import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

// class DrawingGame extends Component {
//     render() {
//         <canvas>

//         </canvas>
//     }
// }
@observer
class GameCanvas extends Component {

    @observable pressed = false;

    @observable x = null;

    @observable y = null;

    @observable color = "rgba(0, 0, 0, 1)";

    draw = (x, y, color) => {
        console.log(x)
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        // ctx.fill();
        ctx.stroke();
    }

    mouseMove = (e) => {
        // debugger;
        this.getPos(e);
        console.log(this.pressed);
        if (this.pressed) {
            this.draw(this.x, this.y, this.color);
        }

    }

    @action mouseDown = (e) => {
        this.pressed = true;
        this.getPos(e)
    }

    @action mouseUp = () => {
        console.log('yay')
        this.pressed = false;
    }

    @action getPos = (e) => {
        // debugger;
        // console.log("works")
        // if (!e) {
        //     let e = event;
        // }
        // if (e.clientX) {
        console.log(e)
        this.x = e.clientX;
        this.y = e.clientY;
        // }
    }

    render() {
        return (
            <canvas onTouchMove={this.mouseMove} onTouchEnd={this.mouseUp} onTouchStart={this.mouseDown} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} onMouseDown={this.mouseDown} ref="canvas" width={900} height={900} />
        );
    }
}
export default GameCanvas;
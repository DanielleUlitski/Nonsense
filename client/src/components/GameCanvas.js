import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx'

// class DrawingGame extends Component {
//     render() {
//         <canvas>

//         </canvas>
//     }
// }
@observer
class GameCanvas extends Component {

    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.arc(15, 15, 0, Math.PI*2);
        ctx.fill();
    }
    render() {
        return (
            <canvas ref="canvas" width={300} height={300} />
        );
    }
}
export default GameCanvas;
import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject(allStores => ({
    displayPopup: allStores.historyStore.displayPopup
}))


class HistoryLink extends Component {

    componentDidMount() {
        const canvas = this.refs.historyCanvas
        canvas.width = 1024;
        canvas.height = 1024;
        canvas.style.width = "200px";
        canvas.style.height = "200px";
        this.renderDrawing()
    }

    renderDrawing = () => {
        for (let i of this.props.drawing.sequences) {
            let x = i.x;
            let y = i.y;
            let isNewLine = i.isNewLine;
            let color = i.color;
            this.draw(x, y, isNewLine, color);
        }
    }

    draw = (x, y, isNewLine, color) => {
        const ctx = this.refs.historyCanvas.getContext('2d');
        if (isNewLine) {
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.arc(x, y, 0.25, 0, Math.PI * 2);
        ctx.stroke();
    }

    displayPopup = () => {
        this.props.displayPopup(this.props.drawing)
    }

    render() {
        if (this.props.drawing) {
            return (
                <div className="HistoryLink">
                    <button onClick={this.displayPopup}>
                        <canvas className="drawing-field" ref="historyCanvas" />
                    </button>
                </div>
            )
        }
        else if (this.props.story) {
            return (
                <div className="HistoryLink">
                    <button>
                        <canvas className="drawing-field" ref="historyCanvas" />
                    </button>
                </div>
            )
        }
    }
}

export default HistoryLink;
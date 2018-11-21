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
        switch (this.props.gameType) {
            case "drawing":
                this.renderDrawing();
                break;
            case "story":
                this.renderStory()
                break;
            default: return null;
        }
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

    yPosition = 50;
    xPosition = 10;
    
    renderStory = () => {
        for (let i in this.props.story.text) {
            this.write(this.props.story.text[i], i)
            this.xPosition += 8;
        }
    }

    write = (letter, index) => {
        const ctx = this.refs.historyCanvas.getContext('2d');
        if (index === 0) {
            ctx.font = "30px floralCapitals";
        } else {
            ctx.font = "30px crawley"
        }
        if (letter === '.' || letter === ',') {
            ctx.fillText(letter, this.xPosition, this.yPosition);
            this.yPosition += 40;
            this.xPosition = 10;
        } else {
            ctx.fillText(letter, this.xPosition, this.yPosition);
        }
    }

    displayPopup = () => {
        switch (this.props.gameType) {
            case "drawing":
                this.props.displayPopup(this.props.drawing, this.props.gameType)
                break;
            case "story":
                this.props.displayPopup(this.props.story, this.props.gameType)
                break;
            default: return null;
        }
    }

    render() {
        return (
            <div className="HistoryLink">
                <button onClick={this.displayPopup}>
                    <canvas className="drawing-field" ref="historyCanvas" />
                </button>
            </div>
        )
    }
}

export default HistoryLink;
import React, { Component } from 'react';
import '../styles/popup.css';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

@inject(allStores => ({
    displayPopup: allStores.historyStore.displayPopup,
    gameType: allStores.historyStore.gameType,
    itemToDisplay: allStores.historyStore.itemToDisplay
}))

@observer
class GameResults extends Component {

    @observable i = 0;

    @observable canvas = undefined;

    componentDidMount() {
        console.log(this.refs);
        this.canvas = this.refs.historyCanvas
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.canvas.style.width = "712px";
        this.canvas.style.height = "712px";
        if (this.props.itemToDisplay) {
            this.renderDrawing();
        }
    }

    renderDrawing = () => {
        if (this.props.itemToDisplay.sequences[0] === undefined) { return }
        if (this.i < this.props.itemToDisplay.sequences.length - 1) { requestAnimationFrame(this.renderDrawing) }
        let x = this.props.itemToDisplay.sequences[this.i].x;
        let y = this.props.itemToDisplay.sequences[this.i].y;
        let isNewLine = this.props.itemToDisplay.sequences[this.i].isNewLine;
        let color = this.props.itemToDisplay.sequences[this.i].color;
        this.draw(x, y, isNewLine, color);
        this.i++;
    }

    draw = (x, y, isNewLine, color) => {
        const ctx = this.canvas.getContext('2d');
        if (isNewLine) {
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        ctx.strokeStyle = color;

        ctx.arc(x, y, 0.25, 0, Math.PI * 2);
        ctx.stroke();
    }

    renderStory = () => {

    }

    renderingType = () => {
        switch (this.props.gameType) {
            case "drawing": return null
            case "story":
                return <div className="story-field">{this.renderStory}</div>
            default:
                return null
        }
    }

    displayPopup = () => {
        this.props.displayPopup(null)
    }

    render() {
        return (
            <div className="popup">
                {this.renderingType()}

                <canvas className="drawing-field" ref="historyCanvas" />
                <button onClick={this.displayPopup}>close</button>
            </div>
        )
    }
}

export default GameResults;
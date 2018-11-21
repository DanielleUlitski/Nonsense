import React, { Component } from 'react';
import '../styles/popup.css';
import '../styles/canvasPopup.css';
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
        this.canvas = this.refs.historyCanvas
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        if (this.props.itemToDisplay) {
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

    yPosition = 30;
    xPosition = 10;

    renderStory = () => {
        if (this.props.itemToDisplay.text[0] === undefined) { return }
        if (this.i < this.props.itemToDisplay.text.length - 1) { requestAnimationFrame(this.renderStory) }
        this.write(this.props.itemToDisplay.text[this.i])
        this.xPosition += 15;
        this.i++
    }

    write = (letter) => {
        const ctx = this.canvas.getContext('2d');
        if (this.i === 0) {
            ctx.font = "20pt appFont";
        } else {
            ctx.font = "20pt appFont"
        }
        if (letter === '.' || letter === ',' || letter === '!' || letter === '?') {
            ctx.fillText(letter, this.xPosition, this.yPosition);
            this.yPosition += 30;
            this.xPosition = 10;
        } else {
            ctx.fillText(letter, this.xPosition, this.yPosition);
        }
    }

    displayPopup = () => {
        this.props.displayPopup(null)
    }

    render() {
        return (
            <div className="popup">
                <div className="modal-content canvas-modal">
                    <canvas className="drawing-field" id="popup-canvas" ref="historyCanvas" />
                    {/* <button onClick={this.displayPopup}>close</button> */}

                    <div className="btn-holder" onClick={this.displayPopup}>
                            <div className="button cancle">
                                <p className="btnText">CLOSE</p>
                                <div className="btnTwo cancle2">
                                    <p className="btnText2"> <div className="cancle-img"></div></p>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GameResults;
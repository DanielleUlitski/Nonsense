import React, { Component } from 'react';
import '../styles/popup.css';
import '../styles/canvasPopup.css';
import '../styles/btn.css';
import '../styles/gameResults.css';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

@inject(allStores => ({
    finalProduct: allStores.usersStore.finalProduct,
    finalize: allStores.usersStore.finalize,
    gameType: allStores.usersStore.gameType
}))
@observer
class GameResults extends Component {

    @observable i = 0;

    @observable resultCanvas = undefined;

    yPosition = 50;
    xPosition = 10;

    componentDidMount() {
        if (this.refs.resultCanvas) {
            this.resultCanvas = this.refs.resultCanvas
            this.resultCanvas.width = 1024;
            this.resultCanvas.height = 1024;

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
        if (this.i < this.props.finalProduct.length - 1) { requestAnimationFrame(this.renderDrawing) }
        let x = this.props.finalProduct[this.i].x;
        let y = this.props.finalProduct[this.i].y;
        let isNewLine = this.props.finalProduct[this.i].isNewLine;
        let color = this.props.finalProduct[this.i].color;
        this.draw(x, y, isNewLine, color);
        this.i++;
    }

    draw = (x, y, isNewLine, color) => {
        const ctx = this.resultCanvas.getContext('2d');
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
        if (this.i < this.props.finalProduct.length - 1) { requestAnimationFrame(this.renderStory) }
        console.log(this.props.finalProduct[this.i]);
        this.write(this.props.finalProduct[this.i])
        this.xPosition += 8;
        this.i++
    }

    write = (letter) => {
        const ctx = this.resultCanvas.getContext('2d');
        if (this.i === 0) {
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

    finalize = () => {
        this.props.finalize()
    }

    // renderFinal = () => {
    //     switch (this.props.gameType) {
    //         case "drawing":
    //             return <canvas className="drawing-field" ref="resultCanvas" />;
    //         case "story":
    //             return <div className="story-field">{this.renderStory}</div>;
    //         default:
    //             return null;
    //     }
    // }

    render() {
        return (
            <div className="popup">
                <div className="modal-content canvas-modal">
                    <canvas className="drawing-field" id="popup-canvas" ref="resultCanvas" />

                    <div className="btn-holder" onClick={this.finalize}>
                        <Link to="/">
                            <div className="button">
                                <p className="btnText">HOME</p>
                                <div className="btnTwo">
                                    <p className="btnText2"> <div className="home-img"></div></p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    </div>
                </div >
                )
            }
        }
        
export default GameResults;
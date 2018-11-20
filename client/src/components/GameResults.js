import React, { Component } from 'react';
import '../styles/popup.css';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

@inject(allStores => ({
    finalProduct: allStores.usersStore.finalProduct,
    finalize: allStores.usersStore.finalize
}))
@observer
class GameResults extends Component {

    @observable i = 0;

    @observable resultCanvas = undefined;

    componentDidMount() {
        if (this.refs.resultCanvas) {
            this.resultCanvas = this.refs.resultCanvas
            this.resultCanvas.width = 1024;
            this.resultCanvas.height = 1024;
            this.resultCanvas.style.width = "712px";
            this.resultCanvas.style.height = "712px";
            this.renderDrawing()
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

    }

    finalize = () => {
        this.props.finalize()
    }

    renderFinal = () => {
        switch (this.props.gameType) {
            case "drawing":
                return <canvas className="drawing-field" ref="resultCanvas" />;
            case "story":
                return <div className="story-field">{this.renderStory}</div>;
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="popup">
                <Link to="/"><span onClick={this.finalize}>Home</span></Link>
                {this.renderFinal()}
            </div>
        )
    }
}

export default GameResults;
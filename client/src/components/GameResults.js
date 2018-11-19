import React, { Component } from 'react';
import '../styles/popup.css';
<<<<<<< HEAD
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom'

=======
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
>>>>>>> 845476accc232826ea4c920353f2b5e8f61f1922

@inject(allStores => ({
    finalProduct: allStores.usersStore.finalProduct,
}))
@observer
class GameResults extends Component {

    @observable i = 0;

    componentDidMount() {
        const canvas = this.refs.resultCanvas
        canvas.width = 1024;
        canvas.height = 1024;
        canvas.style.width = "712px";
        canvas.style.height = "712px";
        this.renderDrawing()
    }

    renderDrawing = () => {
        if (this.i < this.props.finalProduct.length) { requestAnimationFrame(this.renderDrawing) }
        let x = this.props.finalProduct[this.i].x;
        let y = this.props.finalProduct[this.i].y;
        let isNewLine = this.props.finalProduct[this.i].isNewLine;
        let color = this.props.finalProduct[this.i].color;
        this.draw(x, y, isNewLine, color);
        this.i++;
    }

    draw = (x, y, isNewLine, color) => {
        const ctx = this.refs.resultCanvas.getContext('2d');
        if (isNewLine) ctx.moveTo(x, y);
        ctx.fillStyle = color;
        ctx.arc(x, y, 0.25, 0, Math.PI * 2);
        ctx.stroke();
    }

    renderStory = () => {

    }

    finalize = () => {

    }

    render() {
        return (
            <div className="popup">
                <Link to="/"><span onClick={this.finalize}>Home</span></Link>
                <canvas className="drawing-field" ref="resultCanvas" />
                {() => {
                    switch (this.props.gameType) {
                        case "drawing":
                            return <canvas className="drawing-field" ref="resultCanvas" />
                        case "story":
                            return <div className="story-field">{this.renderStory}</div>
                        default:
                            return null
                    }
                }}
            </div>
        )
    }
}

export default GameResults;
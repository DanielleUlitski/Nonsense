import React, { Component } from 'react';
import '../styles/popup.css';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom'


@inject(allStores => ({
    finalProduct: allStores.usersStore.finalProduct,
}))
class GameResults extends Component {

    renderDrawing = () => {

    }
    
    rednerStory = () => {

    }

    showResult = () => {

    }

    render() {
        return (
            <div className="popup">
                <Link to="/">Home</Link>
                {() => {
                    switch (this.props.gameType) {
                        case "drawing":
                            return <canvas className="drawing-field" ref="canvas" />
                        case "story":
                            return (
                                <div className="story-field">

                                </div>
                            )
                    }
                }}
            </div>
        )
    }
}
//jona was here. twice
export default GameResults;//jona was here. twice
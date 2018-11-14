import React, { Component } from 'react';
import GameLink from './GameLink';

class Home extends Component {
    render() {
        return (
            <div className="home">
                <h2>Nonsense</h2>
                <p>
                    This is an app with all the nonsense you need,
            </p>
                <GameLink class="drawing-game" link="/game/drawing" gameType="drawing" />
                <GameLink class="drawing-game" link="/game/story" gameType="story" />
            </div>
        )
    }
}

export default Home;
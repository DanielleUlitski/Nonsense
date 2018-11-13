import React, { Component } from 'react';

class GameLink extends Component {
    render() {
        <p className={this.props.class}>
            <Link to={this.props.link}><img src={this.props.img} /></Link>
        </p>
    }
}

export default GameLink;
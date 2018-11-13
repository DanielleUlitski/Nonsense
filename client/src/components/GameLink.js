import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class GameLink extends Component {
    render() {
        return (
            <p className={this.props.class}>
                <Link to={this.props.link}><img src={this.props.img} /></Link>
            </p>
        )
    }
}

export default GameLink;
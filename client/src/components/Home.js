import React, { Component } from 'react';
import GameLink from './GameLink';
import InviteModal from './InviteModal';
import { observer, inject } from 'mobx-react';
import '../styles/home.css'

@inject(allStores => ({
    socket: allStores.usersStore.socket
}))
@observer
class Home extends Component {

    componentDidMount() {
        this.props.socket.on('loadRoom', (roomType) => {
            
        })
    }

    render() {
        return (
            <div className="home">
                <h2 className="home-title">Nonsense</h2>
                <p className="description">
                    This is an app with all the nonsense you need,
                </p>
                <GameLink src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQDbEdqKqmQOuY5bTmcVA-sEOHsWFqM_asYBIYEcypabLO5QIo0g" link="/game/drawing" gameType="drawing" />
                <GameLink src="http://www.thestory.org/sites/default/themes/siteskin/inc/images/podcast-600.png" link="/game/story" gameType="story" />
                <InviteModal />
            </div>
        )
    }
}

export default Home;
import React, { Component } from 'react';
import GameLink from './GameLink';
import { observer, inject } from 'mobx-react';
import '../styles/home.css'

@inject(allStores => ({
    currentUser: allStores.usersStore.currentUser,
    socket: allStores.usersStore.socket,
    getDrawings: allStores.historyStore.getDrawings,
    getStories: allStores.historyStore.getStories,
    setUser: allStores.historyStore.setUser,
    saveTheme: allStores.usersStore.saveTheme
}))
@observer
class Home extends Component {

    componentDidMount() {
        this.props.socket.on('get drawings', () => {
            this.props.getDrawings(this.props.currentUser.userName)
        })

        this.props.socket.on('get stories', () => {
            this.props.getStories(this.props.currentUser.userName)
        })

        this.props.socket.on('themeWord', (word) => {
            this.props.saveTheme(word)
        })
    }

    render() {
        return (
            <div className="home">
                <div className="title">
                    <h2 className="home-title">Nonsense</h2>
                    <p className="description">
                        This is an app with all the nonsense you need,
                    </p>
                </div>
                    <GameLink src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQDbEdqKqmQOuY5bTmcVA-sEOHsWFqM_asYBIYEcypabLO5QIo0g" link="/game/drawing" gameType="drawing" />
                    <GameLink src="http://www.thestory.org/sites/default/themes/siteskin/inc/images/podcast-600.png" link="/game/story" gameType="story" />
            </div>

        )
    }
}

export default Home;
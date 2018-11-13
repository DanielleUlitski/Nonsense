import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './App.css';
import { inject } from 'mobx-react';
import Home from './components/Home';
import History from './components/History';
import GameScreen from './components/GameScreen';
import Login from './components/Login';

@inject(allStores => ({
  logOut: allStores.usersStore.logOut,
  currentUser: allStores.usersStore.currentUser
}))

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <ul id="navbar">
            <li className="navbatBtn">
              <Link to="/">HOME</Link>
            </li>
            <li className="navbatBtn">
              <Link to="/history">HISTORY</Link>
            </li>
            <button className="navbatBtn" onClick={this.props.logOut}>Log out</button>
          </ul>

          {!this.props.currentUser ? <Login/> : null }

          <Route exact path="/" component={Home} />
          <Route exact path="/history" component={History} />
          <Route exact path="/game/:gameType" render={({ match }) => <GameScreen gameType={match} />} />
        
        </div>
      </Router>
    );
  }
}

export default App;
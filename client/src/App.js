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
  currentUser: allStores.usersStore.currentUser,
}))

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <ul id="navbar">
            <li className="navbar-btn">
              <Link to="/">HOME</Link>
            </li>
            <li className="navbar-btn">
              <Link to="/history">HISTORY</Link>
            </li>
            <li className="navbar-btn logout" onClick={this.props.logOut}><Link to="/">Log out</Link></li>
            <li className="user-display">
              {this.props.currentUser ? this.props.currentUser.userName : null}
            </li>
          </ul>

          <Login />
          <Route exact path="/" component={Home} />
          <Route exact path="/history" render={() => <History />} />
          <Route exact path="/game/:gameType" render={({ match }) => <GameScreen match={match} />} />

        </div>
      </Router>
    );
  }
}

export default App;
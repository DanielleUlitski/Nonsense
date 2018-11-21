import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './App.css';
import { inject } from 'mobx-react';
import Home from './components/Home';
import History from './components/History';
import GameScreen from './components/GameScreen';
import InviteModal from './components/InviteModal';
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
            <li className="navbar-text">NONSENSE</li>
            <li className="navbar-btn">
              <Link to="/">HOME</Link>
            </li>
            <li className="navbar-text">
              {this.props.currentUser ? "Welcome " + this.props.currentUser.userName : null}
            </li>
            <li className="navbar-btn logout" onClick={this.props.logOut}><Link to="/">Log out</Link></li>
            <li className="navbar-btn history">
              <Link to="/history">HISTORY</Link>
            </li>
            <InviteModal />
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
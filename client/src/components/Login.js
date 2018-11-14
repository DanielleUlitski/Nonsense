import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';


@inject(allStores => ({
    loginValidate: allStores.usersStore.validateLogin,
    singup: allStores.usersStore.singUp,
    socket: allStores.usersStore.socket,
    logIn: allStores.usersStore.logIn

}))
@observer
class Login extends Component {

    componentDidMount() {
        this.props.socket.on("login", (user) => {
            this.props.logIn(user);
        })
    }

    @observable loginUsername = "";
    @observable loginPassword = "";
    @observable singupUsername = "";
    @observable singupPassword = "";
    @observable confirmPassword = "";

    @action handleInput = (e) => {
        this[e.target.name] = e.target.value
    }

    signUp = () => {
        if (this.confirmPassword !== this.singupPassword) return;
        this.props.singup({
            userName: this.singupUsername,
            password: this.singupPassword
        });
    }

    login = () => {
        this.props.loginValidate({
            userName: this.loginUsername,
            password: this.loginPassword
        });
    }

    @action validity = () => {

    }

    render() {
        return (
            <div style={this.props.currentUser ? "visibility: hidden" : "visibility: visible"} className="popup">
                <div className="modal-content">
                    <h2>Welcome to the NONSENSE land</h2>
                    <span>
                        <h4>Sign in:</h4>
                        <div className="input-field">Username <br /><input type="text" name="loginUsername" value={this.loginUsername} onChange={this.handleInput} /></div>
                        <div className="input-field">Password <br /><input type="password" name="loginPassword" value={this.loginPassword} onChange={this.handleInput} /></div>
                        <button className="modal-btn" onClick={this.login} >Sign In</button>
                    </span>
                    <span>
                        <h4>Sign up:</h4>
                        <div className="input-field">Username <br /><input type="text" name="singupUsername" value={this.singupUsername} onChange={this.handleInput} /></div>
                        <div className="input-field">Password <br /><input type="password" name="singupPassword" value={this.singupPassword} onChange={this.handleInput} /></div>
                        <div className="input-field">Repeat Password <br /><input type="password" name="confirmPassword" value={this.confirmPassword} onChange={this.handleInput} /></div>
                        <button className="modal-btn" onClick={this.signUp}>Sign Up</button>
                    </span>
                </div>
            </div>
        )
    }
}

export default Login;
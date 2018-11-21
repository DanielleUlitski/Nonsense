import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';
import '../styles/login.css';
import '../styles/btn.css';

@inject(allStores => ({
    loginValidate: allStores.usersStore.validateLogin,
    signup: allStores.usersStore.signUp,
    socket: allStores.usersStore.socket,
    logIn: allStores.usersStore.logIn,
    currentUser: allStores.usersStore.currentUser

}))
@observer
class Login extends Component {

    componentDidMount() {
        this.props.socket.on("login", (user) => {
            this.props.logIn(user);
        })

        this.props.socket.on("wrong user", () => {
            this.currentMessage = "wrong Username or Password!";
        })

        this.props.socket.on('you are already logged In', () => {
            this.currentMessage = "this user is already logged in";
        })
    }

    displayMessage = () => {
        if (this.currentMessage) return <div id="error">{this.currentMessage}</div>
    }

    @observable currentMessage = null;
    @observable loginUsername = "";
    @observable loginPassword = "";
    @observable singupUsername = "";
    @observable singupPassword = "";
    @observable confirmPassword = "";

    @action handleInput = (e) => {
        this[e.target.name] = e.target.value
    }

    signUp = () => {
        if (this.confirmPassword !== this.singupPassword) {
            this.currentMessage = "password needs to be repeated!";
            return;
        }
        this.props.signup({
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
            <div style={{ display: this.props.currentUser ? "none" : "block" }} className="popup" id="login-popup">
                <div className="modal-content" id="login-content">
                    <h2 className="welcome">Welcome to the NONSENSE land!</h2>
                    <div id="login">
                        <h4>Log in:</h4>
                        <div className="input-field">Username <br /><input type="text" name="loginUsername" value={this.loginUsername} onChange={this.handleInput} /></div>
                        <div className="input-field">Password <br /><input type="password" name="loginPassword" value={this.loginPassword} onChange={this.handleInput} /></div>

                        <div className="btn-holder" onClick={this.login}>
                            <div className="button">
                                <p className="btnText">LOG IN</p>
                                <div className="btnTwo">
                                    <p className="btnText2">
                                        <div className="login-img"></div>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="singup">
                        <h4>Sign up:</h4>
                        <div className="input-field">Username <br /><input type="text" name="singupUsername" value={this.singupUsername} onChange={this.handleInput} /></div>
                        <div className="input-field">Password <br /><input type="password" name="singupPassword" value={this.singupPassword} onChange={this.handleInput} /></div>
                        <div className="input-field">Repeat Password <br /><input type="password" name="confirmPassword" value={this.confirmPassword} onChange={this.handleInput} /></div>

                        <div className="btn-holder" onClick={this.signUp}>
                            <div className="button">
                                <p className="btnText">SING UP</p>
                                <div className="btnTwo">
                                    <p className="btnText2">
                                        <div className="sing-img"></div>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.displayMessage()}
                </div>
            </div>
        )
    }
}

export default Login;
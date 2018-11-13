import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';


@inject(allStores => ({
    login: allStores.usersStore.login,
    singup: allStores.usersStore.singup

}))

@observer
class Login extends Component {
    @observable loginUsername = "";
    @observable loginPassword = "";
    @observable singupUsername = "";
    @observable singupPassword = "";
    @observable confirmPassword = "";

    @action handleInput = (e) => {
        this[e.target.name] = e.target.value
    }

    render() {
        return (
            <div className="popup">
                <div className="modal-content">
                    <h2>Welcome to the NONSENSE land</h2>
                    <span>
                        <h4>log in:</h4>
                        <input type="text" name="loginUsername" value={this.loginUsername} onChange={this.handleInput} />
                        <input type="password" name="loginPassword" value={this.loginPassword} onChange={this.handleInput} />
                        <button onClick={this.props.login} >LOG IN</button>
                    </span>
                    <span>
                        <h4>Sing up:</h4>
                        <input type="text" name="singupUsername" value={this.singupUsername} onChange={this.handleInput} />
                        <input type="password" name="singupPassword" value={this.singupPassword} onChange={this.handleInput} />
                        <input type="password" name="confirmPassword" value={this.confirmPassword} onChange={this.handleInput} />
                        <button onClick={this.props.singup}>SING UP</button>
                    </span>
                </div>
            </div>
        )
    }
}

export default Login;
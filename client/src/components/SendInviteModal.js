import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';

@inject(allStores => ({
    socket: allStores.usersStore.socket,
    invite: allStores.usersStore.invite,
}))
@observer
class SendInvite extends Component {

    @observable username = "";

    @action handleInput = (e) => {
        this[e.target.name] = e.target.value;
    }

    @action send = () => {
        this.props.inv();
        this.props.invite(this.username);
        this.username = "";
    }

    render() {
        return (
            <div style={{ visibility: this.props.bool ? "visible" : "hidden" }} className="popup">
                <div className="modal-content">
                    <input onChange={this.handleInput} value={this.username} type="text" name="username" placeholder="Username" />
                    <button onClick={this.send}>Send Invite</button>
                </div>
            </div>
        )
    }
}

export default SendInvite;
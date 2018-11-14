import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';

@inject(allStores => ({
    socket: allStores.usersStore.socket
}))
@observer
class Invite extends Component {

    @observable pending = false;

    @observable invite = {
        userName: null,
        room: null
    }

    @action recieveInvite = (userName, roomId) => {
        this.userName = userName;
        this.room = roomId;
        this.pending = true;
    }

    componentDidMount() {
        this.props.socket.on('gotInvite', this.recieveInvite)
    }

    @action accept = () => {
        this.pending = false;
        this.props.socket.emit('joinRoom', this.invite.userName, this.invite.room);
    }

    render() {
        return (
            <div style={{ visibility: this.pending ? "visible" : "hidden" }} className="popup">
                <div className="modal-content">
                    <span>{this.invite.userName} Has invited you!</span>
                    <button onClick={this.accept}>Accept</button>
                    <button onClick={this.deni}></button>
                </div>
            </div>
        )
    }
}

export default Invite;
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';
import GameScreen from './GameScreen';

@inject(allStores => ({
    socket: allStores.usersStore.socket,
    setType: allStores.usersStore.setType,
    gameType: allStores.usersStore.gameType
}))
@observer
class InviteModal extends Component {

    @observable pending = false;

    @observable invite = {
        userName: null,
        room: null,
    }

    @action recieveInvite = (userName, roomId) => {
        this.invite.userName = userName;
        this.invite.room = roomId;
        this.pending = true;
    }

    componentDidMount() {
        this.props.socket.on('gotInvite', (userName, roomId, roomType) => {
            this.invite.userName = userName;
            this.invite.room = roomId;
            this.props.setType(roomType);
            this.pending = true;
        })
    }

    @action accept = () => {
        this.props.socket.emit('joinRoom', this.props.gameType, this.invite.room);
        this.pending = false;
        this.invite = {
            userName: null,
            room: null
        }
    }

    @action decline = () => {
        this.pending = false;
        this.invite = {
            userName: null,
            room: null
        }
    }

    render() {
        return (
            <div style={{ visibility: this.pending ? "visible" : "hidden" }} className="popup">
                <div className="modal-content">
                    <span>{this.invite.userName} Has invited you!</span>
                    <button onClick={this.accept}>Accept</button>
                    <button onClick={this.decline}>Decline</button>
                </div>
            </div>
        )
    }
}

export default InviteModal;
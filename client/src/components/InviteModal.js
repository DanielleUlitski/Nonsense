import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom'
import '../styles/popup.css';
import GameScreen from './GameScreen';

@inject(allStores => ({
    socket: allStores.usersStore.socket,
    setType: allStores.usersStore.setType,
    gameType: allStores.usersStore.gameType,
    getPlayers: allStores.usersStore.getPlayers,
    gameinProgress: allStores.usersStore.gameinProgress
}))
@observer
class InviteModal extends Component {

    @observable pending = false;

    @observable invite = {
        userName: null,
        room: null,
    }

    @action recieveInvite = (userName, roomId, roomType) => {
        this.invite.userName = userName;
        this.invite.room = roomId;
        this.props.setType(roomType);
        this.pending = true;
    }

    componentDidMount() {
        this.props.socket.on('gotInvite', (userName, roomId, roomType) => {
            if (!this.props.gameinProgress) {
                this.recieveInvite(userName, roomId, roomType);
            }
        })
    }

    @action accept = () => {
        console.log(this.props.gameType)
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
                    <Link to={'/game/' + this.props.gameType} ><button onClick={this.accept}>Accept</button></Link>
                    <button onClick={this.decline}>Decline</button>
                </div>
            </div>
        )
    }
}

export default InviteModal;
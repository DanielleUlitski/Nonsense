import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom'
import '../styles/popup.css';
import '../styles/getInvite.css';

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
                    <h5>{this.invite.userName} Has invited you!</h5>

                    <div className="btn-holder btn-holder-invite" onClick={this.accept}>
                        <Link to={'/game/' + this.props.gameType} >
                            <div className="button accept">
                                <p className="btnText">ACCEPT</p>
                                <div className="btnTwo accept2">
                                    <p className="btnText2">
                                        <div className="accept-img"></div>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="btn-holder btn-holder-invite" onClick={this.decline}>
                        <div className="button cancle">
                            <p className="btnText">DECLINE</p>
                            <div className="btnTwo cancle2">
                                <p className="btnText2">
                                    <div className="cancle-img"></div>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default InviteModal;
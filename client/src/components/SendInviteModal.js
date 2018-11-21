import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import '../styles/popup.css';
import '../styles/sendInvite.css'

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

    @action cancle = () => {
        this.props.inv();
    }

    render() {
        return (
            <div style={{ visibility: this.props.bool ? "visible" : "hidden" }} className="popup">
                <div className="modal-content">
                    <h4>Invite a freind to play:</h4>
                    <input className="invite" onChange={this.handleInput} value={this.username} type="text" name="username" placeholder="Username" />

                    <div className="btn-holder btn-holder-invite" onClick={this.send}>
                        <div className="button">
                            <p className="btnText">SEND INVITE</p>
                            <div className="btnTwo">
                                <p className="btnText2">
                                    <div className="send-inv-img"></div>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="btn-holder btn-holder-invite" onClick={this.cancle}>
                        <div className="button cancle">
                            <p className="btnText">CANCLE</p>
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

export default SendInvite;
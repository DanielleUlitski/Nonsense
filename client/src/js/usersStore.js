import { observable, action } from "mobx";
import axios from 'axios'
import io from 'socket.io-client'

class UsersStore {
    @observable currentUser = null;

    @observable socket = io.connect();

    @observable currentPlayers = [];

    @observable gameType = null;

    @observable yourTurn = false;

    @observable timer = undefined;

    @observable finalProduct = undefined;

    @action finalProductSet = (finalProduct) => {
        this.finalProduct = finalProduct;
    }

    @action startTurn = () => {
        this.yourTurn = true;
        this.timer = setTimeout(this.pass, 5000);
    }

    @action update = (x, y, isNewLine, color) => {
        this.socket.emit('updateDrawing', x, y, isNewLine, color);
    }

    @action pass = () => {
        clearTimeout(this.timer);
        this.socket.emit('pass', this.currentPlayers);
        this.yourTurn = false;
    }

    @action getPlayers = (arr) => {
        this.currentPlayers = arr;
    }

    @action signUp = (user) => {
        axios.post('/api/user', user).then((user) => {
            console.log(user.data);
            if (!user.data) {
                console.log("username already in use!");
            } else {
                this.validateLogin(user.data);
            }
        })
    }

    @action setType = (type) => {
        this.gameType = type;
    }

    @action validateLogin = (user) => {
        this.socket.emit('validateLogin', user, this.socket.id);
    }

    @action logIn = (user) => {
        this.currentUser = user;
    }

    newRoom = (gametype) => {
        this.setType(gametype);
        switch (gametype) {
            case "drawing":
                this.newDrawing();
                break;
            case "story":
                this.newStory();
                break;
        }
    }

    newDrawing = () => {
        axios.post('/api/drawing/opendrawing', { userName: this.currentUser.userName }).then((drawing) => {
            this.socket.emit('newRoom', drawing.data._id, "drawing");
        })
    }

    newStory = () => {
        axios.post('/api/story/openstory', { userName: this.currentUser.userName }).then((story) => {
            this.socket.emit('newRoom', story.id, "story");
        })
    }

    @action start = () => {
        this.socket.emit('start');
        this.startTurn();
    }

    finish = (gameType) => {
        clearTimeout(this.timer);
        this.socket.emit('finish', gameType);
    }

    invite = (userName) => {
        this.socket.emit('sendInvite', userName, this.gameType);
    }

    @action logOut = () => {
        clearTimeout(this.timer);
        this.currentPlayers = [];
        this.currentUser = null;
        this.socket.emit('logOut');
    }
}

const usersStore = new UsersStore();

export default usersStore;
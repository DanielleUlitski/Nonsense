import { observable, action } from "mobx";
import axios from 'axios'
import io from 'socket.io-client'

class UsersStore {
    @observable currentUser = null;

    @observable socket = io.connect();

    @observable currentPlayers = [];

    @observable gameType = null;

    @action update = (x, y, isNewLine) => {
        this.socket.emit('updateRoom', x, y, isNewLine);
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
        axios.post('/api/drawing/opendrawing', {userName: this.currentUser.userName}).then((drawing) => {
            console.log(drawing);
            this.socket.emit('newRoom', drawing.data._id);
            this.socket.emit('updateRoom')
        })
    }

    newStory = () => {
        axios.post('/api/story/openstory').then((story) => {
            this.socket.emit('newRoom', story.id);
        })
    }

    start = () => {

    }

    finish = () => {

    }

    invite = (userName) => {
        this.socket.emit('sendInvite', userName, this.gameType);
    }
}

const usersStore = new UsersStore();

export default usersStore;
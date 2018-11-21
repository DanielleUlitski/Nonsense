import { observable, action } from "mobx";
import axios from 'axios'
import io from 'socket.io-client'

class UsersStore {
    @observable currentUser = null;

    @observable socket = io.connect();

    @observable currentPlayers = [];

    @observable gameType = null;

    @observable yourTurn = false;

    @observable timeOut = undefined;

    @observable finalProduct = undefined;

    @observable sequences = [];

    @observable color = "rgba(0, 0, 0, 1)";

    @observable word = undefined;

    @observable gameinProgress = false;

    @observable gameType = undefined;

    @observable timer = 15;

    @action startGame = () => {
        this.gameinProgress = true;
    }

    @action finalProductSet = (finalProduct, gameType) => {
        this.finalProduct = finalProduct;
        this.gameType = gameType;
    }

    @action saveTheme = (word) => {
        this.word = word;
    }

    @action changeColor = (color) => {
        this.color = color;
    }

    @action updateSequence = (x, y, isNewLine, color) => {
        this.sequences.push({
            x: x,
            y: y,
            isNewLine: isNewLine,
            color: color
        });
    }

    @action countDown = () => {
        if (this.timer === 0) {
            this.pass();
        }
        else {
            this.timeOut = setTimeout(this.countDown, 1000);
            this.timer--;
        }
    }

    @action startTurn = (gameType) => {
        this.yourTurn = true;
        if (gameType === "drawing") {
            this.timer = 15;
            this.countDown();
        }
    }

    @action update = (x, y, isNewLine) => {
        this.socket.emit('updateDrawing', x, y, isNewLine, this.color);
    }

    @action pass = () => {
        clearTimeout(this.timeOut);
        this.socket.emit('pass');
        this.yourTurn = false;
    }

    @action getPlayers = (arr) => {
        this.currentPlayers = arr;
    }

    @action signUp = (user) => {
        axios.post('/api/user', user).then((user) => {
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
            default: return null;
        }
    }

    newDrawing = () => {
        axios.post('/api/drawing/opendrawing', { userName: this.currentUser.userName }).then((drawing) => {
            this.socket.emit('newRoom', drawing.data._id, "drawing");
        })
    }

    newStory = () => {
        axios.post('/api/story/openstory', { userName: this.currentUser.userName }).then((story) => {
            this.socket.emit('newRoom', story.data._id, "story");
        })
    }

    @action start = () => {
        this.socket.emit('start');

    }

    finish = (gameType) => {
        this.socket.emit('finish', gameType, this.sequences);
    }

    stopTimer = () => {
        clearTimeout(this.timeOut);
    }

    invite = (userName) => {
        this.socket.emit('sendInvite', userName, this.gameType);
    }

    @action finalize = () => {
        this.currentPlayers = [];
        this.gameType = null;
        this.yourTurn = false;
        this.sequences = []
        this.gameinProgress = false;
        this.finalProduct = undefined;
        this.yourTurn = false;
        this.color = "rgba(0, 0, 0, 1)";
        this.stopTimer()
        // this.socket.emit('finalize');
    }

    @action logOut = () => {
        clearTimeout(this.timeOut);
        this.currentPlayers = [];
        this.currentUser = null;
        this.socket.emit('logOut');
    }
}

const usersStore = new UsersStore();

export default usersStore;
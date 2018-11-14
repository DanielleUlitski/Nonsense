import { observable, action } from "mobx";
import axios from 'axios'
import io from 'socket.io-client'

class UsersStore {
    @observable currentUser = null;

    @observable socket = io.connect();

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

    @action validateLogin = (user) => {
        this.socket.emit('validateLogin', user, this.socket.id);
    }

    @action logIn = (user) => {
        this.currentUser = user;
    }
}

const usersStore = new UsersStore();

export default usersStore;
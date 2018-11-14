import { observable, action } from "mobx";
import axios from 'axios'
import io from 'socket.io-client'

class UsersStore {
    @observable currentUser = null;

    @observable socket = io.connect();

    @action signUp = (user) => {
        axios.post('/api/user', user).then((user) => {
            if(!user) return console.log("username exists!");
            this.validateLogin(user);
        })
    }

    validateLogin = (user) => {
        this.socket.emit('validateLogin', user, this.socket.id);
    }

    @action logIn = (user) => {
        this.currentUser = user;
        if( this.currentUser ) {
            console.log('lol');
        }
    }
}

const usersStore = new UsersStore();

export default usersStore;
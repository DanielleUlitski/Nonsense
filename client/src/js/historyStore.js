import { observable, action } from "mobx";
import axios from 'axios'

class HistoryStore {
    @observable drawings = [];

    @observable stories = [];

    @observable itemToDisplay = null;

    @observable gameType = null;

    @action getDrawings = (userName) => {
        axios.get('/api/drawing/' + userName).then((drawings) => {
            this.drawings = drawings.data;
        })
    }

    @action getStories = (userName) => {
        axios.get('/api/story/' + userName).then((stories) => {
            this.stories = stories.data;
        })
    }

    @action setType = (type) => {
        this.gameType = type;
    }

    @action displayPopup = (itemToDisplay) => {
        this.itemToDisplay = itemToDisplay;
        
        if (!this.gameType) {
            this.gameType = "drawing"
        }
        else {
            this.gameType = null;
        }
    }
}

const historyStore = new HistoryStore();

export default historyStore;
import React, { Component } from 'react';
import axios from 'axios'
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import HistoryLink from './historyLink';
import HistoryPopup from './HistoryPopup'

@inject(allStores => ({
    currentUser: allStores.usersStore.currentUser
}))

@observer
class History extends Component {
    @observable drawings = [];
    @observable stories = [];

    @observable gametype = null;
    @observable display = false;
    @observable itemToDisplay = null;

    componentDidMount = () => {
        axios.get('/api/drawing/' + this.props.currentUser.userName).then((drawings) => {
            this.drawings = drawings.data;
        })

        // axios.get('/api/story/' + this.props.currentUser.userName).then((stories)=>{
        //     console.log(stories)
        //     this.stories = stories.data;
        // })
    }

    @action displayPopup = (itemToDisplay) => {
        this.itemToDisplay = itemToDisplay;
        
        if (!this.display) {
            this.display = true;
            this.gametype = "drawing"
        }
        else {
            this.display = false;
            this.gametype = null;
        }
    }

    render() {
        return (
            <div className="History">
                <h4>MY DRAWINGS:</h4>
                {this.drawings.map(d => { return <HistoryLink key={d._id} drawing={d} displayPopup={this.displayPopup} /> })}
                {/* <h4>MY STORIES:</h4>
                    {this.stories.map(s=>{return <HistoryLink key={s._id} story={s} displayPopup={this.displayPopup} /> } )} */}
                {this.display ? <HistoryPopup gametype={this.gametype} itemToDisplay={this.itemToDisplay} displayPopup={this.displayPopup} /> : null}
            </div>
        )
    }
}

export default History;
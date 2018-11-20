import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import HistoryLink from './historyLink';
import HistoryPopup from './HistoryPopup'

@inject(allStores => ({
    drawings: allStores.historyStore.drawings,
    stories: allStores.historyStore.stories,
    itemToDisplay: allStores.historyStore.itemToDisplay,
}))

@observer
class History extends Component {
    render() {
        return (
            <div className="History">
                <h4>MY DRAWINGS:</h4>
                {this.props.drawings.map(d => { return <HistoryLink key={d._id} drawing={d}  /> })}
                {/* <h4>MY STORIES:</h4>
                    {this.props.stories.map(s=>{return <HistoryLink key={s._id} story={s} /> } )} */}
                {this.props.itemToDisplay ? <HistoryPopup /> : null}
            </div>
        )
    }
}

export default History;
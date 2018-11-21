import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { observable } from 'mobx';

@inject(allStores => ({
    changeColor: allStores.usersStore.changeColor
}))
class ColorPallete extends Component {

    @observable colors = ["rgba(0, 0, 0, 1)", "rgba(212, 23, 23, 1)", "rgba(227, 122, 10, 1)", "rgba(227, 227, 21, 1)", "rgba(107, 226, 25, 1)", "rgba(25, 226, 95, 1)", "rgba(25, 226, 189, 1)", "rgba(25, 95, 226, 1)", "rgba(188, 19, 222, 1)", "rgba(243, 44, 123, 1)"]

    changeColor = (e) => {
        this.props.changeColor(e.target.style.backgroundColor);
    }

    colorsRender = () => {
        return this.colors.map(c => {
            return <div onClick={this.changeColor} style={{ backgroundColor: c }} className="color"></div>
        })
    }

    render() {
        return (
            <div className="color-pallete">
                {this.colorsRender()}
            </div>
        )
    }
}

export default ColorPallete;
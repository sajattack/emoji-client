import React, { Component } from 'react'
import superagent from 'superagent'

import Sidebar from './Sidebar'
import MapComponent from './Map'


import MainStore from '../stores/mainStore'
import MainActions from '../actions/mainActions'


export default class Framework extends Component {

    state = MainStore.getState();

    componentDidMount() {
        MainStore.listen(this._update)
        this.updatePosts()
    }

    updatePosts = () => {
        console.log('updating!')
        superagent.get('http://api.vicboard.com/threads')
            .end((err, res) => {
                if (err) return console.error(`Error getting initial posts! ${err}`)
                const posts = res.body.hits.hits
                MainActions.posts(posts)
            })
    };

    componentWillUnmount() {
        MainStore.unlisten(this._update)
    }

    _update = () => this.setState(MainStore.getState());

    render() {
        return (
            <div>
                <Sidebar posts={this.state.posts} />
                <MapComponent posts={this.state.posts}/>
            </div>
        )
    }
}

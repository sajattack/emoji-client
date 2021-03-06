import React, { Component } from 'react'
import superagent from 'superagent'

import Sidebar from './Sidebar'
import MapComponent from './Map'
import CreatePost from './CreatePost'


import MainStore from '../stores/mainStore'
import MainActions from '../actions/mainActions'

const apiURL = 'http://api.emoji.rehab'

export default class Framework extends Component {

    state = {
        ...MainStore.getState(),
        postModelOpen: false
    };

    componentDidMount() {
        MainStore.listen(this._update)
        this.updatePosts()
    }

    updatePosts = () => {
        superagent.get(`${apiURL}/threads`)
            .end((err, res) => {
                if (err) return console.error(`Error getting initial posts! ${err}`)
                const posts = res.body.hits.hits
                MainActions.posts(posts)
            })
    };

    handleOpenPost = id => {

    };

    handleAddPost(post) {
        MainActions.newPost({ _source: post })
    }

    componentWillUnmount() {
        MainStore.unlisten(this._update)
    }

    _update = () => this.setState(MainStore.getState());

    render() {
        return (
            <div>
                <Sidebar openPost={this.handleOpenPost} createPost={() => this.setState({postModelOpen: true})} posts={this.state.posts} />
                <MapComponent openPost={this.handleOpenPost} posts={this.state.posts}/>
                <CreatePost handleAddPost={this.handleAddPost} apiURL={apiURL} close={() => this.setState({postModelOpen: false})} open={this.state.postModelOpen} />
            </div>
        )
    }
}

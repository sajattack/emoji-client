import React, { Component } from 'react'
import moment from 'moment'
import { defer, delay } from 'lodash'
import superagent from 'superagent'
import styles from './style.css'

class If extends Component {
    render() {
        return this.props.test ? this.props.children : null
    }
}

export default class CreatePost extends Component {

    state = {
        posting: false,
        posted: false
    };

    handleSubmit = () => {
        const title = this.refs.title.value.trim() || ''
        const username = this.refs.username.value.trim() || 'Anonymoose'
        const text = this.refs.text.value.trim() || ''
        const emoji = this.refs.emoji.value.trim().length > 0 ? this.refs.emoji.value.trim() : '😄'

        if (title.length === 0) return window.alert('You must set a title!')

        const post = {
            title,
            username,
            text,
            cords: [this.refs.map.latitude, this.refs.map.longitude],
            emoji,
            time: moment().unix()
        }

        this.setState({
            posting: true
        })

        defer(() => this.refs.modal.center())

        superagent
            .post(`${this.props.apiURL}/threads`)
            .send(post)
            .end((err, res) => {
                if (err)
                    window.alert('Something went wrong connecting with the backend!')
                else
                    this.props.handleAddPost(post)
                this.refs.modal.close()
                delay(() => {
                    this.setState({
                        posting: false,
                        posted: true
                    })
                    defer(this.props.close)
                }, 500)
            })
    };

    render() {
        return (
            <paper-dialog autoFitOnAttach={true} ref="modal" className={styles.model} opened={this.props.open} with-backdrop  entry-animation="scale-up-animation" modal={true} exit-animation="fade-out-animation">
            
            <If test={!this.state.posting && !this.props.posted}>
              <div>
              <h2 className={styles.title}>New Thread</h2>
              <paper-dialog-scrollable>
              <paper-input ref="title" focused label="Title" />
              <paper-input ref="username" label="Username" />
              <paper-input ref="emoji" readonly max={1} label="Emoji!">
                <emoji-selector suffix/>
              </paper-input>
              <paper-input ref="text" label="Post Body" />
              <google-map  className={styles.map} latitude="48.4733188" zoom="10" longitude="-123.347589612">
                <google-map-marker ref="map" latitude="48.4733188" longitude="-123.347589612" draggable="true" title="Post Coordinates"/>
              </google-map>
              </paper-dialog-scrollable>
              <paper-button raised onClick={this.handleSubmit} className={styles.submit}>Submit</paper-button>
              <paper-button raised onClick={this.props.close} className={styles.create}>Close</paper-button>
              </div>
            </If>
            <If test={this.props.posted}>
              <h2 className={styles.title}>Posted successfully!</h2>
            </If>
          </paper-dialog>
        )
    }
}

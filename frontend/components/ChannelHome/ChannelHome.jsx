/* eslint-disable */

import React from 'react'
import classes from './ChannelHome.module.css'
import { connect } from 'react-redux'
import {requestChannel } from '../../actions/channel_actions'
import { broadcastData, JOIN_CALL, LEAVE_CALL, EXCHANGE, CANDIDATE, OFFER, WATCHER, ANSWER, ice } from '../../util/stream_util'


class ChannelHome extends React.Component {

  constructor(props) {
    super(props)
    this.userId = props.currentUser.id
    this.leaveCall = this.leaveCall.bind(this)
    console.log(this.userId)

    }

  componentDidMount() {
    this.video = document.getElementById('local-video')
    this.peerConnection = null
    this.props.requestChannel(this.props.match.params.channelId)

    App.cable.subscriptions.create(

      { channel: "StreamChannel" },
      {
        connected: () => {
          broadcastData({ type: WATCHER, id: this.userId })
        },
        received: data => {
          console.log("RECEIVED: ", data);

          if (data.id === this.userId) return
          switch (data.type) {
            case OFFER:
              return this.handleOffer(data)
            case EXCHANGE:
              if (data.to !== this.userId) return;
              return this.exchange(data)
            case CANDIDATE:
              return this.addCandidate(data)
            case LEAVE_CALL:
              return this.removeUser(data)
            default:
              return;
          }
        },
      })
  }

  addCandidate() {
    this.peerConnection
      .addIceCandidate(new RTCIceCandidate(ice))
      .catch(e => console.error(e));
  }

  handleOffer(data) {
    this.peerConnection = new RTCPeerConnection(ice);
    this.peerConnection
      .setRemoteDescription(data.description)
      .then(() => this.peerConnection.createAnswer())
      .then(sdp => this.peerConnection.setLocalDescription(sdp))
      .then(() => {
        broadcastData({ type: WATCHER, id: data.id, description: this.peerConnection.localDescription  })
        // socket.emit("answer", id, peerConnection.localDescription);
      });

    this.peerConnection.ontrack = event => {
      video.srcObject = event.streams[0];
    };
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        broadcastData({ type: CANDIDATE, id: data.id, candidate: event.candidate })
        // socket.emit("candidate", id, event.candidate);
      }
    };
  }

 



  leaveCall() {
    const pcKeys = Object.keys(this.pcPeers);
    for (let i = 0; i < pcKeys.length; i++) {
      this.pcPeers[pcKeys[i]].close()
    }
    this.pcPeers = {}
    this.localVideo.srcObject.getTracks()
      .forEach(function (track) { track.stop(); })

    this.localVideo.srcObject = null;
    App.cable.subscriptions.subscriptions = []
    this.remoteVideoContainer.innerHTML = ""
    broadcastData({ type: LEAVE_CALL, id: this.userId })
  }

  removeUser(data) {
      let video = document.getElementById(`remoteVideoContainer+${data.from}`)
      video && video.remove()
      let peers = this.pcPeers
      delete peers[data.from]
  }

    render() {
   
        return (
            <div>            
              <video className={classes.videoPlayer} id="local-video" autoPlay controls></video>
            </div>
        )
    }
}


const mSTP = (state, ownProps) => {
  const currentUser = state.entities.users[state.session.currentUserId]
  return {
    currentUser: currentUser,
    currentChannel: state.entities.channels[ownProps.match.params.channelId]
  }
}

const mDTP = (dispatch) => {
  return {
    requestChannel: (channelId) => dispatch(requestChannel(channelId))
  }
}

// state.entities.channels[ownProps.match.params.channelId]

export default connect(mSTP, mDTP)(ChannelHome)
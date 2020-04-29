import React from 'react'
import {Route, Switch, Link} from 'react-router-dom'
import classes from './App.module.css'

import SessionControlsContainer from './SessionControls/session_controls_container'
import Modal from './Modal/Modal'
import SideBar from './SideBar/SideBar'
import ChannelIndex from './Channels/ChannelIndex'
import ChannelShow from './Channels/ChannelShow/ChannelShow'

const App = (props) => {


    function toggle(dark) {
        if (!dark) {
        document.getElementById('nav').style.backgroundColor = 'white'
        document.getElementById('nav').style.borderBottom = '2px solid #E5E5E5'
        document.getElementById('sidebar').style.backgroundColor = '#EFEFF1'
        document.getElementById('indexArea').style.backgroundColor = '#F7F7F8'
        // document.getElementBy('chatroomWrapper').style.backgroundColor = '#FFFFFF'
        // document.getElementById('messageSubmit').style.backgroundColor = '#F2F2F2'
        // document.getElementById('messageList').style.backgroundColor = '#F2F2F2'
        document.getElementById('channelIndexItem').style.backgroundColor = '#1F1F23'
        let nodes = document.getElementById('indexArea').getElementsByTagName("div");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.background = '#1F1F23';
            nodes[i].style.color = 'white';

        }

        let iconNodes = document.getElementById('sidebar').getElementsByTagName("div");
            for (let i = 0; i < iconNodes.length; i++) {
            // iconNodes[i].style.background = '#1F1F23';
            iconNodes[i].style.color = 'black';

        }

        }else {

        }
    }





    return(
        <div> 
            <Modal/>
            <nav id = "nav" className = {classes.mainNav}>
                <div className = {classes.leftNav} > 
                    {/* <Link to = '/'> <h1 className={classes.appTitle}> Fidget</h1></Link> */}
                    {/* <Link to='/'> <a href="https://fontmeme.com/twitch-logo-font/"><img src="https://fontmeme.com/permalink/200429/c5c269ee240a3104c60edd9054042334.png" alt="twitch-logo-font" border="0"/></a></Link> */}
                    <Link to='/'> <img src="https://i.ibb.co/LRxhSsJ/twitchwhite.png" /></Link>
                </div>
                <span onClick={() => toggle(false)}> . </span>
                <div className = {classes.rightNav}>
                    <SessionControlsContainer/>
                </div>
            </nav>
            <div className={classes.mainContainer}> 
                <SideBar />

            <Switch> 
                <Route path = "/channels/:channelName" component = {ChannelShow}/>
                <Route path = "/" component = {ChannelIndex}/>
            </Switch>

            </div>

        </div>

    )
}


export default App;
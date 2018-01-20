import React, { Component } from 'react';
// import firebase from 'firebase';
import moment from 'moment';
import firebase from '../../config/firebase';

import './style.scss'

class Chat extends Component {
  constructor(props){
    super(props);
    
    this.firebase = firebase.database();

    this.state = {
      user: { username: '', name: '', friends: [] },
      chat: { users: [], message:[] },
      chatText: '',
      showAddFriends: false,
      friendsVal: '',
    };
  }

  componentDidMount(){
    this.firebase.ref(`/users/${localStorage.getItem('user')}/`).on("value", snapshot => {
      var name = snapshot.child("name").val();
      this.setState({
        user: Object.assign(this.state.user, {
          username: name.replace(/[^a-z0-9]/gi, '').toLowerCase(),
          name: name,
        })
      });
    });

    this.firebase.ref(`/users/${localStorage.getItem('user')}/friends/`).on('child_added', data => {
      var user = this.state.user;
      user.friends.push(data.val())
      this.setState({ user: user });
    });

    this.firebase.ref(`/chat/${localStorage.getItem('chatId')}/users/`).on('child_added', data => {
      var chat = this.state.chat;
      chat.users.push(data.val());
      this.setState({ chat: chat });
    });

    this.firebase.ref(`/chat/${localStorage.getItem('chatId')}/message/`).on('child_added', data => {
      var chat = this.state.chat;
      chat.message.push(data.val());
      this.setState({ chat: chat });
    });

    this.handleAddFriends = this.handleAddFriends.bind(this);
    this.handleChangeFriends = this.handleChangeFriends.bind(this);
    this.handleSubmitAddFriends = this.handleSubmitAddFriends.bind(this);
    this.handleChatChange = this.handleChatChange.bind(this);
    this.handleChatSubmit = this.handleChatSubmit.bind(this);
  }

  handleChangeFriends(e){
    this.setState({
      friendsVal: e.target.value
    });
  }

  handleSubmitAddFriends(){
    const username = this.state.friendsVal.replace(/[^a-z0-9]/gi, '').toLowerCase();
    var randChat = 0;
    this.firebase.ref(`/users/${username}/`).once("value").then(snapshot => {
      var name = snapshot.child("name").val();
      if (name !== "" && name !== undefined && name !== null){
        randChat = Math.floor(Math.random() * 1000);

        if (username !== this.state.user.username) {
          this.firebase.ref(`/chat/${randChat}/`).set({
            users: [
              {
                username: username,
                name: name,
                chatId: randChat
              },
              {
                username: this.state.user.username,
                name: this.state.user.name,
                chatId: randChat
              }
            ],
            message: []
          });
          
          this.firebase.ref(`/users/${localStorage.getItem('user')}/friends/`).push().set({
            username: username,
            name: name,
            chatId: randChat
          });
        
          this.firebase.ref(`/users/${username}/friends/`).push().set({
            username: this.state.user.username,
            name: this.state.user.name,
            chatId: randChat
          });
        }
        else{
          alert('Cannot added current username!');
        }
      }
      else{
        alert("Username not found!");
      }
    });
  }

  renderAddFriends(){
    return (
      <div>
        <div id="search">
          <label htmlFor="friendsVal"><i className="fa fa-search" aria-hidden="true"></i></label>
          <input type="text" id="friendsVal" name="friendsVal" value={this.state.friendsVal} onChange={this.handleChangeFriends} placeholder="Input username..." />
        </div>
        <div id="bottom-bar" style={{ zIndex: 10 }}>
          <button id="addcontact" onClick={(e) => { this.handleSubmitAddFriends(); }}>
            <i className="fa fa-user-plus fa-fw" aria-hidden="true" />
            <span>Add contact</span>
          </button>
        </div>
      </div>
    );
  }

  handleAddFriends(state){
    this.setState({
      showAddFriends: state
    });
  }

  handleChatClick(chatId){
    localStorage.setItem('chatId', chatId);
    this.firebase.ref(`/chat/${chatId}/users/`).once("value")
      .then((snapshot) => {
        var chat = this.state.chat;
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          chat.users.push(childData);
        });

        this.setState({
          chat: chat
        });
      });
    this.firebase.ref(`/chat/${chatId}/message/`).once("value")
      .then((snapshot) => {
        var chat = this.state.chat;
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          chat.message.push(childData);
        });

        this.setState({
          chat: chat
        });
      });
  }

  handleChatChange(e){
    const { value } = e.target;
    this.setState({ chatText: value });
  }

  handleChatSubmit(e){
    let data = this.state;
    this.firebase.ref(`/chat/${localStorage.getItem('chatId')}/message/`).push().set({
      username: data.user.username,
      text: data.chatText,
      time: moment().format('LLL')
    });
    this.setState({ chatText: '' });
    e.preventDefault();
    this.props.history.push('/chat/');
  }

  render(){
    return (
      <div id="content">
        <div id="sidepanel">
          <div id="profile">
            <div className="wrap">
              <img id="profile-img" src="/images.png" className="online" alt="" />
              <p>{this.state.user.username}</p>
            </div>
          </div>
          <div id="contacts">
            <ul>
              {
                this.state.user.friends.map((v, i) => 
                  <li className="contact" key={i} onClick={() => { this.handleChatClick(v.chatId); }}>
                    <div className="wrap">
                      <span className="contact-status online" />
                      <img src="/images.png" alt="" />
                      <div className="meta">
                        <p className="name">{v.name}</p>
                        <p className="preview">&nbsp;</p>
                      </div>
                    </div>
                  </li>
                )
              }
            </ul>
          </div>

          {this.state.showAddFriends ? this.renderAddFriends() : null}

          <div id="bottom-bar">
            <button id="addcontact" onClick={(e) => { this.handleAddFriends(!this.state.showAddFriends); }}>
              <i className="fa fa-user-plus fa-fw" aria-hidden="true" />
              <span>Add contact</span>
            </button>
          </div>
        </div>
        <div className="content" style={{display: (localStorage.getItem('chatId') === undefined || localStorage.getItem('chatId') === null ? 'none' : 'block')}}>
          <div className="contact-profile">
            <img src="/images.png" alt="" />
            { this.state.chat.users.map((v, i) => {
              if (v.username !== this.state.user.username){
                return (<p key={i}>{v.name}</p>)
              }
              else {
                return (null)
              }
            }) }
            
          </div>
          <div className="messages">
            <ul>
              { 
                this.state.chat.message ? 
                  this.state.chat.message.map((v, i) => {
                    return (
                      <li key={i} className={v.username === this.state.user.username ? 'replies' : 'sent'}>
                        <img src="/images.png" alt="" />
                        <p>{ v.text }</p>
                      </li>
                    );
                  })
                :
                  ''
              }
            </ul>
          </div>
          <div className="message-input">
            <div className="wrap">
              <form onSubmit={this.handleChatSubmit}>
                <input type="text" placeholder="Write your message..." value={this.state.chatText} onChange={this.handleChatChange} />
                <button className="submit" type="submit">
                  <i className="fa fa-paper-plane" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
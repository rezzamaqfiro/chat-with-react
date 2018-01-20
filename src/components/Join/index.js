import React, { Component } from 'react';
// import firebase from 'firebase';
import firebase from '../../config/firebase';

import './style.scss'

class Join extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: ''
    }
    
    this.firebase = firebase.database();
  }

  componentWillMount(){
    this.handleChange = this.handleChange.bind(this);  
    this.joinChat = this.joinChat.bind(this);
  }

  handleChange(e){
    const { value, name } = e.target;
    this.setState({
      [name]: value
    });
  }

  joinChat(e){
    let data = this.state;
    let username = data.name.replace(/[^a-z0-9]/gi,'').toLowerCase();
    this.firebase.ref('/users/' + username + '/').set({
      name: data.name,
    });
    localStorage.setItem('user', username);
    e.preventDefault();
    this.props.history.push(`/chat`);
  }

  render() {
    return (
      <div>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" />
        <div className="container">
          <h1 className="welcome text-center">Welcome to <br /> Firebase Chat</h1>
          <div className="card card-container">
            <h2 className="login_title text-center">Login</h2>
            <hr />
            <form className="form-signin">
              <span id="reauth-email" className="reauth-email" />
              <p className="input_title">Name</p>
              <input type="text" id="inputName" className="login_box" placeholder="Rezza Maghfiro" name="name" value={this.state.name} onChange={this.handleChange} required autoFocus />
              
              <a style={{ display: 'block' }} className="btn btn-lg btn-primary" onClick={this.joinChat}>Join</a>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Join;
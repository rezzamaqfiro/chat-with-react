import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

import Chat from './components/Chat'
import Join from './components/Join'

export const history = createBrowserHistory();

class App extends Component {

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" name="Join" component={Join}></Route>
          <Route exact path="/chat" name="Chat" component={Chat}></Route>
          <Redirect from="/" to="/" />
        </Switch>
      </Router>
    )
  }
}

export default App;

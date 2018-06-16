import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import {routes} from 'root/constants';
import { Icon } from 'semantic-ui-react';
import HomepageView from 'root/views/homepage';

import 'semantic-ui-css/semantic.min.css';
import 'root/styles/main.scss';
import './styles.scss';

class App extends Component {

  render() {

    return (
      <Router>
        <div className="App">
              <Switch>
                <Route exact path={routes.ROOT} component={HomepageView} />

              </Switch>

        </div>
      </Router>
    );
  }
}

export default App;

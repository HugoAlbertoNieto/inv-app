import React, {Component } from "react";
import MyNavBar from './Nav'
import Aside from './LateralMenu'
import Main from './Main'
import {
  BrowserRouter as Router,

  Route,
  Link
} from "react-router-dom"
import Switch from 'react-switch';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from "react";
import UserService from "./services/user.service";
import { Provider } from 'react-redux'
import Login from './Login'
import store from './store'
import { Redirect } from 'react-router-dom';

class WrapperApp extends Component {
  render() {
    return (
      <Router>
          <>
            <Provider store={store}>
            <MyNavBar />
            <div className='d-flex flex-no-wrap' style={{width: "100%"}}>
              <Aside collapsed={false} />
              <div style={{width: '100%',float: 'right'}}>
                <Main />
              </div>
            </div>
            </Provider>
          </>
      </Router>
    )
  }
}

const App = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);


  return (
    <>
      {(content == "No token provided!") &&
        <Provider store={store}>
          <Router>
            <Login />
          </Router>
        </Provider>      
      }
      {(content !="No token provided!") &&
        <WrapperApp />
      }      
    </>
  );
}

export default App
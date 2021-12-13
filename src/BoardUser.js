import React, { useState, useEffect } from "react";
import MyNavBar from './Nav'
import Aside from './LateralMenu'
import UserService from "./services/user.service";

const BoardUser = () => {
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
    <MyNavBar />
    <div style={{width: '100%',float: 'right'}}>
        <Aside collapsed={false} />    
    </div> 
    </>
  );
};

export default BoardUser;
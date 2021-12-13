import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
//import {getusers} from "./actions/auth.js";
//import {getusers} from "./services/auth.service.js";
import {getAll} from "./services/user.service.js";
import { useDispatch, useSelector } from "react-redux";
import UserDataService from "./services/user.serviceaux.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

class AdminZone extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.state = {
      users:[],
    };    
  }
  
  componentDidMount() {    
    this.retrieveUsers();
  }

  retrieveUsers() {     
    UserDataService.getAll()
    .then((response) => {
      this.setState({
        users: response.data
      });
    })
    .catch((e) => {
      console.log(e.message);
    }); 
  }

  render() {
    return (
      <>        
        <h2 className='d-flex justify-content-center'>MAIN SETTINGS</h2>
        <hr/>        
        <div className='m-5'>                             
          <h3>Users</h3>
          <Link to = {`/registeruser/`}>
            <Button>Create New User</Button>
          </Link>
        </div> 
        <Container>
          <Row>
            <Table striped bordered hover size="sm">
              <TableHeader />
              <TableBody usersObj={this.state.users}/>
            </Table>
          </Row>
        </Container>             
      </>  
    )
  }
}
  
const TableBody = (props) => { 
  const rows = props.usersObj.map((row, index) => { 
    const roles = row.roles.map((role, index) => { 
      return (
        <ul>
          <li>{role.name}</li>
        </ul>
      )
    })     
    return (      
      <tr key={index}>        
        <td style={{width:'15%'}}>
          {row.username}
        </td>
        <td style={{width:'20%'}}>  
          {row.email}
        </td>
        <td style={{width:'20%'}}>  
          {roles}
        </td>  
        <td>
          <Link to = {`/edituser/${row.id}`}>
            <Button><FontAwesomeIcon icon={faPencilAlt} /></Button>
          </Link>  
        </td>      
      </tr>
    )
  })

  return (
    <tbody>
      {rows}
    </tbody>
  )
}

const TableHeader = () => {
  return (

    <thead>
      <tr>
        <th style={{width:'15%'}}>Username</th>
        <th style={{width:'20%'}}>Email</th>
        <th style={{width:'20%'}}>Roles</th>
        <th style={{width:'10%'}}>Edit</th>
      </tr>
    </thead>
  )
}

export default AdminZone;
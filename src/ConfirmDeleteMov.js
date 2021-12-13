import React, {Component} from 'react';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ConfirmDeleteMov(props) {  
    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);
    const handleShow = () => setLgShow(true);
    return (
      <>
        {(props.movtype==1) &&
        <Button disabled={(props.postatus!=1)} onClick={handleShow} variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
        }
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              {'Delete Movement Number: ' + props.movnumber}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Please, confirm you want to delete the movement.</Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button value={props.id} variant="primary" onClick={props.handleDelete}>
            Delete movement
          </Button>
        </Modal.Footer>          
        </Modal>
      </>
    );
  }
  
  export default ConfirmDeleteMov;
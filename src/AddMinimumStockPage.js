import React, {Component} from 'react';
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import LocationDataService from "./services/location.service";
import SublocationDataService from "./services/sublocation.service";
import MinimumStockDataService from "./services/minimumstock.service";
import SearchItems from './SearchItems';
import Alert from 'react-bootstrap/Alert'

const ListOfLocations = (props) => {
  const rows = props.locs.map((row, index) => {
    return (  
      <option key={index} value={row.id +'#' +row.LocationId}>        
        {row.LocationDescription}
      </option>
    )
  })  
  return (      
    <>        
    {rows}
    </>
  )
}

function AddMinimumStockPage(props) {  
    var res;
    const [showerror, setShowError] = useState(false);
    const [errmessage, setErrMessage] = useState('');
    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);
    const handleShow = () => setLgShow(true);
    const [locationid, setLocationId] = useState('');
    const [selecteditem, setSelectedItem] = useState('');
    const [selecteditemdesc, setSelectedItemDesc] = useState('');
    const [selecteditemunit, setSelectedItemUnit] = useState('');
    const [selecteditemprice, setSelectedItemPrice] = useState('');
    const [minimumquantity, setMinimumQuantity] = useState(0);
    const [selecteditemid, setSelectedItemId] = useState(0);

    const handleSelect = (event) => {
      var res = event.target.value.split("#");     
      console.log(event.target.value);
      setSelectedItemId(res[4]);
      setSelectedItem(res[0]); 
      setSelectedItemDesc(res[1]);
      setSelectedItemUnit(res[2]);
      setSelectedItemPrice(res[3]);
    };

    const handleChangeLocations = (event) => {
        var res = event.target.value.split("#");
        console.log(res[0]);
        setLocationId(res[0]);
      };   

    const handleChangeMinimumStock = (event) => {
      setMinimumQuantity(event.target.value);
      console.log(minimumquantity);
    }; 
    
    const handleSave = () => {
      var data = {
        ItemPartNumber: selecteditem,
        quantity: minimumquantity,
        locationId: locationid,
        itemId: selecteditemid,
      };     
      console.log(data); 
      MinimumStockDataService.getIfExists(data)
      .then(response => {
        console.log(response.data);
        if (response.data.length==0) {
          if (selecteditemid) {
            if (locationid) {
              if (!isNaN(minimumquantity)) {
                MinimumStockDataService.create(data)
                .then(response => {             
                  console.log(response.data);
                })
                .catch(e => {
                  console.log(e);
                });
                handleClose();
              }
              else {
                setErrMessage('Invalid quantity.');
                setShowError(true);
                return;  
              }
            }
            else {
              setErrMessage('Select a location to create the minimum stock.');
              setShowError(true);
              return;              
            }
          }
          else {
            setErrMessage('Select a item to create the minimum stock.');
            setShowError(true);
            return;
          }
        }
        else {
          setErrMessage('There exists a minimum stock for the item in that location.');
          setShowError(true);
          return;
        }
      })

    };  

    return (
      <>
        <Button className='m-3' variant="primary" onClick={handleShow}>Add Minimum Stock</Button>      
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Add Minimum Stock
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-start flex-wrap"> 
              <div className="m-1"> 
                <label className="mr-5" htmlFor="partnumber">Part Number</label>
                <input
                  type="text"
                  name="partnumber"
                  id="partnumber"
                  className="form-control" style={{width:'180px',}}
                  value={selecteditem} />             
                <SearchItems handleSelect={handleSelect}/>
              </div>
              <div className="m-1">
                <label className="mr-5" htmlFor="description">Description</label>
                <input
                  disabled
                  type="text"
                  name="description"
                  id="description"
                  className="form-control" style={{width:'100%',}}
                  //disabled
                  value={selecteditemdesc} />
              </div>

              <div className="m-1">
                <label className="mr-5" htmlFor="location">Location:</label>
                <select
                    type="text"
                    name="location"
                    id="location"
                    className="form-control" style={{width:'180px',}}
                    onChange={handleChangeLocations}>
                    <option disabled selected value> -- Select an option -- </option>   
                    <ListOfLocations locs = {props.locations}/>         
                </select>
              </div>             
              <div className="m-1">
                <label className="mr-5" htmlFor="packprice">Minimum Stock:</label>
                <input className="form-control mb-3"
                  type="number"
                  name="minimumstock"
                  id="minimumstock"
                  onChange={handleChangeMinimumStock}
                />
              </div>  
            </div>
            <div className="d-flex justify-content-start flex-wrap">
                <Button onClick={handleSave}>Save</Button>
            </div>
            {showerror && (
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>{errmessage}</p>
              </Alert>      
            )}             
          </Modal.Body>
        </Modal>
      </>
    );
  }
  
  export default AddMinimumStockPage;
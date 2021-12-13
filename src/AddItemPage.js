import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import CurrencyFormat from 'react-currency-format';
import ItemDataService from "./services/item.service";
import LocationDataService from "./services/location.service";
import SubLocationDataService from "./services/sublocation.service";
import S3Uploader from 'react-aws-s3-uploader'; // import the component
import MovementDataService from "./services/movement.service";
import MovementItemDataService from "./services/movementitem.service";
import SupplierDataService from "./services/supplier.service";

const user = JSON.parse(localStorage.getItem("user"));

class AddItemsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);

    this.onChangePartNumber = this.onChangePartNumber.bind(this);
    this.onChangeItemDescription = this.onChangeItemDescription.bind(this);
    this.onChangeUnitOfMeasure = this.onChangeUnitOfMeasure.bind(this);
    this.retrieveLocations = this.retrieveLocations.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.onChangeQty = this.onChangeQty.bind(this);
    this.handleChangeSubloc = this.handleChangeSubloc.bind(this);
    this.handleChangeStock = this.handleChangeStock.bind(this);
    this.getNextId = this.getNextId.bind(this);
    this.handleValidations = this.handleValidations.bind(this);
      
    this.state = {
      id: null,
      id2: null,
      itemPartNumber: "",
      itemDesc: "",
      unitofmeasure: "PACK",
      unitPrice: null,
      supplier: "EMTELLE",
      suppliers:[],
      supplierid: 1,      
      packprice: null,
      productqty: "",
      file: "",
      locations: [],
      sublocations: [],
      mylocation: '',
      characters: [],
      total:'',
      stockqty:'',
      sublocation:'',
      movementnumber:'',
      submitted: false, 
      showsuccess: false,
      showerror: false,
      errmessage:'',     
      successmessge: '',            
    };

  }

  handleValidations() {
    if (this.state.itemPartNumber.length==0) {
      this.setState({errmessage:'Item part number can not be empty.'})
      this.setState({showerror:true})
      return;
    }
    {
      if (this.state.itemDesc.length==0) {
        this.setState({errmessage:'Item description can not be empty.'})
        this.setState({showerror:true})
        return;        
      }
      {
        this.getNextId();
      }
    }
  }   

  removeCharacter = (index) => {    
    const {characters} = this.state

    this.setState({
      characters: characters.filter((character, i) => {
        return i !== index
      }),
    },this.handleChangeTotalMovement)
  }

  getNextId() {
    MovementDataService.getMaxId()
      .then(response => {   
        var numId = response.data[0].maxId+1 
        var nextId = numId.toString().padStart(5,'0')
        this.setState({
          movementnumber: nextId
        },this.saveItem.bind(this));     
      })      
      .catch(e => {
        console.log(e);
      });  
  }

  componentDidMount() {
    this.retrieveLocations();
    this.retrieveSuppliers();
  }

  addInitialStock = () => {
    this.setState({characters: [...this.state.characters, this.state]},this.handleChangeTotalMovement)
  }

  handleChangeTotalMovement = () => {
    var mysub=0
    const rows = this.state.characters.map((row, index) => {
      mysub+=row.stockqty*row.unitPrice      
    })
    this.setState({total:mysub*1.2})
    console.log(this.state.total)
  }

  handleChangeStock(e) {
    this.setState({
      stockqty: e.target.value
    });
  }

  handleChangeSubloc(e) {
    this.setState({
      sublocation: e.target.value
    });
  }

  retrieveLocations() {
    LocationDataService.getAll()
      .then(response => {
        this.setState({
            locations: response.data
        });
        //console.log(response.data);
        //console.log(this.state.locations);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangePartNumber(e) {
    this.setState({
      itemPartNumber: e.target.value
    });
  }

  onChangeQty(e) {
    this.setState({
      productqty: e.target.value
    });
  }

  onChangeItemDescription(e) {
    this.setState({
      itemDesc: e.target.value
    });
  }

  onChangeUnitOfMeasure(e) {
    this.setState({
      unitofmeasure: e.target.value
    });
  }

  handleChangeSupplier = (event) => {    
    var res = event.target.value.split("#");
    this.setState({supplierid: res[0]});
    this.setState({supplier: res[1]});
  }

  saveItem(e) {
    
    var data = {
      ItemPartNumber: this.state.itemPartNumber,
      ItemDescription: this.state.itemDesc,
      UnitOfMeasure: this.state.unitofmeasure,
      UnitPrice: this.state.unitPrice,
      Supplier: this.state.supplier,
      supplierId: this.state.supplierid,
      PackPrice: this.state.packprice,
      ImagePath: this.state.file,
      ProductQty: this.state.productqty,
      LocationActive: '1',
    };

    ItemDataService.create(data)
      .then(response => {
        this.setState({
          id2: response.data.id,
          showsuccess: true,
          successmessge: 'Item part number ' + this.state.itemPartNumber + ' has been created successfully',          
          itemPartNumber: response.data.ItemPartNumber,
          itemDesc: response.data.ItemDescription,
          unitofmeasure: response.data.UnitOfMeasure,
          unitPrice: response.data.UnitPrice,
          supplier: response.data.Supplier,
          supplierid: response.data.supplierId,
          packprice: response.data.PackPrice,
          file: response.data.ImagePath,
          productqty: response.data.ProductQty,
        },this.handleSave.bind(this));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
        this.setState({
          showerror: true,
          errmessage: e,
        });
      });
      //window.location.href = "/itemspage";
  }

  handleClick(e) {
    this.refs.fileUploader.click();
  }

  handleFile = (file) => {
    this.setState({
      file
    });
  }

  handleChangeLocations = (event) => {
    var res = event.target.value.split("#");
    this.setState({
      locationId: res[0],
    }, () => this.retrieveFilterSubLocations())
    this.setState({
      mylocation: res[1],
    })         
    this.setState({
      sublocation: '',
    })  
    //console.log(document.getElementById('sublocation').value)
    document.getElementById('sublocation').value='0'
  };

  retrieveFilterSubLocations() {
    SubLocationDataService.getCondition(this.state.locationId)
      .then(response => {
        this.setState({
            sublocations: response.data
        });   
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleSave = () => {
    // movements
    var data = {
      RaisedBy: user.username,
      userId: user.id,
      MovementType: 5,
      MovementNumber: this.state.movementnumber,
      TotalMovement: this.state.total,
      SpecialNotes: 'THIS MOVEMENT WAS GENERATED AUTOMATICALLY AS RESULT OF AN INITIAL STOCK OF ITEM ' + this.state.itemPartNumber,
    };
  
    MovementDataService.create(data)
      .then(response => {          
        this.setState({
          id: response.data.id,
          movementtype: response.data.MovementType,
          movementnumber: response.data.MovementNumber,
          total: response.data.TotalMovement,
          specialnotes: response.data.SpecialNotes,
          submitted: true,
        },this.handleSaveMovementItems.bind(this));        
      })      
      .catch(e => {
        console.log(e);
      });      
  }

  // movement items    
  handleSaveMovementItems = () => {   
    var myid = this.state.id; 
    var myid2 = this.state.id2;
    this.state.characters.forEach(function (item, index) {      
      var data = {
        ItemId: item.itemPartNumber,
        ItemDescription: item.itemDesc,
        UnitOfMeasure: item.unitofmeasure,
        UnitPrice: item.unitPrice,
        Quantity: item.stockqty,
        Location: item.mylocation,
        SubLocation: item.sublocation,
        MovementImplemented: 1,
        movementId: myid,
        iditem: myid2,
      };
        
      MovementItemDataService.create(data)
        .then(response => {
        //window.location.href = "/";
        // you don't really need the following
        //  this.setState({
        //    id: response.data.id,
          })
          .catch(e => {
            console.log(e);
          });
        //})
    })
    console.log('hey');
    window.location.reload();    
  }

  retrieveSuppliers = () => {
    SupplierDataService.getAll()
      .then(response => {
        this.setState({
          suppliers: response.data
        });
        console.log(response.data);
        //console.log(this.state.suppliers);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { characters } = this.state.characters
    return (
      <>
      <h1>ADD ITEM</h1>
      <Container>
        <form block>
          <div className="d-flex justify-content-start flex-wrap">
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="partnumber">Part Number</label>
              <input
                style={{width:'200px',}}
                className="form-control"
                type="text"
                name="partnumber"
                id="partnumber"
              //  value={itemPartNumber}
                onChange={this.onChangePartNumber} />
            </div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="description">Description</label>
              <input
                style={{width:'200px',}}
                className="form-control"
                type="text"
                name="description"
                id="description"
              //  value={itemDesc}
                onChange={this.onChangeItemDescription} />
            </div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="uom">Supplier</label>
              <select onChange={this.handleChangeSupplier} style={{width:'200px',}} className="form-control" id="supplier" name="supplier">
                <ListOfSuppliers suppliers = {this.state.suppliers}/>
              </select>            
            </div>
          </div>
          <div className="d-flex justify-content-start flex-wrap">
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="uom">Unit of Measure</label>
              <select onChange={this.onChangeUnitOfMeasure} style={{width:'200px',}} className="form-control" id="uom" name="uom">
                <option value="PACK">PACK</option>
                <option value="BAG">BAG</option>
                <option value="ROLL">ROLL</option>
                <option value="DRUM">DRUM</option>
                <option value="BOX">BOX</option>
                <option value="UNIT">UNIT</option>
              </select>
            </div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="price">Unit price</label>
              <CurrencyFormat className="form-control" style={{width:'200px',}} id="price" name="price" thousandSeparator={true} prefix={'£'} onValueChange={(values) => {
                const {formattedValue, value} = values;
                // formattedValue = $2,223
                // value ie, 2223
                this.setState({profit: formattedValue})                
                this.setState({unitPrice: value})  
              }}
              onChange={this.onChangeUnitPrice}/>
            </div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="packPrice">Pack price</label>
              <CurrencyFormat className="form-control" style={{width:'200px',}} id="packPrice" name="packPrice" thousandSeparator={true} prefix={'£'} onValueChange={(values) => {
                const {formattedValue, value} = values;
                // formattedValue = $2,223
                // value ie, 2223
                this.setState({profit: formattedValue})
                this.setState({packprice: value}) 
              }}
              onChange={this.onChangePackPrice}/>
            </div>
          </div>
          <div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="productqty">Product Quantity</label>
              <input
                style={{width:'200px',}}
                className="form-control"
                type="number"
                name="productqty"                
                id="productqty"
                onChange={this.onChangeQty} />
            </div>
          </div>
          <div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="productPicture">Picture</label>
              <S3Uploader
                buttonName="Browse"
                bucketRegion="eu-west-2"
                albumBucketName="items-media" // Bucket Name
                IdentityPoolId="eu-west-2:b6dd25aa-9528-43fa-a662-1f5da3502f00" // Identity Pool Id
                handleFile={this.handleFile}
              />
              <input
                style={{width:'200px',}}
                className="form-control"
                type="text"
                name="imagepath"                
                id="imagepath"
                value={this.state.file} />
            </div>
          </div>
          <hr />
          <div style={{textAlign: 'center',}}>
            <h4>Initial stock</h4>
            <h7>Once saved, it can not be modified</h7> 
          </div>
          <div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="location">Location</label>
              <select
                disabled={(this.state.itemPartNumber=='') || (this.state.itemDesc=='') || (this.state.unitPrice=='') || (this.state.unitofmeasure=='')}
                type="text"
                name="mylocation"
                id="mylocation"
                className="form-control" style={{width:'180px',}}
                onChange={this.handleChangeLocations}>
                <option disabled selected value> -- Select an option -- </option>            
                <ListOfLocations locs = {this.state.locations}/>
              </select>
            </div>              
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="sublocation">Sublocation</label>
              <select
                disabled={(this.state.itemPartNumber=='') || (this.state.itemDesc=='') || (this.state.unitPrice=='') || (this.state.unitofmeasure=='')}
                type="text"
                name="sublocation"
                id="sublocation"
                className="form-control" style={{width:'180px',}}
                onChange={this.handleChangeSubloc}>   
                <ListOfSubLocations resetLoc = {this.state.resetLoc} sublocs = {this.state.sublocations}/>
              </select>
            </div>
            <div className="m-2 d-flex flex-wrap">
              <label style={{width:'150px',}} htmlFor="locationqty">Stock</label>
              <input
                disabled={(this.state.itemPartNumber=='') || (this.state.itemDesc=='') || (this.state.unitPrice=='') || (this.state.unitofmeasure=='')}
                style={{width:'200px',}}
                className="form-control"
                type="number"
                name="locationqty"
                id="locationqty"
                onChange={this.handleChangeStock} />
            </div>
          </div>
          <Button className="m-3" value="Submit" onClick={this.addInitialStock}>Add Initial Stock</Button> {/*onClick={this.addInitialStock({'itemPartNumber':'1'})} */}
          </form>
          <div>
            <Container>
              <Table striped bordered hover size="sm">
                <TableHeader />
                <TableBody 
                  characterData={this.state.characters}
                  removeCharacter={this.removeCharacter.bind(this)}
                  handleChangeTotalMovement={this.handleChangeTotalMovement.bind(this)}/>
              </Table>
            </Container>
          </div>
          <hr />
          <div>
            {this.state.showerror && (
              <Alert variant="danger" onClose={() => this.setState({showerror:false})} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>{this.state.errmessage}</p>
              </Alert>      
            )}
          </div>
          <div>
            {this.state.showsuccess && (
              <Alert variant="success" onClose={() => this.setState({showsuccess:false})} dismissible>
                <Alert.Heading>Done</Alert.Heading>
                <p>{this.state.successmessge}</p>
              </Alert>      
            )}
          </div>          
          <div className="d-flex justify-content-center">              
            <Button className="m-3" value="Submit" onClick={this.handleValidations.bind(this)}>Save New Item</Button>            
          </div>
      </Container>
      
      </>
      
    )
  }
}

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

const ListOfSubLocations = (props) => {
  const rows = props.sublocs.map((row, index) => { 
    return (  
      <option key={index} value={row.LocationId}>        
       {row.SubLocationDescription}
      </option>
    )
  })  
  return (      
    <>    
    <option selected value></option>    
    {rows}
    </>
  )
}

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Part Number</th>
        <th>Description</th>
        <th>Unit</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Location</th>
        <th>Sublocation</th>
      </tr>
    </thead>
  )
}

var mysub = 0

const TableBody = (props) => {
  mysub=0
  const rows = props.characterData.map((row, index) => {
    mysub+=row.stockqty*row.unitPrice   
    
    return (
      //console.log((mysub).reduce((a,b) => a+b,0)),
      <tr key={index}>
        <td>{row.itemPartNumber}</td>
        <td>{row.itemDesc}</td>
        <td>{row.unitofmeasure}</td>
        <td>{row.unitPrice}</td>
        <td>{row.stockqty}</td>
        <td>{row.mylocation}</td>
        <td>{row.sublocation}</td>
        <td>
          <Button variant="primary" onClick={() => props.removeCharacter(index)}><FontAwesomeIcon icon={faTrashAlt} /></Button>{' '}
        </td>
      </tr>
    )    
  })
  return (    
    <>    
    <tbody>{rows}</tbody>
    <tbody>
      <tr>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td colSpan="4">
            <hr />
            <div className="d-flex flex-column flex-nowrap justify-content-center">
              <div className="d-flex flex-row flex-nowrap justify-content-end">
                <div>
                  <label className="m-2">Subtotal:</label>
                </div>
                <div>
                  <CurrencyFormat
                    className="form-control"
                    disabled
                    value={mysub}
                    style={{textAlign:'right',width:'200px',}} id="subtotal" name="subtotal" thousandSeparator={true} prefix={'£'} />
                </div>
              </div>
              <div className="d-flex flex-row flex-nowrap justify-content-end">
                <div>
                  <label className="m-2">VAT - 20%:</label>
                </div>
                <div>
                <CurrencyFormat
                  className="form-control"
                  disabled
                  value={mysub*0.2}
                  style={{textAlign:'right',width:'200px',}} id="vat" name="subtotal" thousandSeparator={true} prefix={'£'} />
                </div>
              </div>
              <div className="d-flex flex-row flex-nowrap justify-content-end">
                <div>
                  <label className="m-2">TOTAL:</label>
                </div>
                <div>
                <CurrencyFormat       
                  className="form-control"
                  disabled
                  value={mysub*1.2}
                  style={{textAlign:'right',width:'200px',}} id="vat" name="total" thousandSeparator={true} prefix={'£'} />
                </div>
              </div>
            </div>
          </td>
      </tr>
    </tbody>
    <hr />
    </>
  )  
}

const ListOfSuppliers = (props) => {
  const rows = props.suppliers.map((row, index) => {
    return (  
      <option key={index} value={row.id +'#' +row.SupplierName}>        
        {row.SupplierName}
      </option>
    )
  })  
  return (      
    <>        
    {rows}
    </>
  )
}

export default AddItemsPage;


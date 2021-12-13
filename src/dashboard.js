import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Button, Table } from 'react-bootstrap';
import MovementDataService from "./services/movement.service";
import MovementItemDataService from "./services/movementitem.service";
import LocationDataService from "./services/location.service";
import CurrencyFormat from 'react-currency-format';
import { Doughnut} from 'react-chartjs-2';
import { Bar} from 'react-chartjs-2';
import { Line} from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchItems from './SearchItems';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TableHeader1 = () => {
  return (
    <thead>
      <tr>
        <th style={{width:'100px'}}>Supplier</th>
        <th style={{width:'100px'}}>Spend</th>
      </tr>
    </thead>
  )
}

const TableHeader2 = () => {
  return (
    <thead>
      <tr>
        <th style={{width:'100px'}}>Month</th>
        <th style={{width:'100px'}}>Spend</th>
      </tr>
    </thead>
  )
}

const TableHeader3 = () => {
  return (
    <thead>
      <tr>
        <th style={{width:'100px'}}>Month</th>
        <th style={{width:'100px'}}>Wastage</th>
      </tr>
    </thead>
  )
}

const TableHeader4 = () => {
  return (
    <thead>
      <tr>
        <th style={{width:'100px'}}>Job Number</th>
        <th style={{width:'100px'}}>Amount</th>
      </tr>
    </thead>
  )
}

var mytotalSpend=0.0;
const TableBody1 = (props) => {  
  mytotalSpend=0.0;
  const rows = props.spendtable.map((row, index) => { 
    mytotalSpend+=parseFloat(row['Total Spend'])
    return (      
      <tr key={index}>        
        <td>  
          {row.Supplier}
        </td>  
        <td>  
        <CurrencyFormat
          disabled
          value={row['Total Spend']}
          fixedDecimalScale={true}                    
          style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />          
        </td>                       
      </tr>
    )
  })     
    
  return (
    <>
    <tbody>
      {rows}
    </tbody>
    <tbody>
      <tr>
        <td>Total Spend:</td>
        <td>
          <CurrencyFormat
            disabled
            value={mytotalSpend}
            decimalScale={2}
            fixedDecimalScale={true}                    
            style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />                  
        </td>
      </tr>
    </tbody>    
    </>
  )     
}


var mytotalSpendByMonth=0.0;
const TableBody2 = (props) => {  
  mytotalSpendByMonth=0.0;
  const rows = props.spendByMonthtable.map((row, index) => { 
    mytotalSpendByMonth+=parseFloat(row['Total Spend'])
    return (      
      <tr key={index}>        
        <td>  
          {monthNames[row.Month-1]}
        </td>  
        <td>  
        <CurrencyFormat
          decimalScale={2}
          disabled
          value={row['Total Spend']}
          fixedDecimalScale={true}                    
          style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />          
        </td>                       
      </tr>
    )
  })     
    
  return (
    <>
    <tbody>
      {rows}
    </tbody>
    <tbody>
      <tr>
        <td>Total Spend:</td>
        <td>
          <CurrencyFormat
            disabled
            value={mytotalSpendByMonth}
            fixedDecimalScale={true}                    
            style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />                  
        </td>
      </tr>
    </tbody>    
    </>
  )     
}

var mytotalWastageByMonth=0.0;
const TableBody3 = (props) => {  
  mytotalWastageByMonth=0.0;
  const rows = props.wastageByMonthtable.map((row, index) => { 
    mytotalWastageByMonth+=parseFloat(row['Total Wastage'])
    return (      
      <tr key={index}>        
        <td>  
          {monthNames[row.Month-1]}
        </td>  
        <td>  
        <CurrencyFormat
          decimalScale={2}
          disabled
          value={row['Total Wastage']}
          fixedDecimalScale={true}                    
          style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />          
        </td>                       
      </tr>
    )
  })     
    
  return (
    <>
    <tbody>
      {rows}
    </tbody>
    <tbody>
      <tr>
        <td>Total Wastage:</td>
        <td>
          <CurrencyFormat
            decimalScale={2}
            disabled
            value={mytotalWastageByMonth}
            fixedDecimalScale={true}                    
            style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />                  
        </td>
      </tr>
    </tbody>    
    </>
  )     
}

var mytotalBookin=0.0;
const TableBody4 = (props) => {  
  mytotalBookin=0.0;
  const rows = props.bookinbyjob.map((row, index) => { 
    mytotalBookin+=parseFloat(row['Total Amount'])
    return (      
      <tr key={index}>        
        <td>  
          {row['JobNumber']}
        </td>  
        <td>  
        <CurrencyFormat
          decimalScale={2}
          disabled
          value={row['Total Amount']}
          fixedDecimalScale={true}                    
          style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />          
        </td>                       
      </tr>
    )
  })     
    
  return (
    <>
    <tbody>
      {rows}
    </tbody>
    <tbody>
      <tr>
        <td>Total Book In:</td>
        <td>
          <CurrencyFormat
            decimalScale={2}
            disabled
            value={mytotalBookin}
            fixedDecimalScale={true}                    
            style={{border:'none',textAlign:'right',}} thousandSeparator={true} prefix={'£'} />                  
        </td>
      </tr>
    </tbody>    
    </>
  )     
}

var dt = new Date();
var mth = (dt.getMonth()+ 1) < 10 ? '0' + (dt.getMonth()+1) : (dt.getMonth()+1);
var yr = dt.getFullYear();

class Dash extends Component {   
  constructor(props) {
    super(props);
    this.retrieveData1 = this.retrieveData1.bind(this);
    this.retrieveSpend = this.retrieveSpend.bind(this);
    this.retrieveSpendByMonth = this.retrieveSpendByMonth.bind(this);
    this.retrieveWastageByMonth = this.retrieveWastageByMonth.bind(this);
    this.retrieveBookInByJob = this.retrieveBookInByJob.bind(this);
    this.retrieveLocations = this.retrieveLocations.bind(this);
    this.retrieveMovementItems = this.retrieveMovementItems.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleChangePartNumber = this.handleChangePartNumber.bind(this);
    //this.retrieveFilterItems = this.retrieveFilterItems.bind(this);
    //this.handleShowStockLoc = this.handleShowStockLoc.bind(this);
    this.state = {
			datatable1: [],
			listofdata1col1: [], // number of months starting on 1
      listofdata1col2: [], // spend on the part number
      spendtable:[],
      spendByMonthtable:[],
      wastageByMonthtable:[],
      bookinByJobtable:[],
      listofsuppliers:[],
      listofspends:[],
      listofmonths1:[], //to use in spend data
      listofmonths2:[], // to use in wastage data
      listofspendsByMonth:[],
      listofwastageByMonth:[],
      listofjobs:[],
      listofbookinsbyjob:[],
      bookinbyjob:'',
      locations:[],
      movementitems:[],
      stockonlocation:[],
      // item selected
      partnumber: '',
      description: '',
      uom: '',
      price: '',
    };
  }  

  //handleChangePartNumber(event) {
  //  this.setState({itempartnumber:event.target.value})
  // }

  componentDidMount() {
    mytotalSpend=0;  
    this.retrieveSpend();
    this.retrieveSpendByMonth();
    this.retrieveWastageByMonth();
    this.retrieveBookInByJob();
    this.retrieveLocations();
    this.retrieveData1();
  }

  retrieveLocations() {
    LocationDataService.getAll()
      .then(response => {
        this.setState({
            locations: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveMovementItems(loc) { 
    MovementItemDataService.findAllConditionGroupByItem(loc)
      .then(response => {   
        this.setState({
          movementitems: response.data,
        });     
        console.log(this.state.movementitems);
      })      
      .catch(e => {
        console.log(e);
      });  
  }

  handleSubmit(event) {
    console.log(event.target.value);
    var auxloc=[];
    for (var i=0;i<=this.state.locations.length-1;i++) {
      if (this.state.locations[i]['LocationId']==event.target.value) {
        auxloc.push(true);
        this.retrieveMovementItems(event.target.value);
      }
      else {
        auxloc.push(false);
      }
    }
    this.setState({stockonlocation: auxloc})
  }

  retrieveSpend() {
    MovementDataService.getSpendBySupplierThisMonth({'mth':mth,'yr':yr})
      .then(response => {   
        this.setState({
          spendtable: response.data,
        });
        this.setState({
          listofsuppliers: this.state.spendtable.map(a => a.Supplier)
        });    
        this.setState({
          listofspends: this.state.spendtable.map(a => a['Total Spend'])
        });                  
        console.log(response.data);
      })      
      .catch(e => {
        console.log(e);
      });   

  }  

  retrieveSpendByMonth() {
    MovementDataService.getSpendByMonth({'yr':yr})
      .then(response => {   
        this.setState({
          spendByMonthtable: response.data,
        });   
        this.setState({
          listofmonths1: this.state.spendByMonthtable.map(a => monthNames[a.Month-1])
        });             
        this.setState({
          listofspendsByMonth: this.state.spendByMonthtable.map(a => a['Total Spend'])
        });          
        console.log(response.data);
      })      
      .catch(e => {
        console.log(e);
      });   
  }  

  retrieveWastageByMonth() {
    MovementDataService.getWastageByMonth({'yr':yr})
      .then(response => {   
        this.setState({
          wastageByMonthtable: response.data,
        });  
        this.setState({
          listofmonths2: this.state.wastageByMonthtable.map(a => monthNames[a.Month-1])
        });             
        this.setState({
          listofwastageByMonth: this.state.wastageByMonthtable.map(a => a['Total Wastage'])
        });              
        console.log(response.data);
      })      
      .catch(e => {
        console.log(e);
      });   
  }

  retrieveBookInByJob() {
    MovementDataService.getBookInByJob({'yr':yr})
      .then(response => {   
        this.setState({
          bookinByJobtable: response.data,
        });  
        this.setState({
          listofjobs: this.state.bookinByJobtable.map(a => a['JobNumber'])
        });             
        this.setState({
          listofbookinsbyjob: this.state.bookinByJobtable.map(a => a['Total Amount'])
        });              
        console.log(response.data);
      })      
      .catch(e => {
        console.log(e);
      });   
  }

  retrieveData1() { 
		const currdt = new Date();
		const yr = currdt.getFullYear();
		const pn = this.state.partnumber;
		var data = {
			yr: yr,
			ItemId: pn
		}   				   
		console.log(data);		
    MovementItemDataService.getData1(data)
      .then(response => {
        this.setState({
          datatable1: response.data,
        });  
        this.setState({
          listofdata1col1: this.state.datatable1.map(a => a['mth'])
        }); 				
        this.setState({
          listofdata1col2: this.state.datatable1.map(a => a['spend'])
        }); 				   
				console.log(this.state.datatable1);
				var auxllistofspend = [0,0,0,0,0,0,0,0,0,0,0,0];
				for (var i = 0; i<this.state.listofdata1col1.length; i++) {
					var monthnumber = this.state.listofdata1col1[i];
					auxllistofspend.splice(monthnumber-1,1,this.state.listofdata1col2[i])
				}
				this.setState({listofdata1col2: auxllistofspend})
				console.log(auxllistofspend);
      })      
      .catch(e => {
        console.log(e);
      });  
  }
  
  handleSelect = (event) => {
    console.log(event.target.value);
    var res = event.target.value.split("#");
    this.setState({
      ['partnumber']: res[0],
      ['description']: res[1],
      ['uom']: res[2],
      ['price']: res[3],
    })
  };

  render() {
    return (
      <>
        <h1>DASHBOARD</h1>
        <div className="container d-flex flex-wrap justify-content-center">
          <div className="customCard">
            <h2>Spend By Supplier This Month</h2>
            <Table className="m-2" striped bordered hover size="sm">
              <TableHeader1 />
              <TableBody1 spendtable={this.state.spendtable}/>
            </Table>

            <Doughnut
              data={{
                labels: this.state.listofsuppliers,
                datasets: [
                  {
                    label: 'Rainfall',
                    backgroundColor: [
                      '#B21F00',
                      '#C9DE00',
                      '#2FDE00',
                      '#00A6B4',
                      '#6800B4',
                      '#FF5733',
                      '#27C3B7',
                      '#F82FFB',
                      '#FA2BC8'
                    ],
                    hoverBackgroundColor: [
                      '#501800',
                      '#4B5000',
                      '#175000',
                      '#003350',
                      '#35014F',
                      '#C34327',
                      '#1F978E',
                      '#BE24C1',
                      '#D227A9'
                    ],
                    data: this.state.listofspends
                  }
                ]
              }}
              options={{
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />            
          </div>
          <div className="customCard">
          <h2>Spend By Month This Year</h2>
            <Table className="m-2" striped bordered hover size="sm">
              <TableHeader2 />
              <TableBody2 spendByMonthtable={this.state.spendByMonthtable}/>
            </Table>   

            <Bar
              data={{
                labels: this.state.listofmonths1,
                datasets: [
                  {
                    backgroundColor: 'rgba(75,192,192,1)',
                    data: this.state.listofspendsByMonth
                  }
                ]
              }}
              options={{
                legend:{
                  display:false
                }
              }}
            />
          </div>
          <div className="customCard">
          <h2>Wastage By Month This Year</h2>
            <Table className="m-2" striped bordered hover size="sm">
              <TableHeader3 />
              <TableBody3 wastageByMonthtable={this.state.wastageByMonthtable}/>
            </Table> 
            <Bar
              data={{
                labels: this.state.listofmonths2,
                datasets: [
                  {
                    backgroundColor: 'rgba(75,192,192,1)',
                    data: this.state.listofwastageByMonth
                  }
                ]
              }}
              options={{
                legend:{
                  display:false
                }
              }}
            />            
          </div>
          <div className="customCard">
            <h2>Book In by Job Number This Year</h2>
            <Table className="m-2" striped bordered hover size="sm">
              <TableHeader4 />
              <TableBody4 bookinbyjob={this.state.bookinByJobtable}/>
            </Table> 

            <Doughnut
              data={{
                labels: this.state.listofjobs,
                datasets: [
                  {
                    label: 'Rainfall',
                    backgroundColor: [
                      '#B21F00',
                      '#C9DE00',
                      '#2FDE00',
                      '#00A6B4',
                      '#6800B4',
                      '#FF5733',
                      '#27C3B7',
                      '#F82FFB',
                      '#FA2BC8'
                    ],
                    hoverBackgroundColor: [
                      '#501800',
                      '#4B5000',
                      '#175000',
                      '#003350',
                      '#35014F',
                      '#C34327',
                      '#1F978E',
                      '#BE24C1',
                      '#D227A9'
                    ],
                    data: this.state.listofbookinsbyjob
                  }
                ]
              }}
              options={{
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />                   
          </div>
{/********************************** S T A R T S  S P E N D   B Y   P A R T   N U M B E R ****************************** */}
          <div className="customCard">
            <h4>Spend By Part Number</h4>
						<div className='d-flex flex-wrap align-items-center'>
							<label style={{width:'100px'}} className="mr-5" htmlFor="pn">Part Number</label>
							<input
                value={this.state.partnumber}
                //onChange={this.handleChangePartNumber}
								type="text"
								name="pn"
								id="pn"
								className="form-control" style={{width:'180px',}}
								>							
							</input>
              <SearchItems handleSelect={this.handleSelect}/>
              <Button className='ml-2' onClick={this.retrieveData1}><FontAwesomeIcon icon={faPlayCircle} /></Button>				              	
						</div>   
						<div className='mb-3 d-flex flex-wrap align-items-center'>
							<label style={{width:'100px'}} className="mr-5" htmlFor="pn">Description</label>
							<input
                disabled
								type="text"
								name="desc"
                id="desc"
                value={this.state.description}
								className="form-control" style={{width:'270px',}}
								>							
							</input>				              	
						</div>                       
            <Line
              data={{
                labels: monthNames,
                datasets: [
                  {
                    label: 'Spend by month',
										pointBackgroundColor: 'rgb(0, 123, 255)',
										pointHoverBackgroundColor: 'rgb(18,59,75)',
										backgroundColor: 'rgb(18, 59, 75)',
										borderColor: 'rgb(18, 59, 75)',	
										borderWidth: 3,									
										fill: false,
										lineTension: 0.1,
                    data: this.state.listofdata1col2
                  }
                ]
              }}
              options={{
                legend:{
                  display:false,
								},
								scales:{
									yAxes: [{
										ticks: {
											// Include a sign in the ticks
											callback: function(value, index, values) {
													return '£ ' + value;
											}
										}										
									}]
								}
              }}
            />            
          </div>
{/********************************** E N D S   S P E N D   B Y   P A R T   N U M B E R ****************************** */}
          <div className="stock-card ">
            <h2>Available stock on locations</h2>
            <ListOfLocations 
              locs = {this.state.locations}
              handleSubmit={this.handleSubmit}
              stockonlocation={this.state.stockonlocation}
              movementitems={this.state.movementitems}
              />
          </div>   
        </div>                          
      </>
    );
  }
};

const ListOfLocations = (props) => {    
  const rows = props.locs.map((row, index) => {    
    return (  
      <>
      <div className='d-flex justify-content-start align-items-center'>
        <div className='m-3'>
          <Button>+</Button>
        </div>
        <Button 
          variant="link"
          key={index}
          value={row.LocationId}
          onClick = {props.handleSubmit}
          >
          {row.LocationDescription}
        </Button>
      </div>   
      {(props.stockonlocation[index]) && (
        <div>
          <StockTable movementitems={props.movementitems}></StockTable>
        </div>
      )}
      {(!props.stockonlocation[index]) && (
        null
      )}            
      </>
    )
  })  
  return (      
    <>        
    {rows}
    </>
  )
}

const StockTable = (props) => {
  return (
    <Container>
      <Row>
        <Table className="m-2" striped bordered hover size="sm">
          <TableHeader />
          <TableBody movementitemsObj={props.movementitems}/>
        </Table>
      </Row>
    </Container> 
  )
}

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th style={{width:'9%'}}>Location</th>
        <th style={{width:'15%'}}>Item Part Number</th>
        <th style={{width:'30%'}}>Item Description</th>
        <th style={{width:'12%'}}>Unit</th>
        <th style={{width:'12%'}}>Unit Price</th>
        <th style={{width:'12%'}}>Total Stock</th>
      </tr>
    </thead>
  )
}
  
const TableBody = (props) => {
  
  const rows = props.movementitemsObj.map((row, index) => { 
    return (            
      <tr key={index}>        
        <td style={{width:'9%'}}>
          {row.Location}
        </td>
        <td style={{width:'15%'}}>  
          {row.ItemId}
        </td>
        <td style={{width:'30%'}}>  
          {row.ItemDescription}
        </td>
        <td style={{width:'12%'}}>  
          {row.UnitOfMeasure}
        </td>
        <td style={{width:'12%'}}>  
          <CurrencyFormat 
            disabled={true}
            decimalScale={2}
            fixedDecimalScale={true}
            style={{border:'none',textAlign:'right'}}
            value={row.UnitPrice}
            thousandSeparator={true} prefix={'£'} />
        </td>                        
        <td style={{width:'12%',textAlign:'right'}}>
          {row.total}
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
export default Dash;

import React, {Component} from 'react'
import MyTable from './Table'
import MyForm from './Form'
import MyHeadBookIn from './HeadBookIn'
import Example from './FormSendMov'
import 'bootstrap/dist/css/bootstrap.min.css';
import MovementDataService from "./services/movement.service";
import MovementItemDataService from "./services/movementitem.service";

const user = JSON.parse(localStorage.getItem("user"));

class BookInPage extends Component {
  constructor (props) {
    super(props);  
    this.state = {};
    this.state = {
      movementtype:2,
      movementnumber:'',
      raisedby:'',
      raisedbyid:0,
      jobnumber:'',
      total:'',
      specialnotes:null,
      characters: [],
      id:'',
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

  state = {
    characters: [],
  }

  handleChangeRaisedBy = (event) => {
    this.setState({raisedby:event.target.value})
  }

  handleChangeTotalMovement = () => {
    var mysub=0
    const rows = this.state.characters.map((row, index) => {
      mysub+=row.qty*row.rawvalue      
    })
    this.setState({total:mysub*1.2})
  }

  handleChangeJobNumber = (event) => {
    this.setState({jobnumber:event.target.value})
  }

  handleChangeSpecialNotes = (event) => {
    this.setState({specialnotes:event.target.value})
  }

  handleSubmit = (character) => {
    this.setState({characters: [...this.state.characters, character]},this.handleChangeTotalMovement)
  }

  componentDidMount() {
    this.setState({
      raisedby: user.username
    });   
    this.setState({
      raisedbyid: user.id
    });      
    MovementDataService.getMaxId()
      .then(response => {   
        var numId = response.data[0].maxId+1 
        var nextId = numId.toString().padStart(5,'0')
        this.setState({
          movementnumber: nextId
        });
        console.log(response.data[0].maxId);        
      })      
      .catch(e => {
        console.log(e);
      });  
  }

  handleSave = () => {
    var data = {
      MovementType: this.state.movementtype,
      MovementNumber: this.state.movementnumber,
      RaisedBy: this.state.raisedby,
      userId: this.state.raisedbyid,
      TotalMovement: this.state.total,
      JobNumber: this.state.jobnumber,
      SpecialNotes: this.state.specialnotes,
    };
    
    MovementDataService.create(data)
      .then(response => {
        var dataupdate = {
          MovementNumber: response.data.id.toString().padStart(5,'0')
        };
        localStorage.setItem("newmov", response.data.id.toString().padStart(5,'0'));  //// 
        MovementDataService.update(response.data.id, dataupdate)        
        this.setState({
          id: response.data.id,
          movementtype: response.data.MovementType,
          movementnumber: response.data.MovementNumber,
          raisedby: response.data.RaisedBy,
          total: response.data.TotalMovement,
          jobnumber: response.data.JobNumber,
          specialnotes: response.data.SpecialNotes,
          submitted: true
        },this.handleSaveMovementItems);        
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleSaveMovementItems = () => {  
    // movement items
    var myid = this.state.id 
    this.state.characters.forEach(function (item, index) {
      var data = {
        ItemId: item.partnumber,
        ItemDescription: item.description,
        UnitOfMeasure: item.uom,
        UnitPrice: item.price,
        Quantity: -1*item.qty,
        Location: item.mylocation,
        SubLocation: item.sublocation,
        MovementImplemented: 1, //this.state.characters[0].partnumber,
        movementId: myid,
        iditem: item.iditem,
      };
      
      MovementItemDataService.create(data)
        .then(response => {
          window.location.href = "/";
          //this.setState({
            //id: response.data.id,
            //});
        })
        .catch(e => {
          console.log(e);
        });
    })

  }

  render(props) {
    const { characters } = this.state

    return (
      <div style={{width: '100%', float: 'right'}}>
        <MyHeadBookIn 
          handleChangeRaisedBy={this.handleChangeRaisedBy}
          handleChangeTotalMovement={this.handleChangeTotalMovement}
          handleChangeJobNumber={this.handleChangeJobNumber}
          handleChangeSpecialNotes={this.handleChangeSpecialNotes} 
          lastId={this.state.movementnumber}     
          raisedby={user.username}                 
        />
        <MyTable characterData={characters} removeCharacter={this.removeCharacter} />
        <MyForm  handleSubmit={this.handleSubmit} />
        <Example 
          characters={this.state.characters}
          movementtype={this.state.movementtype}
          movementnumber={this.state.movementnumber}
          raisedby={this.state.raisedby}
          total={this.state.total}
          jobnumber={this.state.jobnumber}
          specialnotes={this.state.specialnotes}
          handleSave={this.handleSave}        
        />
      </div>

    )
  }
}

export default BookInPage;


import axios from "axios";
import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col, Button } from "react-bootstrap";
import Toolbar from "./components/Toolbar";
class App extends Component {
    constructor(props) {
      super(props);
      this.state = { data: []};
      this.updateSales=this.updateSales.bind(this);

    }
async retrieveSales() {
    
    const result = await axios({
      method:'get',
      url:'http://localhost:3000/total_sales',
      header: {origin:"origin"}
    })
      .then(function (response) {   
        return response.data;;
      })
      return result

  }

async updateSales() {
  const response = await this.retrieveSales();
  console.log(await response);
  this.setState({data:(await response)});
  
}
  render () {
    return (
      <div>
        
        <Container className="flat_menu">
            <Row>
            <Col className="columns"><Button bsstyle="primary" onClick={this.retrieveSales}>Home</Button></Col>
            <Col className="columns"><Button bsstyle="primary" onClick={this.updateEmployees}>Employees</Button></Col>
            <Col className="columns"><Button bsstyle="primary" onClick={this.updateSales}>Carmodels</Button></Col>
            <Col className="columns"><Button bsstyle="primary" onClick={this.updateSales}>Sales</Button></Col>
            
          </Row>
          </Container>
       </div>
    )//Tanken var att här bygga vidare på front-end. Om man kollar i webbläsarens konsol så kan man iallafall se att inläsningen av data fungerar så långt.

  }
}

export default App
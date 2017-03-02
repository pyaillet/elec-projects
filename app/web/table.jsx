// with es6
import React from 'react';
import ReactDOM from 'react-dom';
import ReactBsTable from 'react-bootstrap-table';
// import findAll from '../facades/component-facade';
import jsonFetch from 'json-fetch';
import math from 'mathjs';

function findAll() {
  return jsonFetch('http://localhost:3000/components', {
    method: 'GET',
    credentials: 'omit', // "include" by default, be careful!
    // mode: 'no-cors',
  });
}

class Hello extends React.Component {
  render() {
    return <h1>Hello</h1>
  }
}

class ComponentTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      components: []
    };
  }

  componentDidMount() {
    let self = this;
    findAll()
      .then(response => {
        let reworkedObj = response.body.map((obj) => {
          let newObj = obj;
          if (obj.value != null) {
            newObj.value = math.format(math.unit(obj.value+" "+obj.unit), 4);
          }
          return newObj;
        });
        self.setState({
          components: reworkedObj
        })
      }).catch(err => {
        // handle non 200-level responses:
        console.log("KO");
        console.log(err.message)
        console.log(err.body)
        console.log(err.status)
        console.log(err.statusText)
        console.log(err.headers)
      })
  }

  render() {
    return <BootstrapTable data={this.state.components} striped hover search>
        <TableHeaderColumn isKey dataField='component_id'>Component ID</TableHeaderColumn>
        <TableHeaderColumn dataField='type' dataSort filter={ { type: 'TextFilter', placeholder: 'Please enter a value' } }>Type</TableHeaderColumn>
        <TableHeaderColumn dataField='subtype'>Subtype</TableHeaderColumn>
        <TableHeaderColumn dataField='model'>Model</TableHeaderColumn>
        <TableHeaderColumn dataField='value' dataSort>Value</TableHeaderColumn>
        <TableHeaderColumn dataField='code'>Code</TableHeaderColumn>
        <TableHeaderColumn dataField='stock'>Stock</TableHeaderColumn>
        <TableHeaderColumn dataField='other'>Other</TableHeaderColumn>
        <TableHeaderColumn dataField='datasheet_link'>Datasheet link</TableHeaderColumn>
    </BootstrapTable>;
  }
}

ReactDOM.render(<Hello/>, document.getElementById('hello'));
ReactDOM.render(
  <ComponentTable />,
  document.getElementById('basic')
);

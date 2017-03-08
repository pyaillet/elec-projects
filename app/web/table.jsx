// with es6
import React from 'react';
import ReactDOM from 'react-dom';
import ReactBsTable from 'react-bootstrap-table';
// import findAll from '../facades/component-facade';
import jsonFetch from 'json-fetch';
import math from 'mathjs';
import request from 'superagent';
import json from 'json5';

let urlServer = 'http://localhost:3000';

function findAll() {
  return jsonFetch(urlServer+'/components', {
    method: 'GET',
    credentials: 'omit', // "include" by default, be careful!
    // mode: 'no-cors',
  });
}

function updateComponent(component) {
  return request.post(urlServer+'/component')
      .send(component)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        console.log(err);
        console.log(res);
      });
};

function onAfterSaveCell(row, cellName, cellValue) {
  return updateComponent({ component: row });
}

function onBeforeSaveCell(row, cellName, cellValue) {
  return true;
}

function onAfterInsertRow(row) {
  return updateComponent({ component: row });
}

function customConfirm(next, dropRowKeys) {
  const dropRowKeysStr = dropRowKeys.join(',');
  if (confirm(`(It's a custom confirm)Are you sure you want to delete ${dropRowKeysStr}?`)) {
    // If the confirmation is true, call the function that
    // continues the deletion of the record.
    next();
  }
}

function onAfterDeleteRow(rowKeys) {
  Promise.all(rowKeys.map((rowKey) => {
    return request.post(urlServer+'/component/delete')
      .send({ id: rowKey })
      .end((err, res) => {
        console.log(err);
        console.log(res);
      })
    })).then(() => {
        console.log("Deleted.")
      }).catch((err) => {
        console.log(err);
      })

}

const cellEditProp = {
  mode: 'click',
  blurToSave: true,
  beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
  afterSaveCell: onAfterSaveCell  // a hook for after saving cell
};

const options = {
  afterInsertRow: onAfterInsertRow,   // A hook for after insert rows
  afterDeleteRow: onAfterDeleteRow,  // A hook for after droping rows.
  handleConfirmDeleteRow: customConfirm
};

const selectRowProp = {
  mode: 'checkbox'
};

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
          if (obj.value != null && obj.unit != null) {
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
    return <BootstrapTable data={this.state.components} striped hover cellEdit={ cellEditProp } insertRow={ true } deleteRow={ true } selectRow={ selectRowProp } options={ options }>
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

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import api from 'root/api';
import { ToastContainer, toast } from 'react-toastify';
import { Grid, Column, Icon } from 'semantic-ui-react';
import { Input, Button } from 'semantic-ui-react'
import KYCValidations from '../../../src/contracts/build/KYCValidations.json';


import "./index.scss";

class TradesView extends Component {

  state = {
    wallet: '',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@gmail.com',
    identificationNumber: '84010902434'
  };

  componentDidMount() {
    const contract = require('truffle-contract');
    if(window.web3 !== undefined) {
      const contract1 = window.web3.eth.contract(KYCValidations['abi']).at('0xcDF29525B1b81ea064F123c5524737eAbB5547ed');
      contract1.checkPendingOwnership(
        '0x36709CeE9518d70376e82aD569930941aE3f5479',
        '0x989acdd1d5ae470c92967e0f57f2c2b9296b6ca2c4a50b522e2670cc76642159',
         (err, res) => {
          console.log('err', err);
          console.log('result', res);
        });

      if(window.web3.eth.accounts.length > 0) {
        this.setState({'wallet': window.web3.eth.accounts[0]});
      }
    } else {
      alert('Launch MetaMask!');
    }
  }

  submit = () => {

      //this.state.wallet
    const hash = window.web3.sha3(
      this.state.first_name + this.state.last_name + this.state.email + this.state.identificationNumber
    );

    console.log('hash', hash);


    const data = {
      'token': 'xxx',
      'hashed_data': hash,
      'wallet': this.state.wallet
    }

    api.ValidatePost(data).then(() => {

    });
  };

  render() {
    return (
      <div className="homepage-content">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={8} mobile={16}>
              <h1 className="header">Blockey</h1>
              <div className="box main-box">
                <p>Enter your wallet address and your personal data, to assign this wallet to your identity.</p>
                <br/>
                <div className="main-form">
                  <Input placeholder='Eth wallet address (0x...)' value={this.state.wallet} /><br/>
                  <Input placeholder='First name' value={this.state.first_name} /><br/>
                  <Input placeholder='Last name' value={this.state.last_name} /><br/>
                  <Input placeholder='Email' value={this.state.email} /><br/>
                  <Input placeholder='Identification number' value={this.state.identificationNumber} /><br/>

                  <div className="actions">
                    <Button className="submit-button" onClick={this.submit}>Submit</Button>
                  </div>
                </div>
                <br/>
                <br/>
                <br/>
              </div>
            </Grid.Column>
            <Grid.Column width={8} mobile={16}>

            </Grid.Column>
          </Grid.Row>
        </Grid>

        <ToastContainer autoClose={20000} />
      </div>
    )
  }
}

export default withRouter(TradesView);
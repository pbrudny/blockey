import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import api from 'root/api';
import { ToastContainer, toast } from 'react-toastify';
import { Grid, Column, Icon } from 'semantic-ui-react';
import { Input, Button } from 'semantic-ui-react'

import "./index.scss";

class TradesView extends Component {

  state = {
    wallet: '',
    first_name: 'Kuba',
    last_name: 'W',
  };

  componentDidMount() {
    if(window.web3 !== undefined) {

      console.log('acc', window.web3.eth.accounts);

      if(window.web3.eth.accounts.length > 0) {
        this.setState({'wallet': window.web3.eth.accounts[0]});
      }

    } else {
      alert('Launch MetaMask!');
    }
  }



  submit = () => {

      //this.state.wallet
    const hash = window.web3.sha3( this.state.first_name + this.state.last_name);

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
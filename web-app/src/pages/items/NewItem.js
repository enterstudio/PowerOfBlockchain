import React from 'react'
import { Form, FormGroup, FormControl, Col, Table, Image, InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap-button-loader'

class NewItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      itemEstimate: 1,
      stake: 777,
      confidence: 1
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    const { contract } = this.props
    contract.Estimated().watch((_err, response) => {
      let balance = response.args.balance
      console.log(balance)
    })
  }

  render () {
    return <div className='add-item'>
      <h2>New Submission</h2>
      <Form horizontal>
        <Table hover responsive-sm>
          <tbody>
            <tr>
              <td><Image height='180px' src='https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350' /></td>
              <td><b>BMW</b> (Bayerische Motoren Werke in German, or Bavarian Motor Works in English) is a German multinational company which currently produces automobiles and motorcycles, and also produced aircraft engines until 1945. The company was founded in 1916 and has its headquarters in Munich, Bavaria.</td>
              <td>
                <FormGroup bsSize='large'>
                  <InputGroup>
                    <InputGroup.Addon>€</InputGroup.Addon>
                    <FormControl
                      type='text'
                      name='itemEstimate'
                      value={this.state.itemEstimate}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                </FormGroup>
              </td>
            </tr>
          </tbody>
        </Table>

        <FormGroup>
          <Col sm={10}>
            <FormControl
              type='text'
              name='stake'
              value={this.state.stake}
              placeholder='Enter your stake...'
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={10}>
            <FormControl
              type='text'
              name='confidence'
              value={this.state.confidence}
              placeholder='Enter your confidence...'
              onChange={this.handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button
              bsStyle='primary'
              bsSize='large'
              loading={this.state.isLoading}
              onClick={this.onSubmit}>Add</Button>
          </Col>
        </FormGroup>
      </Form>
    </div>
  }

  handleChange (event) {
    let target = event.target
    this.setState({[target.name]: target.value})
  }

  async onSubmit () {
    this.setState({ isLoading: true })
    const { contract, accounts: [me] } = this.props
    const options = { from: me, gas: 600000 }
    await contract.addAnswer(
      parseInt(this.state.itemEstimate, 10),
      parseInt(this.state.stake, 10),
      parseInt(this.state.confidence, 10), options)
    this.setState({ isLoading: false })
  }

  validFormInput () {
    return this.state.item !== ''
  }
}

export { NewItem }

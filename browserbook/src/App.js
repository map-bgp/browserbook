import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      mod: null,
      inst: null,
    }
  }

  async componentDidMount() {
    {/*// let { instance, module } = await WebAssembly.instantiateStreaming(fetch("main.wasm"), window.go.importObject)
    // await window.go.run(instance)*/}
    this.setState({
      mod: module,
    })
  }

  render() {
    return (
      <div className="App">
      {/*
        // <form>
        //   <input type="text" name="" id="userInput" onChange={(e) => this.handleChange(e)} style={{ marginTop: '100px' }} />
        //   <br />
        //   <button type="submit" onClick={(e) => this.handleSubmit(e)}>Click me to see MAGIC!!</button>
        // </form> */}
        <br />
        <span id="message">
          Hello World
        </span>
      </div>
    )
  }
}

export default App;

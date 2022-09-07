import './css/App.css';

import React, { Component } from 'react';
import {Routes, Route} from 'react-router-dom'

import Docs from "./components/docs"
import Editor from "./components/editor"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Docs />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    );
  }
}

export default App;

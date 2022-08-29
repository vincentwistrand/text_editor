// import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App(props) {
  const [value, setValue] = useState('');

  function save() {
    console.log(value);
  }
  
  return (
    <>
    <div className="App">
        <h1>Text Editor</h1>
        <button className='Save' onClick={save}>Save</button>
        <div className='Editor'>
          <ReactQuill theme="snow" value={value} onChange={setValue} placeholder={"Write something"} />
        </div>
      </div></>
  );
}

export default App;

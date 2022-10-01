import './css/App.css';

import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Docs from "./components/docs"
import TextEditor from "./components/texteditor"
import Login from "./components/login"
import Start from "./components/start"

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/documents" element={<Docs />} />
          <Route path="/texteditor" element={<TextEditor />} />
        </Routes>
      </Router>
    );
}

export default App;

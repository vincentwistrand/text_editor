import './css/App.css';

import React from 'react';
import { Routes, Route } from "react-router-dom";

import Docs from "./components/docs"
import TextEditor from "./components/texteditor"

function App() {
    return (
        <Routes>
          <Route path="/" element={<Docs />} />
          <Route path="/editor" element={<TextEditor />} />
        </Routes>
    );
}

export default App;

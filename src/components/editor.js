import '../css/App.css';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import docsModel from "../models/docs"
import Header from "./header";

function Editor() {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [saved, setSaved] = useState('Save');
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (location.state) {
        setContent(location.state.content);
        setName(location.state.name);
        setId(location.state._id);
      }
      if (!location.state) {
        navigate('/');
      }
    })();
}, []);

  // Save changes in document to database.
  async function save() {
    const doc = { id: location.state._id, name: name, content: content };
    await docsModel.saveDoc(doc);
    setSaved("Saved");
    
    setTimeout(() => {
      setSaved("Save");
    }, 3000);
  }

  // Delete document from database.
  async function deleteDocument() {
    console.log(id);
    const doc = { id: id };
    await docsModel.deleteDoc(doc);
    navigate('/');
  }
  
  return (
    <>
    <Header />
    <div className='editor-page'>
        <h2>{name}</h2>
        <button className='editor-buttons' onClick={() => navigate("/")}>Back</button>
        <button className='editor-buttons' onClick={save}>{saved}</button>
        <button className='editor-buttons editor-delete' onClick={deleteDocument}>Delete</button>
        <div className='Editor'>
          <ReactQuill theme="snow" value={content} onChange={setContent} placeholder={"Write something"} />
        </div>
    </div>
    </>
  );
}

export default Editor;
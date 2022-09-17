import '../css/App.css';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import docsModel from "../models/docs"
import Header from "./header";

function TextEditor({testDoc={}}) {
  const [content, setContent] = useState(testDoc.content || '');
  const [name, setName] = useState(testDoc.name || '');
  const [id, setId] = useState(testDoc._id || '');
  const [saved, setSaved] = useState('Spara');
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
      // eslint-disable-next-line
}, []);

  // Save changes in document to database.
  async function save() {
    const doc = { id: location.state._id, name: name, content: content };
    await docsModel.saveDoc(doc);
    setSaved("Sparat");
    
    setTimeout(() => {
      setSaved("Spara");
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
        <button className='editor-buttons' onClick={() => navigate("/")}>Tillbaka</button>
        <button className='editor-buttons' onClick={save}>{saved}</button>
        <button className='editor-buttons editor-delete' onClick={deleteDocument}>Radera</button>
        <div className='Editor'>
          <ReactQuill theme="snow" value={content} onChange={setContent} placeholder={"Write something"} />
        </div>
    </div>
    </>
  );
}

export default TextEditor;
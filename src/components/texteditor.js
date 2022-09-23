import '../css/App.css';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";

import docsModel from "../models/docs"
import Header from "./header";

import { io } from "socket.io-client";

function TextEditor({testDoc={}}) {
  const [content, setContent] = useState('');
  const [name, setName] = useState(testDoc.name || '');
  const [id, setId] = useState(testDoc._id || '');
  const [saved, setSaved] = useState('');
  const [socket, setSocket] = useState(null);
  const [fromSocket, setFromSocket] = useState(true);
  const [fromSocketCount, setfromSocketCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    setSocket(io("https://jsramverk-editor-viai20.azurewebsites.net"));
  }, []);


  useEffect(() => {
    if (socket) {
      socket.emit("create", id);
    }
    // eslint-disable-next-line
  }, [socket]);


  useEffect(() => {
    (async () => {
      let element = document.querySelector("trix-editor");

      if (testDoc.content) {
        element.value = testDoc.content;
      }

      if (location.state) {

        setContent(location.state.content);
        setName(location.state.name);
        setId(location.state._id);

        element.value = location.state.content;
      }

      if (!location.state) {
        navigate('/');
      }

    })();
      // eslint-disable-next-line
  }, []);


  // When content change, emit content if 
  // content change is not caused by socket.
  useEffect(() => {
    if (!fromSocket && fromSocketCount > 1) {
      let data = {
        _id: id,
        html: content
      };

      if (socket) {
        socket.emit("doc", data);
      }

    } else {
      setfromSocketCount(fromSocketCount + 1);
      setFromSocket(null);
    }
    // eslint-disable-next-line
  }, [content])


  // From socket.
  useEffect(() => {
    if (socket) {

      // Recieve document content and set editor value.
      socket.on("doc", (data) => {
        setFromSocket(true);
        let element = document.querySelector("trix-editor");
        element.value = data.html;
      });

      // If document successfully saved, show confirmation
      // text in browser.
      socket.on("save", (saved) => {
        setSaved(saved);
        setTimeout(() => {
          setSaved("");
        }, 3000);
      });

    };
  }, [socket]);


  // Save changes in document to database.
  async function save() {
    setSaved("Sparar...");

    const doc = { id: location.state._id, name: name, content: content };
    await docsModel.saveDoc(doc);
    
    setTimeout(() => {
      setSaved("");
    }, 3000);
  }


  // Disconnect from socket and go back to choose document page.
  async function goBack() {
    if (socket) {
      socket.disconnect();
      console.log("Disconnected");
    }
    navigate('/');
  }


  // Delete document from database.
  async function deleteDocument() {
    const doc = { id: id };
    await docsModel.deleteDoc(doc);

    if (socket) {
      socket.disconnect();
      console.log("Disconnected");
    }
    navigate('/');
  }

  
  function handleChange(event, newValue) {
    if (newValue !== content) {
      setContent(newValue);
    }
  }
  
  return (
    <>
    <Header />
    <div className='editor-page'>
        <h2>{name}</h2>
        <div className="editor-buttons-parent">
          {// eslint-disable-next-line 
            saved == "" ? <div style={{height: '37px'}}></div>:
            <p className="editor-buttons" style={{color: 'green'}}>{saved}</p>
          }
          <button className="editor-buttons" onClick={goBack}>Tillbaka</button>
          <button className="editor-buttons" onClick={save}>Spara</button>
          <button className='editor-buttons editor-delete' onClick={deleteDocument}>Radera</button>
        </div>
        <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor" />
        <ReactTrixRTEInput
          toolbarId="react-trix-rte-editor"
          onChange={handleChange}
        />
    </div>
    </>
  );
}

export default TextEditor;

//<ReactQuill preserveWhitespace theme="snow" value={content} onChange={setContent} placeholder={"Write something"} />
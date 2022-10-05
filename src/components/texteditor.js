import '../css/App.css';
import userLogo from '../img/userLogo.png';

import React, { useState, useEffect } from 'react';

import "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";

import docsModel from "../models/docs"

import { io } from "socket.io-client";
import authModel from '../models/auth';


function TextEditor({
                      testDoc={},
                      user,
                      docs,
                      currentDoc,
                      setCurrentDoc,
                      token,
                      owner,
                      setEditorMode,
                      setDocs,
                      setUserDocs
                    })
{
  const [currentUser] = useState(user);
  const [currentDocument, setCurrentDocument] = useState(currentDoc);
  const [content, setContent] = useState('');
  const [name, setName] = useState(testDoc.name || '');
  const [id, setId] = useState(testDoc._id || '');
  const [saved, setSaved] = useState('');
  const [socket, setSocket] = useState(null);
  const [fromSocket, setFromSocket] = useState(true);
  const [fromSocketCount, setfromSocketCount] = useState(0);

  const [input, setInput] = useState("");

  const [authUsers, setAuthUsers] = useState("");

  useEffect(() => {
    if (!testDoc) {
      setSocket(io("https://jsramverk-editor-viai20.azurewebsites.net"));
    };
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    if (socket) {
      socket.emit("create", id);
    }
    // eslint-disable-next-line
  }, [socket]);



  useEffect(() => {
    const users = currentDocument.access.map((user, index) => {
          return  <div key={index} className='userIcon'>
                    <img src={userLogo}  alt={"user logo"}/>
                    <p>{user}</p>
                  </div>
    })
    setAuthUsers(users);
    // eslint-disable-next-line
  }, [currentDocument]);


  
  // Set initial information.
  useEffect(() => {
    (async () => {
      let element = document.querySelector("trix-editor");

      if (testDoc.content) {
        element.value = testDoc.content;
      }

      if (currentDocument) {
        setContent(currentDocument.content);
        setName(currentDocument.name);
        setId(currentDocument._id);

        element.value = currentDocument.content;
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

    const doc = currentDocument;
    doc["content"] = content;
    await docsModel.saveDoc(doc, token);
    
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

    setEditorMode("");

    const allDocs = await docsModel.getAllDocs(token);
    const userDocuments = allDocs.filter(doc => {
      return doc.user === currentUser.email;
    });

    setDocs(allDocs);
    setUserDocs(userDocuments)
  }




  // Delete document from database.
  async function deleteDocument() {
    setSaved("Raderar...");
    setTimeout(() => {
      setSaved("");
    }, 3000);

    const doc = { id: id };
    await docsModel.deleteDoc(doc, token);

    if (socket) {
      socket.disconnect();
      console.log("Disconnected");
    }
    
    setEditorMode("");

    const allDocs = await docsModel.getAllDocs(token);
    const userDocuments = allDocs.filter(doc => {
      return doc.user === currentUser.email;
    });

    setDocs(allDocs);
    setUserDocs(userDocuments);
  }




  //
  function handleChange(event, newValue) {
    if (newValue !== content) {
      setContent(newValue);
    }
  }




  // Set editor input to state.
  const handleInputChange = event => {
    setInput(event.target.value);
  };




  // Add clearance to document for a user.
  async function addUser() {
    setSaved("Arbetar...");
    const user = await authModel.getUserByEmail(input);

    if (user) {
      if (!currentDocument.access.includes(input)) {
        const doc = currentDocument;
        doc.access.push(input);
        await docsModel.saveDoc(doc, token);

        setCurrentDocument(doc);

        const users = doc.access.map((user, index) => {
          return  <div key={index} className='userIcon'>
                    <img src={userLogo}  alt={"user logo"}/>
                    <p>{user}</p>
                  </div>
        })
        setAuthUsers(users);


        setInput("");
        setSaved("Användaren har fått behörighet.")
        setTimeout(() => {
          setSaved("");
        }, 3000);

      } else {
        setSaved("Användaren har redan behörighet.")
        setTimeout(() => {
          setSaved("");
        }, 3000);
      }
    } else {
      setSaved("Användaren finns inte.")
      setTimeout(() => {
        setSaved("");
      }, 3000);
    }
  };



  // Remove clearance for a user.
  async function removeUser() {
    setSaved("Arbetar...");
    const user = await authModel.getUserByEmail(input);
    if (user) {
      if (currentDocument.access.includes(input)) {
        const doc = currentDocument;

        var filtered = doc.access.filter(function(value, index, arr){ 
          if (value !== input) {
            return value
          } else {
            return null;
          }
        });

        doc.access = filtered;
        await docsModel.saveDoc(doc, token);

        setCurrentDocument(doc);

        const users = doc.access.map((user, index) => {
          return  <div key={index} className='userIcon'>
                    <img src={userLogo}  alt={"user logo"}/>
                    <p>{user}</p>
                  </div>
        })
        setAuthUsers(users);

        
        setInput("");

        setSaved("Användarens behörighet har tagits bort.")
        setTimeout(() => {
          setSaved("");
        }, 3000);
      } else {
        setSaved("Användaren har inte behörighet.")
        setTimeout(() => {
          setSaved("");
        }, 3000);
      }
    } else {
      setSaved("Användaren finns inte.")
      setTimeout(() => {
        setSaved("");
      }, 3000);

    }
  };



  
  return (
    <>
    <div style={{ width: '150px', marginLeft: '20px', textAlign: 'center' }}>
      <button className='logout' onClick={() => window.location.reload(false)}>Logga ut</button>
      <div style={{textAlign: 'center'}} className='logoutIcon'>
          <img src={userLogo}  alt={"user logo"}/>
          <p>{currentUser.email}</p>
      </div>
      {user.admin === true ? <p>admin</p>:<p style={{marginLeft: '20px'}}>not admin</p>}
    </div>


    <div className='editor-page'>
        <h2>{name}</h2>

        <p>Ägare: {currentDocument.user}</p>
        <div className="editor-buttons-parent">
          {// eslint-disable-next-line 
            saved == "" ? <div style={{height: '37px'}}></div>:
            <p className="editor-buttons" style={{color: 'green'}}>{saved}</p>
          }
          <button className="editor-buttons back-button" onClick={goBack}>Tillbaka</button>
          <button className="editor-buttons save-button" onClick={save}>Spara</button>
          <button className='editor-buttons editor-delete delete-button' onClick={deleteDocument}>Radera</button>
        </div>

        <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor" />
        <ReactTrixRTEInput
          toolbarId="react-trix-rte-editor"
          onChange={handleChange}
        /><br></br><br></br>

        {owner === true ?
        <div className='access-container'>
          Ge eller ta bort behörighet för användare:<br></br><input
            type="text"
            id="message"
            name="message"
            onChange={handleInputChange}
            value={input}
            autoComplete="off"
            placeholder='Email'
          />

          <button className='back-button' onClick={addUser} >Lägg till</button>
          <button className='delete-button' onClick={removeUser} >Ta bort</button><br></br><br></br>

          <h3>Behöriga:</h3>
          <div className='usersContainer'>
              {authUsers}
          </div>
        </div>
        :
          <p></p>
        }
    </div>
    </>
  );
}

export default TextEditor;
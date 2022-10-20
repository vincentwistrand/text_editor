import '../css/App.css';
import userLogo from '../img/userLogo.png';

import React, { useState, useEffect, useRef } from 'react';

import "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import { useReactToPrint } from "react-to-print";

import { io } from "socket.io-client";

import Editor from "@monaco-editor/react";

import docsModel from "../models/docs";
import editorModel from '../models/texteditor';
import codeModel from '../models/code';

require("jspdf-autotable");


function TextEditor({
                      testDoc={},
                      user,
                      currentDoc,
                      token,
                      owner,
                      editorType,
                      setEditorMode,
                      setDocs,
                      setUserDocs
                    })
{
  // Set user and content
  const [currentUser] = useState(user);
  const [currentDocument, setCurrentDocument] = useState(currentDoc);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(testDoc.name || '');
  const [id, setId] = useState(testDoc._id || '');

  const [test] = useState(testDoc.test || '');

  // Show when saving
  const [saved, setSaved] = useState('');

  // Manage socket
  const [socket, setSocket] = useState(null);
  const [fromSocket, setFromSocket] = useState(true);
  const [fromSocketCount, setfromSocketCount] = useState(0);

  const [codeResponse, setCodeResponse] = useState("");

  // Input from give access field
  const [inputAccess, setInputAccess] = useState("");

  // Input from invite field
  const [inputInvite, setInputInvite] = useState("");

  // Display message above invitation input.
  const [invitationStatus, setInvitationStatus] = useState(null);
  const [invitationMessage, setInvitationMessage] = useState(null);

  // Display message above give access to user input.
  const [accessStatus, setAccessStatus] = useState(null);
  const [accessMessage, setAccessMessage] = useState(null);

  // All users who have access to the document
  const [authUsers, setAuthUsers] = useState("");


  // Print PDF
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function managePrint() {
    const html = document.getElementsByClassName("htmlContent");
    html[0].style.display = "block";
    handlePrint();
    html[0].style.display = "none";
  }


  useEffect(() => {
    if (!test) {
      //setSocket(io("https://jsramverk-editor-viai20.azurewebsites.net"));
      setSocket(io("localhost:1337"));
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
      const html = document.getElementsByClassName("htmlContent");

      if (testDoc.content) {
        element.value = testDoc.content;
      }

      if (currentDocument) {
        setContent(currentDocument.content);
        setTitle(currentDocument.name);
        setId(currentDocument._id);

        if (editorType === "text") {
          element.value = currentDocument.content;
        }

        html[0].style.display = "none";
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
        if (editorType === "text") {
          let element = document.querySelector("trix-editor");
          element.value = data.html;
        }
        if (editorType === "code") {
          setContent(data.html);
        }

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
        // eslint-disable-next-line
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
    await editorModel.goBack(  
      socket,
      token,
      setEditorMode,
      currentUser,
      setDocs,
      setUserDocs
    );
  }

  // Delete document from database.
  async function deleteDocument() {
    await editorModel.deleteDocument(  
      socket,
      token,
      setEditorMode,
      currentUser,
      setDocs,
      setUserDocs,
      setSaved,
      id
    );
  }

  // Send invite
  async function sendInvite() {
    if (inputInvite) {
      await editorModel.sendInvite(
        inputInvite,
        title,
        token,
        currentDocument,
        currentUser,
        setCurrentDocument,
        setAuthUsers,
        setInputInvite,
        setInvitationMessage,
        setInvitationStatus
      );
    }
  }

  // Add user access
  async function addUser() {
    if (inputAccess) {
      await editorModel.addUser(
        inputAccess,
        token,
        currentDocument,
        setCurrentDocument,
        setAuthUsers,
        setInputAccess,
        setAccessMessage,
        setAccessStatus
      );
    }
  }

  // Remove user access
  async function removeUser() {
    if (inputAccess) {
      await editorModel.removeUser(
        inputAccess,
        token,
        currentDocument,
        setCurrentDocument,
        setAuthUsers,
        setInputAccess,
        setAccessMessage,
        setAccessStatus
      );
    }
  }

  // Set editor content
  function handleChange(event, newValue) {
    if (newValue !== content) {
      setContent(newValue);
    }
  }

  // Set content of code editor.
  function handleCodeEditorChange(value, event) {
    setContent(value);
  }

  // Handle input from access field
  const handleInputChangeAccess = event => {
    setInputAccess(event.target.value);
  };

  // Handle input from invite field
  const handleInputChangeInvite = event => {
    setInputInvite(event.target.value);
  };

  // Run code
  const runCode = async () => {
    const response = await codeModel.postCode(content);
    setCodeResponse(response);
  }
  
  return (
    <>
    <div className='logout-container'>
      <button className='logout' onClick={() => window.location.reload(false)}>Logga ut</button>
      <div style={{textAlign: 'center'}} className='logoutIcon'>
          <img src={userLogo}  alt={"user logo"}/>
          <p>{currentUser.email}</p>
      </div>
      {user.admin === true ? <p>admin</p>:<p style={{marginLeft: '20px'}}>not admin</p>}
    </div>


    <div className='editor-page'>
        <div className='editor-title-container'>
            <h1>{title}</h1>

            <p>Ägare: {currentDocument.user}</p>

            {// eslint-disable-next-line 
              saved == "" ? <div style={{height: '34px'}}></div>:
              <p className="editor-buttons" style={{color: 'green'}}>{saved}</p>
            }
        </div>

        <div className="editor-buttons-parent">
          <button className="editor-buttons back-button" onClick={goBack}>Tillbaka</button>
          <button className="editor-buttons save-button" onClick={save}>Spara</button>
          {editorType === "text" && <button onClick={() => managePrint()} className="editor-buttons back-button">PDF</button> }
          <button className='editor-buttons editor-delete delete-button' onClick={deleteDocument}>Radera</button>
        </div>

        {editorType === "text" &&
          <>
            <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor"/>
            <ReactTrixRTEInput
              toolbarId="react-trix-rte-editor"
              value={content}
              onChange={handleChange}
            /><br></br><br></br>
          </>
        }

        {editorType === "code" &&
        <>
          <Editor
             height="30vh"
             defaultLanguage="javascript"
             value={content}
             theme="vs-dark"
             onChange={handleCodeEditorChange}
           />
           <button className='back-button' onClick={() => runCode()}>Kör</button>
           <div className='terminal'>
              <code>{codeResponse}</code>
           </div><br></br><br></br>
        </>
        }

        {owner === true &&
        <>
        
        <div className='access-container'>

          <div>________________</div><br></br>

          <h3 style={{marginBottom: '7px'}}>Bjud in en person att registrera sig och få tillgång till att redigera det här dokumentet:</h3>

          {invitationStatus ? 
              <>
              {invitationStatus === "success" ? <div className='invite_success'>{invitationMessage}</div> : <div className='input_error'>{invitationMessage}</div>}
              </>
              :<div style={{height: '13px'}}></div>
          }
          
          <input
            type="email"
            data-testid="invite"
            onChange={handleInputChangeInvite}
            value={inputInvite}
            autoComplete="off"
            placeholder='Email'
          />

          <button className='back-button' onClick={() => sendInvite()}>Bjud in</button><br></br><br></br>

          <div>________________</div><br></br>

          <h3 style={{marginBottom: '7px'}}>Ge eller ta bort behörighet för användare:</h3>

          {accessStatus ? 
              <>
              {accessStatus === "success" ? <div className='invite_success'>{accessMessage}</div> : <div className='input_error'>{accessMessage}</div>}
              </>
              :<div style={{height: '13px'}}></div>
          }

          <input
            type="text"
            data-testid="access"
            onChange={handleInputChangeAccess}
            value={inputAccess}
            autoComplete="off"
            placeholder='Email'
          />

          <button className='back-button' onClick={ () => addUser()} >Lägg till</button>
          <button className='delete-button' onClick={ () => removeUser()} >Ta bort</button><br></br><br></br>

          <h3>Behöriga:</h3>
          <div className='usersAccessContainer'>
              {authUsers}
          </div>
        </div>

        </>}
        <div className='htmlContent' ref={componentRef}><div dangerouslySetInnerHTML={{ __html: content }} style={{padding: '50px'}}></div></div>
    </div>
    </>
  );
}

export default TextEditor;
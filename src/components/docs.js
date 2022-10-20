import '../css/App.css';

import React, { useState, useEffect } from 'react';
import TextEditor from "./texteditor";
import docsModel from "../models/docs";
import authModel from '../models/auth';
import docLogo from '../img/docLogo.png';
import codeLogo from '../img/codeLogo.png';
import userLogo from '../img/userLogo.png';

function Docs({testDocs=[], testUserDocs=[], user=[], token}) {
    const [currentUser] = useState(user);
    const [currentDoc, setCurrentDoc] = useState(null);

    const [docs, setDocs] = useState(testDocs);
    const [userDocs, setUserDocs] = useState(testUserDocs);
    const [usersAndDocs, setUsersAndDocs] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    // Input from create document and js document inputs.
    const [title, setTitle] = useState("");
    const [titleCode, setTitleCode] = useState("");

    // Show texteditor component
    const [editorMode, setEditorMode] = useState(null);
    const [editorType, setEditorType] = useState(null);

    // Show message
    const [createAlert, setCreateAlert] = useState("");
    const [docMessage, setDocMessage] = useState("");
    const [codeMessage, setCodeMessage] = useState("");

    // Set owner true to get access to all options in texteditor component.
    const [owner, setOwner] = useState(true);


    // Get all docs, if admin also get all users.
    useEffect(() => {
        (async () => {
            const userDocuments = await docsModel.getUserDocs(token, currentUser.email);
            const allDocs = await docsModel.getAllDocs(token);

            setUserDocs(userDocuments);
            setDocs(allDocs);

            if (currentUser.admin === true) {
                const users = await authModel.getUsers();
                setAllUsers(users);
            }
        })();
        // eslint-disable-next-line
    }, []);

    // All users with their docs.
    useEffect(() => {
        const uAD = allUsers.map((specificUser, index) => {

            const allDocs = docs.filter(doc => {
                return doc.user === specificUser.email;
            });

            const allUsersDocs = allDocs.map((doc, index) => {
                let fileType = ".doc";
                if (doc.type === "code") {
                    fileType = ".js"
                };
                return <p key={doc._id} style={{fontSize: '11px', margin: '0'}}>{doc.name}{fileType}</p>;
            });
            
            return  <div key={index} className='userIcon'>
                        <img key={user._id} src={userLogo} alt={"user logo"} />
                        <p  key={user.email}>{specificUser.email}</p>
                        {allUsersDocs}
                    </div>
        })
        setUsersAndDocs(uAD);
        // eslint-disable-next-line
    }, [allUsers]);

    // SetTitle of new document.
    const handleInputChange = event => {
        setTitle(event.target.value);
    };

    // SetTitle of new js document.
    const handleInputChangeCode = event => {
        setTitleCode(event.target.value);
    };

    // Open one of your own documents.
    const openDoc = (doc, owner) => {
        setOwner(owner);
        setCurrentDoc(doc);
        setEditorType(doc.type);
        setEditorMode(true);
    };

    // Create new document in database.
    async function newDoc() {
        setDocMessage("");
        if (title === "") {
            return;
        }
        if (title.includes(" ")) {
            setDocMessage("Mellanslag inte tillåtna i filnamnet");
            return;
        }
        setCreateAlert("Skapar...");
        const doc = { user: currentUser.email, name: title, content: "", type: "text" };
        await docsModel.createDoc(doc, token);

        const allDocuments = await docsModel.getAllDocs(token);
        const userDocuments = allDocuments.filter(doc => {
            return doc.user === currentUser.email;
        });

        setDocs(allDocuments)
        setUserDocs(userDocuments);

        setTitle("");
        setCreateAlert("Nytt text-dokument skapat!");
        setTimeout(() => {
            setCreateAlert("");
          }, 3000);
    }

    // Create new js document in database.
    async function newDocCode() {
        setCodeMessage("");
        if (titleCode === "") {
            return;
        }
        if (titleCode.includes(" ")) {
            setCodeMessage("Mellanslag inte tillåtna i filnamnet");
            return;
        }
        setCreateAlert("Skapar...");
        const doc = { user: currentUser.email, name: titleCode, content: "", type: "code" };
        await docsModel.createDoc(doc, token);

        const allDocuments = await docsModel.getAllDocs(token);
        const userDocuments = allDocuments.filter(doc => {
            return doc.user === currentUser.email;
        });
        
        setDocs(allDocuments)
        setUserDocs(userDocuments);

        setTitleCode("");
        setCreateAlert("Nytt javascript-dokument skapat!");
        setTimeout(() => {
            setCreateAlert("");
          }, 3000);
    }

    // Render doc icon
    function docIcon(doc, index, owner) {
        if (doc.type === "text") {
            return  <div key={index} className='docIcon' onClick={() => openDoc(doc, owner)}>
                        <img src={docLogo}  alt={"document logo"}/>
                        <p>{doc.name}.doc</p>
                    </div>
        }
        if (doc.type === "code") {
            return  <div key={index} className='codeIcon' onClick={() => openDoc(doc, owner)}>
                        <img src={codeLogo}  alt={"code logo"}/>
                        <p>{doc.name}.js</p>
                    </div>
        }
    }

  return (
    <>
        {editorMode ? 
            <TextEditor 
                user={currentUser}
                docs={docs}
                currentDoc={currentDoc} 
                setCurrentDoc={setCurrentDoc}
                token={token}
                owner={owner}
                editorType={editorType}
                setEditorMode={setEditorMode} 
                setDocs={setDocs}
                setUserDocs={setUserDocs}
            />
        :
            <>
            <div className='logout-container'>
                <button className='logout' onClick={() => window.location.reload(false)}>Logga ut</button>
                <div style={{textAlign: 'center'}} className='logoutIcon'>
                    <img src={userLogo}  alt={"user logo"}/>
                    <p>{currentUser.email}</p>
                </div>
                {user.admin === true ? <p>admin</p>:<p style={{marginLeft: '20px'}}>not admin</p>}
            </div>
            
            <div className='docs'>
                <h1>Välkommen!</h1>
                {!createAlert ? 
                    <div style={{height: '16px'}}></div>
                    :
                    <div className='create_alert'>{createAlert}</div>
                }

                <h2>Skapa ett nytt dokument</h2>

                {docMessage ? <div className='input_error'>{docMessage}</div>:<div style={{height: '13px'}}></div>}

                <div className='createDocInput'>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        onChange={handleInputChange}
                        value={title}
                        autoComplete="off"
                        placeholder='filnamn'
                    />

                    <button onClick={() => newDoc()}>Skapa</button>
                </div>

                <h2>Skapa ett nytt javascript-dokument</h2>

                {codeMessage ? <div className='input_error'>{codeMessage}</div>:<div style={{height: '13px'}}></div>}

                <div className='createDocInput'>
                    <input
                        type="text"
                        onChange={handleInputChangeCode}
                        value={titleCode}
                        autoComplete="off"
                        placeholder='filnamn'
                    />

                    <button onClick={() => newDocCode()}>Skapa</button>
                </div>

                <p>_____________</p>

                <h2>Dina dokument</h2>

                <div className='docsContainer'>
                    {userDocs.map((doc, index) => {
                        const owner = true;
                        return docIcon(doc, index, owner);
                        })}
                </div>

                <p>_____________</p>

                <h2>Dokument du givits tillgång till</h2>
                <div className='docsContainer'>
                    {docs.map((doc, index) => {
                        if (doc.access.includes(user.email)) {
                            const owner = false;
                            return  docIcon(doc, index, owner);
                        } else {
                            return null;
                        }   
                    })}
                </div>

                <p>_____________</p>

                {user.admin === true ?
                    <>
                    <h2>Alla användare och deras dokument:</h2>
                    <div className='usersContainer'>
                        {usersAndDocs}
                    </div>

                    </>
                :<p></p>}
            </div>
            </>
        }
    </>
  );
}

export default Docs;
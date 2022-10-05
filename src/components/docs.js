import '../css/App.css';

import React, { useState, useEffect } from 'react';
import TextEditor from "./texteditor";
import docsModel from "../models/docs";
import authModel from '../models/auth';
import docLogo from '../img/docLogo.png';
import userLogo from '../img/userLogo.png';

function Docs({testDocs=[], user=[], token}) {
    const [currentUser] = useState(user);
    const [docs, setDocs] = useState(testDocs);
    const [userDocs, setUserDocs] = useState(testDocs);
    const [usersAndDocs, setUsersAndDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [editorMode, setEditorMode] = useState(null);
    const [createAlert, setCreateAlert] = useState("");

    const [owner, setOwner] = useState(true);

    //const [selectedUser, setSelectedUser] = useState(null);
    //const [selectedUserDocsMapped, setSelectedUserDocsMapped] = useState([]);


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



    // Open one of your own documents.
    const openDoc = (doc) => {
        setOwner(true);
        setCurrentDoc(doc);
        setEditorMode(true);
    };



    // SetTitle of new document.
    const handleInputChange = event => {
        setTitle(event.target.value);
    };


    // Delete user and docs.
    //async function deleteUserAndDocs() {
    //    const docsFiltered = docs.filter(doc => {
    //        return doc.user === selectedUser.email;
    //    });
    //    console.log(docsFiltered);

    //    for (const doc of docsFiltered) {
    //        const docId = { id: doc._id };
    //        console.log(docId);
    //        //await docsModel.deleteDoc(docId, token);
    //    };

    //    const id = selectedUser._id ;
    //    //await authModel.deleteUser(id);

    //    setSelectedUser(null);

    //    if (selectedUser === user) {
    //        window.location.reload(false);
    //    }

    //};


    // Create new document in database.
    async function newDoc(title) {
        if (title === "") {
            return;
        }
        setCreateAlert("Skapar...");
        const doc = { user: currentUser.email, name: title, content: "" };
        await docsModel.createDoc(doc, token);
        const allDocuments = await docsModel.getAllDocs(token);
        const userDocuments = allDocuments.filter(doc => {
            return doc.user === currentUser.email;
        });
        setDocs(allDocuments)
        setUserDocs(userDocuments);

        setTitle("");
        setCreateAlert("Nytt dokument skapat!");
        setTimeout(() => {
            setCreateAlert("");
          }, 3000);
    }


    // All users with their docs.
    useEffect(() => {
        const uAD = allUsers.map((specificUser, index) => {

            const allDocs = docs.filter(doc => {
                return doc.user === specificUser.email;
            });
            const allUsersDocs = allDocs.map((doc, index) => <p key={doc._id} style={{fontSize: '11px', margin: '0'}}>{doc.name}.doc</p>);
            
            return  <div key={index} className='userIcon'>
                        <img key={user._id} src={userLogo} alt={"user logo"} />
                        <p  key={user.email}>{specificUser.email}</p>
                        {allUsersDocs}
                    </div>
        })
        setUsersAndDocs(uAD);
        // eslint-disable-next-line
    }, [allUsers]);


    // Render doc icon
    function docIcon(doc, index) {
        return  <div key={index} className='docIcon' onClick={() => openDoc(doc)}>
                    <img src={docLogo}  alt={"document logo"}/>
                    <p>{doc.name}</p>
                </div>
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
                setEditorMode={setEditorMode} 
                setDocs={setDocs}
                setUserDocs={setUserDocs}
            />
        :
            <>
            <div style={{ width: '150px', marginLeft: '20px', textAlign: 'center' }}>
                <button className='logout' onClick={() => window.location.reload(false)}>Logga ut</button>
                <div style={{textAlign: 'center'}} className='logoutIcon'>
                    <img src={userLogo}  alt={"user logo"}/>
                    <p>{currentUser.email}</p>
                </div>
                {user.admin === true ? <p>admin</p>:<p style={{marginLeft: '20px'}}>not admin</p>}
            </div>
            

            <div className='docs'>
                {!createAlert ? 
                    <div style={{height: '16px'}}></div>
                    :
                    <div className='create_alert'>{createAlert}</div>
                }

                <h2>Skapa ett nytt dokument</h2>

                <div className='createDocInput'>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        onChange={handleInputChange}
                        value={title}
                        autoComplete="off"
                        placeholder='Titel'
                    />

                    <button onClick={() => newDoc(title)}>Skapa</button>
                </div>

                <p>_____________</p>

                <h2>Dina dokument</h2>

                <div className='docsContainer'>
                    {userDocs.map((doc, index) => docIcon(doc, index))}
                </div>

                <p>_____________</p>

                <h2>Dokument du givits tillgång till</h2>
                <div className='docsContainer'>
                    {docs.map((doc, index) => {
                        if (doc.access.includes(user.email)) {
                            return  docIcon(doc, index);
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
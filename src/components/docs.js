import '../css/App.css';

import React, { useState, useEffect } from 'react';
import TextEditor from "./texteditor";
import docsModel from "../models/docs";
import authModel from '../models/auth';

function Docs({testDocs=[], user=[], token}) {
    const [currentUser] = useState(user);
    const [docs, setDocs] = useState(testDocs);
    const [userDocs, setUserDocs] = useState(testDocs);
    const [usersAndDocs, setUsersAndDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [currentDocUser, setCurrentDocUser] = useState(null);
    const [currentDocAuth, setCurrentDocAuth] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [editorMode, setEditorMode] = useState(null);
    const [createAlert, setCreateAlert] = useState("");

    const [owner, setOwner] = useState(true);

    //const [selectedUser, setSelectedUser] = useState(null);
    //const [selectedUserDocsMapped, setSelectedUserDocsMapped] = useState([]);


    // If admin get all users and docs, if ordinary user get only your own docs.
    useEffect(() => {
        (async () => {
            if (currentUser.admin === true) {
                const users = await authModel.getUsers();
                const allDocs = await docsModel.getAllDocs(token);
                const userDocuments = allDocs.filter(doc => {
                    return doc.user === currentUser.email;
                });

                setAllUsers(users.data);
                setDocs(allDocs);
                setUserDocs(userDocuments);
            } else {
                const userDocuments = await docsModel.getUserDocs(token, currentUser.email);
                setUserDocs(userDocuments);

                const allDocs = await docsModel.getAllDocs(token);
                setDocs(allDocs);
            }
        })();
        // eslint-disable-next-line
    }, []);


    // Set current user document.
    const handleOptionsChangeUser = event => {
        setCurrentDocUser(userDocs[event.target.value]);
    };

    // Set current authorized document.
    const handleOptionsChangeAuth = event => {
        setCurrentDocAuth(docs[event.target.value]);
    };


    // Open one of your own documents.
    const openDocUser = () => {
        if (currentDocUser) {
            setOwner(true);
            setCurrentDoc(currentDocUser);
            setEditorMode(true);
        }
    };

    // Open a document you have been given access to.
    const openDocAuth = () => {
        if (currentDocAuth) {
            setOwner(false);
            setCurrentDoc(currentDocAuth);
            setEditorMode(true);
        }
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
            
            return  <div key={index}>
                        <h4 style={{marginBottom: '0'}} key={user._id}><u>{specificUser.email}</u></h4>
                        {allUsersDocs}
                    </div>
        })
        setUsersAndDocs(uAD);
        // eslint-disable-next-line
    }, [allUsers]);


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
            <p style={{marginLeft: '20px'}}><u>Inloggad som:</u> {currentUser.email}</p>
            {user.admin === true ? <p style={{marginLeft: '20px'}}>admin</p>:<p style={{marginLeft: '20px'}}>not admin</p>}
            <button style={{marginLeft: '20px'}} onClick={() => window.location.reload(false)}>Logga ut</button>
            <div className='docs'>
                {!createAlert ? 
                <div style={{height: '26px'}}></div>
                :
                <p className='create_alert'>{createAlert}</p>
                }

                <h2>Dina dokument:</h2>

                <select onChange={handleOptionsChangeUser}>
                    <option value="-99" key="0">Välj ett dokument</option>
                    {userDocs.map((doc, index) => <option value={index} key={index}>{doc.name}</option>)}
                </select>

                <button onClick={openDocUser}>Öppna</button><br></br><br></br>

                <h2>Dokument du givits tillgång till:</h2>

                <select onChange={handleOptionsChangeAuth}>
                    <option value="-99" key="0">Välj ett dokument</option>
                    {docs.map((doc, index) => {

                        if (doc.access.includes(user.email)) {
                            return <option value={index} key={index}>{doc.name}</option>
                        }
                        return null;
                    })}
                </select>

                <button onClick={openDocAuth}>Öppna</button><br></br><br></br>
    
                <h2>Skapa ett nytt dokument:</h2>

                <div>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        onChange={handleInputChange}
                        value={title}
                        autoComplete="off"
                        placeholder='Dokumentnamn'
                    />

                    <button onClick={() => newDoc(title)}>Skapa</button><br></br><br></br>
                </div>

                {user.admin === true ?
                    <>
                    <h2>Alla användare och deras dokument:</h2>

                    {usersAndDocs}

                    </>
                :<p></p>}
            </div>
            </>
        }
    </>
  );
}

export default Docs;

//<button onClick={openDocAll}>Öppna</button><br></br><br></br>

//{usersAndDocs}
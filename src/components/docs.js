import '../css/App.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./header";
import docsModel from "../models/docs";

function Docs() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [title, setTitle] = useState("");

    const navigate = useNavigate();

    // Get all documents.
    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, []);

    // Set current document.
    const handleOptionsChange = event => {
        setCurrentDoc(docs[event.target.value]);
    };

    // Open document in editor.
    const openDoc = () => {
        if (currentDoc) {
            navigate('/editor',  {state: currentDoc });
        }
    };

    // SetTitle of new document.
    const handleInputChange = event => {
        setTitle(event.target.value);
    };

    // Create new document in database.
    async function newDoc(title) {
        const doc = { name: title, content: "" };
        await docsModel.createDoc(doc);
        alert('Dokument "' + title + '" skapat!')
        window.location.reload(false);
    }

  return (
    <>
    <div className='docs'>
        <Header />

        <h4>Öppna ett dokument:</h4>

        <select onChange={handleOptionsChange}>
            <option value="-99" key="0">Välj ett dokument</option>
            {docs.map((doc, index) => <option value={index} key={index}>{doc.name}</option>)}
        </select>

        <button onClick={openDoc}>
            Öppna
        </button>

        <h4>Skapa ett nytt dokument:</h4>

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

            <button onClick={() => newDoc(title)}>Skapa</button>
        </div>
    </div>
    </>
  );
}

//{docs.map((doc, index) => <button onClick={() => console.log("hit")}>
//<div style={{width: '150px', height: '150px', display: 'inline-block'}} value={index} key={index}>
//    <div style={{width: '100px', height: '100px', backgroundImage: 'url(/logo192.png)'}}></div>
//    <p>{doc.name}</p>
//</div>
//</button>)}

//{docs.map((doc, index) => {
//    return <button style={{backgroundColor: 'orange', marginInline: '30px', padding: '10px', marginTop: '20px'}}  key={index}
//                    onClick={() => navigate('/editor',  {state: {id: doc._id, name: doc.name, content: doc.content} })}>
//                <h4>{doc.name}</h4>
//            </button>;
//
//})}

// onClick={() => navigate('/editor', {replace: true})}

export default Docs;
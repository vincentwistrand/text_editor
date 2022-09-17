import '../css/App.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./header";
import docsModel from "../models/docs";

function Docs({testDocs=[]}) {
    const [docs, setDocs] = useState(testDocs);
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
            navigate('/texteditor',  {state: currentDoc });
        }
    };

    // SetTitle of new document.
    const handleInputChange = event => {
        setTitle(event.target.value);
    };

    // Create new document in database.
    async function newDoc(title) {
        if (title === "") {
            return;
        }
        const doc = { name: title, content: "" };
        await docsModel.createDoc(doc);
        // alert('Dokument "' + title + '" skapat!')
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

export default Docs;
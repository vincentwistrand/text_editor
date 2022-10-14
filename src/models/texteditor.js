import docsModel from "./docs";
import authModel from './auth';
import inviteModel from '../models/invite';

import userLogo from '../img/userLogo.png';

const editorModel = {
    addUser: async function addUser(
            inputAccess,
            token,
            currentDocument,
            setCurrentDocument,
            setAuthUsers,
            setInputAccess,
            setAccessMessage,
            setAccessStatus
        ) {

        setAccessStatus("success");
        setAccessMessage("Arbetar...");

        const user = await authModel.getUserByEmail(inputAccess);
    
        if (user) {
          if (!currentDocument.access.includes(inputAccess)) {
            const doc = currentDocument;
            doc.access.push(inputAccess);
            await docsModel.saveDoc(doc, token);
    
            setCurrentDocument(doc);
    
            const users = doc.access.map((user, index) => {
              return  <div key={index} className='userIcon'>
                        <img src={userLogo}  alt={"user logo"}/>
                        <p>{user}</p>
                      </div>
            })
            setAuthUsers(users);
    
            setAccessStatus("success");
            setAccessMessage("Användaren har fått behörighet.");
            setInputAccess("");
            setTimeout(() => {
                setAccessStatus(null);
                setAccessMessage("");
            }, 3000);
    
          } else {
            setAccessStatus("fail");
            setAccessMessage("Användaren har redan behörighet.");
          }
        } else {
            setAccessStatus("fail");
            setAccessMessage("Användaren finns inte.");
        }
    },

    removeUser: async function removeUser(
            inputAccess,
            token,
            currentDocument,
            setCurrentDocument,
            setAuthUsers,
            setInputAccess,
            setAccessMessage,
            setAccessStatus
        ) {

        setAccessStatus("success");
        setAccessMessage("Arbetar...");

        if (currentDocument.access.includes(inputAccess)) {
            const doc = currentDocument;
    
            var filtered = doc.access.filter(function(value, index, arr){ 
              if (value !== inputAccess) {
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
    
            
            setInputAccess("");
    
            setAccessStatus("success");
            setAccessMessage("Användaren har inte behörighet längre.");
            setInputAccess("");
            setTimeout(() => {
                setAccessStatus(null);
                setAccessMessage("");
            }, 3000);
          } else {
            setAccessStatus("fail");
            setAccessMessage("Användaren har inte behörighet.");
          }
    },

    sendInvite: async function sendInvite(  
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
        ) {

        setInvitationStatus("success");
        setInvitationMessage("Arbetar...");
    
        if (inputInvite === currentUser.email) {
          setInvitationStatus("error");
          setInvitationMessage("Du kan inte bjuda in dig själv.");
          return;
        }
    
        if (currentDocument.access.includes(inputInvite)) {
          setInvitationStatus("error");
          setInvitationMessage("Du har redan bjudit in personen med den här epostadressen.");
          return;
        }
    
        const userEmail = currentUser.email;
        const result = await inviteModel.sendInvite(inputInvite, userEmail, title, token)
        
        if (!result.errors) {
          setInvitationMessage("Mailet är skickat!");
          setTimeout(() => {
              setInvitationStatus(null);
          }, 3000);
    
          const doc = currentDocument;
    
          if (!currentDocument.access.includes(inputInvite)) {
            doc.access.push(inputInvite);
            await docsModel.saveDoc(doc, token);
    
            setCurrentDocument(doc);
        
            const users = doc.access.map((user, index) => {
              return  <div key={index} className='userIcon'>
                        <img src={userLogo}  alt={"user logo"}/>
                        <p>{user}</p>
                      </div>
            })
    
            setAuthUsers(users);
          }
    
          setInputInvite("");
        } else {
          setInvitationStatus("error");
          setInvitationMessage(result.errors.message);
        }
    }
}

export default editorModel;
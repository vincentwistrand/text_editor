import { render, screen } from '@testing-library/react';
import Docs from '../components/docs';
import {HashRouter as Router} from 'react-router-dom';

const docs = [
  {
    _id: "6320a5a7129ba599acb3e8f2",
    user: "test@test.se",
    name: "My_doc_1",
    type: "text",
    content: "<h1>Halloj</h1>",
    access: []
  },
  {
    _id: "6320a5a7129ba599acb3e8f2",
    user: "test@test.se",
    name: "My_doc_2",
    type: "code",
    content: "<h1>Hallojsen</h1>",
    access: []
  },
  {
    _id: "6320a5a7129ba654acb3e8f2",
    user: "test2@test.se",
    name: "Doc_2",
    type: "text",
    content: "<h1>Hallojsan</h1>",
    access: []
  },
  {
    _id: "6320a5a7129ba599acb3e8f2",
    user: "test3@test.se",
    name: "Doc_3",
    type: "text",
    content: "<h1>Halloj</h1>",
    access: ["test@test.se"]
  },
  {
    _id: "6320a5a7129ba654acb3e8f2",
    user: "test4@test.se",
    name: "Doc_4",
    type: "text",
    content: "<h1>Hallojsan</h1>",
    access: ["test1@test.se"]
  }
];

const userDocs = [
  {
    _id: "6320a5a7129ba599acb3e8f2",
    user: "test@test.se",
    name: "My_doc_1",
    type: "text",
    content: "<h1>Halloj</h1>",
    access: []
  },
  {
    _id: "6320a5a7129ba599acb3e8f2",
    user: "test@test.se",
    name: "My_doc_2",
    type: "code",
    content: "<h1>Hallojsen</h1>",
    access: []
  }
];

const user = {
  _id: "5435",
  email: "test@test.se",
  password: "jrj",
  admin: false
}


test('renders two create buttons', () => {

  jest.mock("../components/header", () => "header");
  jest.mock("../models/docs", () => "docsModel");
  jest.mock("../models/auth", () => "authModel");

  render(<Router>
            <Docs token="" />
          </Router>);

  const createButton = screen.getAllByRole("button", { name: /Skapa/i })

  expect(createButton[0]).toBeInTheDocument();
  expect(createButton[1]).toBeInTheDocument();
});


test('should display email of current user.', () => {


  jest.mock("../components/header", () => "header");
  jest.mock("../models/docs", () => "docsModel");
  jest.mock("../models/auth", () => "authModel");

  render(<Router>
            <Docs user={user} token="" />
          </Router>);

  const userEmail = screen.getByText(user.email);
  expect(userEmail).toBeInTheDocument();
});


test('should display name of all text and code documents belonging to the current user', () => {


  jest.mock("../components/header", () => "header");
  jest.mock("../models/docs", () => "docsModel");
  jest.mock("../models/auth", () => "authModel");

  render(<Router>
            <Docs testDocs={docs} testUserDocs={userDocs} user={user} token="" />
          </Router>);

  const userDoc1 = screen.getByText("My_doc_1.doc");
  expect(userDoc1).toBeInTheDocument();

  const userDoc2 = screen.getByText("My_doc_2.js");
  expect(userDoc2).toBeInTheDocument();
});


test('should display name of all text and code documents current user has been given access to.', () => {


  jest.mock("../components/header", () => "header");
  jest.mock("../models/docs", () => "docsModel");
  jest.mock("../models/auth", () => "authModel");

  render(<Router>
            <Docs testDocs={docs} testUserDocs={userDocs} user={user} token="" />
          </Router>);

  const otherUser = screen.queryByText("Doc_2.doc");
  expect(otherUser).toBeNull();

  const otherUser2 = screen.getByText("Doc_3.doc");
  expect(otherUser2).toBeInTheDocument();

  const otherUser3 = screen.queryByText("Doc_4.doc");
  expect(otherUser3).toBeNull();
});

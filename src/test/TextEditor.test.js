import { render, screen } from '@testing-library/react';
import TextEditor from '../components/texteditor';
import {HashRouter as Router} from 'react-router-dom';

jest.mock("../components/header", () => "header");
jest.mock("../models/docs", () => "docs");



const textDoc = {
  _id: "6320a5a7129ba599acb3e8f2",
  user: "test@test.se",
  name: "my_doc",
  type: "text",
  content: "<h1>Halloj</h1>",
  access: ["test1@test.se", "test2@test.se"]
};

const codeDoc = {
  _id: "6320a5a7129ba599acb3e8f2",
  user: "test@test.se",
  name: "my_code",
  type: "code",
  content: "console.log('Hello World!')",
  access: []
};

const user = {
  _id: "5435",
  email: "test@test.se",
  password: "jrj",
  admin: false
};




test('should contain document name', () => {

  render(<Router>
            <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} />
          </Router>);
  
  const option1 = screen.getByText("my_doc");
  expect(option1).toBeInTheDocument();
});


test('should contain document content', () => {

    render(<Router>
              <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} />
            </Router>);
  
    const option2 = screen.getByText("Halloj");
    expect(option2).toBeInTheDocument();
});


test('should contain code document content in code editor', () => {

  render(<Router>
            <TextEditor testDoc={{test: "test"}} currentDoc={codeDoc} user={user} editorType="code" />
          </Router>);

  const option2 = screen.getByText("console.log('Hello World!')");
  expect(option2).toBeInTheDocument();
});


test('renders save button', () => {

    render(<Router>
              <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} />
            </Router>);
  
    const createButton = screen.getByRole("button", { name: /Spara/i });
    expect(createButton).toBeInTheDocument();
});


test('renders PDF button', () => {

  render(<Router>
            <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} editorType="text" />
          </Router>);

  const createButton = screen.getByRole("button", { name: /PDF/i });
  expect(createButton).toBeInTheDocument();
});


test('renders email input field', () => {

  render(<Router>
            <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} editorType="text" owner={true} />
          </Router>);

  const emailInput = screen.getByTestId("invite");
  expect(emailInput).toBeInTheDocument();
  expect(emailInput).toHaveAttribute("type", "email");
});


test('renders give access input field', () => {

  render(<Router>
            <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} editorType="text" owner={true} />
          </Router>);

  const emailInput = screen.getByTestId("access");
  expect(emailInput).toBeInTheDocument();
});


test('renders all users emails that have access to document', () => {

  render(<Router>
            <TextEditor testDoc={{test: "test"}} currentDoc={textDoc} user={user} editorType="text" owner={true} />
          </Router>);

  const option2 = screen.getByText("test2@test.se");
  expect(option2).toBeInTheDocument();
});
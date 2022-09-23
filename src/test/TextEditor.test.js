import { render, screen } from '@testing-library/react';
import TextEditor from '../components/texteditor';
import {HashRouter as Router} from 'react-router-dom';

jest.mock("../components/header", () => "header");
jest.mock("../models/docs", () => "docs");

const document = 
    {
      _id: "6320a5a7129ba599acb3e8f2",
      name: "Doc 1",
      content: "<h1>Halloj</h1>"
    };

test('should contain document name', () => {

  render(<Router>
            <TextEditor testDoc={document} />
          </Router>);
  
  const option1 = screen.getByText("Doc 1");
  expect(option1).toBeInTheDocument();
});

test('should contain document content', () => {

    render(<Router>
              <TextEditor testDoc={document} />
            </Router>);
  
    const option2 = screen.getByText("Halloj");
    expect(option2).toBeInTheDocument();
});

test('renders save button', () => {

    render(<Router>
              <TextEditor testDoc={document} />
            </Router>);
  
    const createButton = screen.getByRole("button", { name: /Spara/i });
    expect(createButton).toBeInTheDocument();
});
import { render, screen } from '@testing-library/react';
import Docs from '../components/docs';
import {HashRouter as Router} from 'react-router-dom';

const documents = [
  {
    _id: "6320a5a7129ba599acb3e8f2",
    name: "Doc 1",
    content: "<h1>Halloj</h1>"
  },
  {
    _id: "6320a5a7129ba654acb3e8f2",
    name: "Doc 2",
    content: "<h1>Hallojsan</h1>"
  }
];

test('renders create button', () => {

  const docsModel = {
    getAllDocs: async function getAllDocs() {
        return {};
    }
  }

  jest.mock("../components/header", () => "header");
  jest.mock("../models/docs", () => docsModel);

  render(<Router>
            <Docs testDocs={documents} />
          </Router>);

  const createButton = screen.getByRole("button", { name: /Skapa/i })

  expect(createButton).toBeInTheDocument();
});

test('should display all document names', () => {

  const docsModel = {
    getAllDocs: async function getAllDocs() {
        return {};
    }
  }

  jest.mock("../components/header", () => "header");
  jest.mock("../models/docs", () => docsModel);

  render(<Router>
            <Docs testDocs={documents} />
          </Router>);

  const option1 = screen.getByRole('option', { name: "Doc 1" });
  expect(option1).toBeInTheDocument();

  const option2 = screen.getByRole('option', { name: "Doc 2" });
  expect(option2).toBeInTheDocument();

  const options = screen.getAllByRole('option');
  expect(options.length).toBe(3);
});

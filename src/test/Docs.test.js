import { render, screen } from '@testing-library/react';
import Docs from '../components/docs';
import {HashRouter as Router} from 'react-router-dom';



jest.mock("../components/texteditor", () => "texteditor");

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
  render(<Router>
            <Docs testDocs={documents} />
          </Router>);

  const createButton = screen.getByRole("button", { name: /Skapa/i })

  expect(createButton).toBeInTheDocument();
});

test('should display all document names', () => {
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

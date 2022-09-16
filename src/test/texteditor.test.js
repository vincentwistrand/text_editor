import { render, screen } from '@testing-library/react';
import TextEditor from '../components/texteditor';
import {HashRouter as Router} from 'react-router-dom';

test('renders save button', () => {
  render(<Router>
            <TextEditor />
          </Router>);
  const createButton = screen.getByRole("button", { name: /Spara/i });
  expect(createButton).toBeInTheDocument();
});

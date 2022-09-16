import { render, screen } from '@testing-library/react';
import Docs from '../components/docs';
import {HashRouter as Router} from 'react-router-dom';

test('renders create button', () => {
  render(<Router>
            <Docs />
          </Router>);
  const createButton = screen.getByRole("button", { name: /Skapa/i });
  expect(createButton).toBeInTheDocument();
});

test('renders open button', () => {
  render(<Router><Docs /></Router>);
  const openButton = screen.getByRole("button", { name: /Öppna/i });
  expect(openButton).toBeInTheDocument();
});

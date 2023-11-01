import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login element', () => {
  render(<App />);
  const loginElement = screen.getByText(/Sign In/);
  expect(loginElement).toBeInTheDocument();
});

test('renders sign-up element', () => {
  render(<App />);
  const signUpElement = screen.getByText(/Sign Up/);
  expect(signUpElement).toBeInTheDocument();
});

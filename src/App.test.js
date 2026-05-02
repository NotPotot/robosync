import { render, screen } from '@testing-library/react';
import App from './App';

test('renders RoboSync', () => {
  render(<App />);
  expect(screen.getAllByText('RoboSync').length).toBeGreaterThan(0);
});

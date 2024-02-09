import { render, screen } from '@testing-library/react';
import ProjectTile from './ProjectTile';

test('renders ProjectTile', () => {
  const project = { name: 'Project 1', shortDescription: { en: 'Short description' } };

  render(<ProjectTile project={project} />);

  const titleElement = screen.getByText(/Project 1/i);
  expect(titleElement).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import LinkTile from "./LinkTile";

test("renders LinkTile", () => {
  render(<LinkTile href="https://my-link.de">My awesome link</LinkTile>);

  const titleElement = screen.getByText(/My awesome link/i);
  expect(titleElement).toBeInTheDocument();
});

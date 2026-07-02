import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

test("renders dashboard title", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headings = screen.getAllByText(/dashboard/i);
  expect(headings.length).toBeGreaterThan(0);
});

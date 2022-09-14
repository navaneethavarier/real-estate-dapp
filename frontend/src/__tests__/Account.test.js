import { render, screen, cleanup } from "@testing-library/react";
import "../components/Account";
import Account from "../components/Account";
import { BrowserRouter as Router } from "react-router-dom";

test("should render Account component", () => {
  render(
    <Router>
      <Account />
    </Router>
  );

  const accountElement = screen.getByTestId("account-1");
  expect(accountElement).toBeInTheDocument();
});

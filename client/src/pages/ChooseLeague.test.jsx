import { render, screen, waitFor } from "@testing-library/react";
import ChooseLeague from "./ChooseLeague";

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders loading state initially", () => {
  render(<ChooseLeague userId="123" />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("renders error state when fetch fails", async () => {
  global.fetch.mockRejectedValue(new Error("Failed to fetch"));

  render(<ChooseLeague userId="123" />);

  const errorMsg = await screen.findByText(/error/i);
  expect(errorMsg).toBeInTheDocument();
  expect(errorMsg).toHaveTextContent("Error: Failed to fetch");
});

test("renders message if no userId provided", () => {
  render(<ChooseLeague userId="" />);
  expect(screen.getByText(/please enter your fpl id/i)).toBeInTheDocument();
});

test("renders leagues when fetch succeeds", async () => {
  const mockData = {
    leagues: {
      classic: [
        { id: 1, name: "Test League 1" },
        { id: 2, name: "Test League 2" },
      ],
    },
  };

  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockData,
  });

  render(<ChooseLeague userId="123" />);

  // Wait for league buttons to appear
  const league1 = await screen.findByText("Test League 1");
  const league2 = await screen.findByText("Test League 2");

  expect(league1).toBeInTheDocument();
  expect(league2).toBeInTheDocument();
});

test("shows JSON preview correctly", async () => {
  const mockData = {
    leagues: { classic: [] },
    id: 123,
    player_first_name: "Jon",
    player_last_name: "Lloyd",
  };

  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockData,
  });

  render(<ChooseLeague userId="123" />);

  const jsonPreview = await screen.findByText(/Jon/);
  expect(jsonPreview).toBeInTheDocument();
  expect(jsonPreview).toHaveTextContent("Jon");
  expect(jsonPreview).toHaveTextContent("Lloyd");
});

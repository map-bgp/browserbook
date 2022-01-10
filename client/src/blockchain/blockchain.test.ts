import { fetchABI } from "./abiFetcher"

test("abi should be fetched", () => {
  expect(fetchABI("BBookToken")).toBe(3)
})

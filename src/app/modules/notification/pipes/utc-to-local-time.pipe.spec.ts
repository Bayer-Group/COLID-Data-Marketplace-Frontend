import { UTCToLocalTimePipe } from "./utc-to-local-time";

describe("UTCToLocalTimePipe", () => {
  it("create an instance", () => {
    const pipe = new UTCToLocalTimePipe();
    expect(pipe).toBeTruthy();
  });
});

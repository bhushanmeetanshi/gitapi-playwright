import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";
import { request } from "http";
import { describe } from "node:test";

test.describe("req/response API Testing", () => {
  let apiContext: any;

  test.beforeEach(async ({ request }) => {
    apiContext = await request.get("https://reqres.in/api/users");
  });
  test("Verify User API status", async () => {
    expect(apiContext.status()).toBe(200);
  });
  test("Verify User API statusText", async () => {
    expect(apiContext.statusText()).toBe("OK");
  });
  test("Verify Number of page not null", async () => {
    const response = await apiContext.json();
    expect(await response.total_pages).not.toBeNull();
  });
  test("Verify response data of page not null", async () => {
    const response = await apiContext.json();
    expect(await response.data).not.toBeNull();
  });
  test("Verify response data of includes firstname includes George", async () => {
    const response = await apiContext.json();
    const hasValue = response.data.some(
      (user: { first_name: string }) => user.first_name === "George"
    );
    expect(hasValue).toBeTruthy();
  });
  test("Count number of data items", async () => {
    const response = await apiContext.json();
    console.log(response.data.length);
    const dataLength = response.data.length;
    expect(dataLength).toEqual(6);
  });
  test("Check Support data items", async () => {
    const response = await apiContext.json();
    expect(response.support.url).not.toBeNull();
  });
  test("Check Text data character length", async () => {
    const response = await apiContext.json();
    expect(response.support.url).toHaveLength(79);
  });
  test("Check id isNumeric", async () => {
    const response = await apiContext.json();
    expect(response.data.id).toBe("Number");
  });
  test("Test: Register with password containing line breaks and control characters", async ({
    request,
  }) => {
    // Define the request payload
    const requestPayload = {
      email: "officia incididunt enim",
      password: "pass\nword", // Contains line break
      username: "tempor dolor nisi",
    };

    // Make the API request
    const response = await request.post("https://reqres.in/api/register", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: requestPayload,
    });

    // Parse the response body
    const responseBody = await response.json();

    // Assertions
    expect(responseBody, "response should exist").toBeDefined();
    expect(responseBody.error, "error should exist").toBeDefined();
    expect(typeof responseBody.error, "error should be a string").toBe(
      "string"
    );
    expect(response.status(), "statusCode should exist").toBeDefined();
    expect(typeof response.status(), "statusCode should be a number").toBe(
      "number"
    );
    expect(response.status(), "statusCode should be equal to 400").toBe(400);

    // Optional: Log the response for debugging purposes
    console.log("Response body:", responseBody);
  });
  test("Test with password containing characters that might need escaping in different contexts", async ({
    request,
  }) => {
    // Define the request payload
    const requestPayload = {
      email: "officia incididunt enim",
      password: 'p\\"assword',
      username: "tempor dolor nisi",
    };

    // Make the API request
    const response = await request.post("https://reqres.in/api/register", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: requestPayload,
    });

    // Parse the response body
    const responseBody = await response.json();

    // Assertions
    expect(responseBody, "response should exist").toBeDefined(); // Check response exists
    expect(responseBody.error, "error should exist").toBeDefined(); // Check error exists
    expect(typeof responseBody.error, "error should be a string").toBe(
      "string"
    ); // Check error is a string
    expect(response.status(), "statusCode should exist").toBeDefined(); // Check statusCode exists
    expect(typeof response.status(), "statusCode should be a number").toBe(
      "number"
    ); // Check statusCode is a number
    expect(response.status(), "statusCode should be equal to 400").toBe(400); // Check statusCode equals 400

    // Optional: Log the response for debugging purposes
    console.log("Response body:", responseBody);
  });
  test("Test with password containing non-ASCII characters", async ({
    request,
  }) => {
    // Define the request payload
    const requestPayload = {
      email: "officia incididunt enim",
      password: "pässwörd",
      username: "tempor dolor nisi",
    };

    // Make the API request
    const response = await request.post("https://reqres.in/api/register", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: requestPayload,
    });

    // Parse the response body
    const responseBody = await response.json();
    // Assertions
    expect(responseBody, "response should exist").toBeDefined(); // Check response exists
    expect(responseBody.error, "error should exist").toBeDefined(); // Check error exists
    expect(typeof responseBody.error, "error should be a string").toBe(
      "string"
    ); // Check error is a string
    expect(response.status(), "statusCode should exist").toBeDefined(); // Check statusCode exists
    expect(typeof response.status(), "statusCode should be a number").toBe(
      "number"
    ); // Check statusCode is a number
    expect(response.status(), "statusCode should be equal to 400").toBe(400); // Check statusCode equals 400

    // Optional: Log the response for debugging purposes
    console.log("Response body:", responseBody);
  });
  test("Test with a strong password which has mixed case, alphanumeric, and special characters", async ({
    request,
  }) => {
    // Define the request payload
    const requestPayload = {
      email: "officia incididunt enim",
      password: "P@ssw0rd!",
      username: "tempor dolor nisi",
    };

    // Make the API request
    const response = await request.post("https://reqres.in/api/register", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: requestPayload,
    });

    // Parse the response body
    const responseBody = await response.json();
    // Assertions
    expect(responseBody, "response should exist").toBeDefined(); // Check response exists
    expect(responseBody.error, "error should exist").toBeDefined(); // Check error exists
    expect(typeof responseBody.error, "error should be a string").toBe(
      "string"
    ); // Check error is a string
    expect(response.status(), "statusCode should exist").toBeDefined(); // Check statusCode exists
    expect(typeof response.status(), "statusCode should be a number").toBe(
      "number"
    ); // Check statusCode is a number
    expect(response.status(), "statusCode should be equal to 400").toBe(400); // Check statusCode equals 400

    // Optional: Log the response for debugging purposes
    console.log("Response body:", responseBody);
  });
});

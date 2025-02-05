import { test, expect } from "@playwright/test";
import * as pw from "playwright";

const url = process.env.URL;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const token = process.env.TOKEN;

test.describe("GIT API Testing", () => {
  test("Create Issue", async () => {
    const requestContext = await pw.request.newContext();
    const response = await requestContext.post(
      `${url}/repos/${owner}/${repo}/issues`,
      {
        data: {
          title: "Found a bug12",
          body: "I'm having a problem with this.",
          labels: ["bug"],
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status()).toBe(201);
  });

  test("Create repository", async () => {
    const requestContext = await pw.request.newContext();
    const response = await requestContext.post(`${url}/user/repos`, {
      data: {
        name: "private_repo___6",
        description: "This is your first repository",
        homepage: "https://github.com",
        private: true,
        has_issues: true,
        has_projects: true,
        has_wiki: true,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status() !== 201) {
      console.error(`Request failed with status ${response.status()}`);
      const errorBody = await response.text();
      console.error(`Error response body: ${errorBody}`);
    }

    expect(response.status()).toBe(201);
  });

  test.skip("Delete repository", async () => {
    const requestContext = await pw.request.newContext();
    const response = await requestContext.delete(
      `${url}/repos/${owner}/${repo}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status() !== 204) {
      console.error(`Request failed with status ${response.status()}`);
      const errorBody = await response.text();
      console.error(`Error response body: ${errorBody}`);
    }

    expect(response.status()).toBe(204);
  });
  test("List User repository", async () => {
    const requestContext = await pw.request.newContext();
    const response = await requestContext.get(`${url}/users/${owner}/repos`);
    expect(response.status()).toBe(200);
    const repos = await response.json();
    for (const repo of repos) {
      console.log(`Repository Name: ${repo.name}`);
    }
  });

  test("List All repositories", async () => {
    const requestContext = await pw.request.newContext();
    const response = await requestContext.get(`${url}/users/${owner}/repos`);
    expect(response.status()).toBe(200);
    const repos = await response.json();
    for (const repo of repos) {
      console.log(`Repository Name: ${repo.name}`);
    }
  });
});

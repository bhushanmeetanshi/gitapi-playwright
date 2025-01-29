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
    const response = await requestContext.post(
      `${url}/user/repos`,
      {
        data: {
          name: "private_repo___2",
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
      }
    );
    expect(response.status()).toBe(201);
  });
});

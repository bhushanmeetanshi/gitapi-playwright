import { test, expect } from "@playwright/test";
import { GitHubAPI } from "../POM/GitHubAPI";
import * as pw from "playwright";

const url = process.env.URL as string;
const owner = process.env.OWNER as string;
const repo = process.env.REPO as string;
const token = process.env.TOKEN as string;

test.describe("GIT API Testing", () => {
  let requestContext: pw.APIRequestContext;
  let gitHubAPI: GitHubAPI;

  test.beforeAll(async () => {
    requestContext = await pw.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    gitHubAPI = new GitHubAPI(requestContext, url, owner, repo);
  });

  test.afterAll(async () => {
    await requestContext.dispose();
  });

  test("Create Issue", async () => {
    const response = await gitHubAPI.createIssue(
      "Found a bug12",
      "I'm having a problem with this.",
      ["bug"]
    );
    expect(response.status()).toBe(201);
  });

  test.skip("Create repository", async () => {
    const response = await gitHubAPI.createRepository({
      name: "private_repo___6",
      description: "This is your first repository",
      homepage: "https://github.com",
      private: true,
      has_issues: true,
      has_projects: true,
      has_wiki: true,
    });

    if (response.status() !== 201) {
      console.error(`Request failed with status ${response.status()}`);
      const errorBody = await response.text();
      console.error(`Error response body: ${errorBody}`);
    }

    expect(response.status()).toBe(201);
  });

  test.skip("Delete repository", async () => {
    const response = await gitHubAPI.deleteRepository();
    if (response.status() !== 204) {
      console.error(`Request failed with status ${response.status()}`);
      const errorBody = await response.text();
      console.error(`Error response body: ${errorBody}`);
    }
    expect(response.status()).toBe(204);
  });

  test("List User repository", async () => {
    const response = await gitHubAPI.listUserRepositories();
    expect(response.status()).toBe(200);
    const repos = await response.json();
    for (const repo of repos) {
      console.log(`Repository Name: ${repo.name}`);
    }
    expect(repos.length).toBe(17);
    console.log(repos.length);
    expect(repos.length).toBeGreaterThan(16);
  });

  test("update repository", async () => {
    const response = await gitHubAPI.updateRepository({
      name: "private_repo___8",
      description: "This private_repo___8 repository",
      homepage: "https://github.com",
      private: true,
      has_issues: true,
      has_projects: true,
      has_wiki: true,
    });
    const res = await response.json();
    console.log(res.description);
    console.log(res.name);

    expect(response.status()).toBe(200);
  });
  test("Create Tag", async () => {
    const tagName = "v2.0.0";
    const commitSHA = "your-commit-sha"; // Replace with actual commit SHA
    const tagResponse = await gitHubAPI.createTag(tagName, {
      data: {
        tag: tagName,
        message: "This is version 1.0.0",
        object: commitSHA, // Must be the commit SHA
        type: "commit",
        tagger: {
          name: "bhushanmeetanshi",
          email: "your-email@example.com",
          date: new Date().toISOString(),
        },
      },
    });

    expect(tagResponse.status()).toBe(201);
  });
  test("List repository Tags", async () => {
    const response = await gitHubAPI.listRepositoryTags();
    expect(response.status()).toBe(200);
    const repos = await response.json();
    for (const repo of repos) {
      console.log(`Repository Tag: ${repo.name}`);
    }
  });
});

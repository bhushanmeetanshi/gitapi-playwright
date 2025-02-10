import * as pw from "playwright";

export class GitHubAPI {
  static listRepositoryTags() {
    throw new Error("Method not implemented.");
  }
  private requestContext: pw.APIRequestContext;
  private url: string;
  private owner: string;
  private repo: string;

  constructor(
    requestContext: pw.APIRequestContext,
    url: string,
    owner: string,
    repo: string
  ) {
    this.requestContext = requestContext;
    this.url = url;
    this.owner = owner;
    this.repo = repo;
  }

  async createIssue(title: string, body: string, labels: string[]) {
    const response = await this.requestContext.post(
      `${this.url}/repos/${this.owner}/${this.repo}/issues`,
      {
        data: {
          title,
          body,
          labels,
        },
      }
    );
    return response;
  }

  async createRepository(data: object) {
    const response = await this.requestContext.post(`${this.url}/user/repos`, {
      data,
    });
    return response;
  }

  async deleteRepository() {
    const response = await this.requestContext.delete(
      `${this.url}/repos/${this.owner}/${this.repo}`
    );
    return response;
  }

  async listUserRepositories() {
    const response = await this.requestContext.get(`${this.url}/user/repos`);
    return response;
  }

  async updateRepository(data: object) {
    const response = await this.requestContext.patch(
      `${this.url}/repos/${this.owner}/${this.repo}`,
      {
        data,
      }
    );
    return response;
  }
  async createTag(tagName: string, data: object) {
    const response = await this.requestContext.post(
      `${this.url}/repos/${this.owner}/${this.repo}/tags`,
      {
        data,
      }
    );
    return response;
  }
  async listRepositoryTags() {
    const response = await this.requestContext.get(
      `${this.url}/repos/${this.owner}/${this.repo}/tags`
    );
    return response;
  }
}

import { $ } from "bun";

type Repo = {
  isArchived: boolean;
  name: string;
  pushedAt: string;
}

const lastYear = new Date();
lastYear.setFullYear(lastYear.getFullYear() - 1);
const repos: Repo[] = (await $`gh repo list -L 200 --json name,isArchived,pushedAt`.json())
  .filter((repo: Repo) => !repo.isArchived)
  .filter((repo: Repo) => new Date(repo.pushedAt) < lastYear);

for (const repo of repos) {
  console.write(`Archive ${repo.name}? [y/N]: `);
  for await(const line of console) {
    if (line === 'y') {
      await $`gh repo archive ${repo.name} -y`;
    }
    break;
  }
}

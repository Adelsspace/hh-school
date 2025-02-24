interface Contributor {
  login: string;
  avatar_url: string;
}

interface User {
  login: string;
  avatar_url: string;
}

export const fetchUser = async (
  username: string,
  signal?: AbortSignal
): Promise<User> => {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(
      "Пользователь не найден, проверьте имя пользователя и сохраните настройки"
    );
  }
  return response.json();
};

export const fetchRepoContributors = async (
  repo: string,
  signal?: AbortSignal
): Promise<Contributor[]> => {
  const contributors: Contributor[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=100&page=${page}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error(
        "Репозиторий не найден, проверьте название репозитория и сохраните настройки"
      );
    }

    const data = await response.json();
    contributors.push(...data);

    hasMore = data.length === 100;
    page++;
  }
  return contributors;
};

import { fetchUser, fetchRepoContributors } from "./api";
interface Contributor {
  login: string;
  avatar_url: string;
}

interface FetchResult {
  userData: { login: string; avatar_url: string } | null;
  contributors: Contributor[];
  isValid: boolean;
}

export const fetchUserWithContributors = async (
  userLogin: string,
  repo: string,
  blacklist: string[],
  handleError: (error: unknown) => void,
  signal: AbortSignal
): Promise<FetchResult> => {
  try {
    const user = await fetchUser(userLogin, signal);
    const userData = { login: user.login, avatar_url: user.avatar_url };

    const contributors = await fetchRepoContributors(repo, signal);
    const filteredContributors = contributors.filter(
      (contributor) => !blacklist.includes(contributor.login)
    );
    return {
      userData,
      contributors: filteredContributors,
      isValid: true,
    };
  } catch (error) {
    handleError(error);
    return { userData: null, contributors: [], isValid: false };
  }
};

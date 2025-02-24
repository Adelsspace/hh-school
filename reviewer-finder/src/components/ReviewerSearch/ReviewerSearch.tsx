import React, { useState, useEffect, useRef } from "react";
import "./ReviewerSearch.scss";
import { UserInfo } from "../index";
import { fetchUserWithContributors } from "../../utils/fetchUserWithContributors";

interface Contributor {
  login: string;
  avatar_url: string;
}

interface ReviewerSearchProps {
  settingsChanged: boolean;
}

const ERROR_TIMEOUT = 2000;
const SEARCH_INTERVAL = 200;
const FINAL_REVIEWER_TIMEOUT = 3000;

export const ReviewerSearch: React.FC<ReviewerSearchProps> = ({
  settingsChanged,
}) => {
  const [userLogin, setUserLogin] = useState("");
  const [repo, setRepo] = useState("");
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [currentReviewer, setCurrentReviewer] = useState<Contributor | null>(
    null
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    login: string;
    avatar_url: string;
  } | null>(null);
  const [isValid, setIsValid] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const { userLogin, repo, blacklist } = JSON.parse(savedSettings);
      setUserLogin(userLogin);
      setRepo(repo);
      setBlacklist(blacklist);
    }
  }, [settingsChanged]);

  const handleError = (error: unknown) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setErrorMessage(`Ошибка ${error}`);
    timeoutRef.current = setTimeout(() => setErrorMessage(null), ERROR_TIMEOUT);
    setIsSearching(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (isSearching) {
      fetchUserWithContributors(
        userLogin,
        repo,
        blacklist,
        handleError,
        abortController.signal
      )
        .then(({ userData, contributors, isValid }) => {
          setUserData(userData);
          setContributors(contributors);
          setIsValid(isValid);
        })
        .catch(handleError);

      return () => {
        abortController.abort();
      };
    }
  }, [isSearching, repo, blacklist, userLogin]);

  useEffect(() => {
    if (isSearching && contributors.length > 0 && isValid) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * contributors.length);
        setCurrentReviewer(contributors[randomIndex]);
      }, SEARCH_INTERVAL);

      const finalReviewerTimeout = setTimeout(() => {
        clearInterval(interval);
        const finalReviewer =
          contributors[Math.floor(Math.random() * contributors.length)];
        setCurrentReviewer(finalReviewer);
        setHasSearched(true);
        setIsSearching(false);
      }, FINAL_REVIEWER_TIMEOUT);

      return () => {
        clearInterval(interval);
        clearTimeout(finalReviewerTimeout);
      };
    }
  }, [isSearching, contributors, isValid]);

  const findReviewer = () => {
    setIsSearching(true);
    setIsValid(false);
  };

  return (
    <>
      <button onClick={findReviewer} disabled={isSearching}>
        Начать поиск
      </button>
      <div className="reviewer-search">
        {(hasSearched || isSearching) && userData && currentReviewer && (
          <UserInfo userData={userData} currentReviewer={currentReviewer} />
        )}
      </div>
      {errorMessage && <div className="error-popup">{errorMessage}</div>}
    </>
  );
};

export default ReviewerSearch;

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Settings.scss";

interface SettingsProps {
  setSettingsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const SAVED_POPUP_TIMEOUT = 2000;

export const Settings: React.FC<SettingsProps> = ({ setSettingsChanged }) => {
  const [userLogin, setUserLogin] = useState("");
  const [repo, setRepo] = useState("");
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    setUserLogin(savedSettings.userLogin || "");
    setRepo(savedSettings.repo || "");
    setBlacklist(savedSettings.blacklist || []);
  }, []);

  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  const saveSettings = () => {
    const settings = { userLogin, repo, blacklist };
    localStorage.setItem("settings", JSON.stringify(settings));
  };

  const handleSave = () => {
    saveSettings();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowSavedPopup(true);
    setSettingsChanged((prev) => !prev);
    timeoutRef.current = setTimeout(() => {
      setShowSavedPopup(false);
    }, SAVED_POPUP_TIMEOUT);
  };

  const handleBlacklistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmedBlacklist = value.split(",").map((item) => item.trim());

    setBlacklist(trimmedBlacklist);
  };

  return (
    <div className="settings">
      <input
        type="text"
        placeholder="Логин"
        value={userLogin}
        onChange={(e) => setUserLogin(e.target.value)}
      />

      <input
        type="text"
        placeholder="Репозиторий"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <span>Для тестирования:</span>
      <span>AndreyGladkov</span>
      <span>hhru/react-d3-chart-graphs</span>

      <div className="blacklist-title">Черный список</div>
      <span>Укажите список логинов через запятую</span>
      <input
        type="text"
        value={blacklist.join(",")}
        onChange={handleBlacklistChange}
      />
      <span className="hint">Не забудьте сохранить настройки </span>
      <button onClick={handleSave}>Сохранить настройки в localStorage</button>
      {showSavedPopup && <div className="saved-popup">Сохранено</div>}
    </div>
  );
};

export default Settings;

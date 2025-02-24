import { useState } from "react";
import "./Home.scss";
import { Settings, ReviewerSearch } from "../../components/index";

const Home = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  const toggleSettingsVisibility = () => {
    setSettingsVisible((prev) => !prev);
  };

  return (
    <div className="wrapper">
      <button onClick={toggleSettingsVisibility}>
        {settingsVisible ? "Скрыть настройки" : "Настройки"}
      </button>
      {settingsVisible && <Settings setSettingsChanged={setSettingsChanged} />}
      <ReviewerSearch settingsChanged={settingsChanged} />
    </div>
  );
};

export default Home;

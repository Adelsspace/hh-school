import React from "react";
import { UserDisplay } from "../index";

interface UserInfoProps {
  userData: { login: string; avatar_url: string } | null;
  currentReviewer: { login: string; avatar_url: string } | null;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userData,
  currentReviewer,
}) => {
  return (
    <div className="searching">
      {userData && (
        <div className="user-display">
          <UserDisplay
            userLogin={userData.login}
            title={"Пользователь"}
            avatar={userData.avatar_url}
          />
        </div>
      )}
      {currentReviewer && (
        <div className="reviewer-display">
          <UserDisplay
            userLogin={currentReviewer.login}
            title={"Ревьюер"}
            avatar={currentReviewer.avatar_url}
          />
        </div>
      )}
    </div>
  );
};

export default UserInfo;

import React from "react";
import "./UserDisplay.scss";

interface UserDisplayProps {
  title: string;
  userLogin: string;
  avatar: string;
}

export const UserDisplay: React.FC<UserDisplayProps> = ({
  userLogin,
  title,
  avatar,
}) => {
  return (
    <div className="user-display">
      <img
        src={avatar}
        alt={`аватар пользовователя ${userLogin}}`}
        className="avatar"
      />
      <div>{userLogin}</div>
      <div>{title}</div>
    </div>
  );
};

export default UserDisplay;

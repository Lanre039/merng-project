import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const logOutUser = () => {
    logout();
    setActiveItem("home");
  };

  const handleItemClick = (e, { name }) => setActiveItem(name);
  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user ? user.username : "home"}
        active={user ? true : activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      {user ? (
        <Menu.Menu position="right">
          <Menu.Item
            name="logout"
            active={activeItem === "logout"}
            onClick={logOutUser}
          />
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="register"
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      )}
    </Menu>
  );
}

export default MenuBar;

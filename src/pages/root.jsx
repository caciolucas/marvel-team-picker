import { Heading, Image } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import "../styles.css";
import shieldLogo from "../assets/shieldlogo.png";

import { useNavigate } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();
  return (
    <>
      <div id="navbar">
        <div id="navbar-inner">
          <Heading
            as="h3"
            size="lg"
            id="characters-link"
            className="nav-link"
            onClick={() => navigate("/characters")}
          >
            Personagens
          </Heading>
          <Image
            objectFit="cover"
            src={shieldLogo}
            alt="Marvel Logo"
            width={"100%"}
          />
          <Heading
            as="h3"
            size="lg"
            id="teams-link"
            className="nav-link"
            onClick={() => navigate("/teams")}
          >
            Times
          </Heading>
        </div>
      </div>
      <div id="content">
        <Outlet />
      </div>
    </>
  );
}

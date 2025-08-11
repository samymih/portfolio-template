import LeftBar from "./_components/leftbar";
import {
  RiTerminalBoxFill,
  RiUser4Fill,
  RiGamepadFill,
  RiFolder3Fill,
  RiMarkdownFill,
  RiArrowDropDownFill,
  RiMailFill,
} from "react-icons/ri";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import React, { useState, useEffect } from "react";
import SwitchComponent from "./_switch-component-about";
import { SiDiscord } from "react-icons/si";
import createWindowandRedirect from "./_func/redirect";
import axios from "axios";

export default function About() {
  const [info, setInfo] = useState({
    title: "",
    category: "",
  });
  
  const [aboutData, setAboutData] = useState({
    aboutContent: [],
    aboutItems: { about: [] },
    contacts: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const response = await axios.get('/api/about');
        setAboutData(response.data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des données about:', error);
        setError('Erreur de chargement des données');
        setAboutData({
          aboutContent: [],
          aboutItems: { about: [] },
          contacts: {}
        });
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ justifyContent: "center", alignItems: "center" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    console.warn('Données non disponibles, utilisation des valeurs par défaut');
  }

  const contactList = [
    {
      title: aboutData.contacts?.email || "contact@example.com",
      link: `mailto:${aboutData.contacts?.email || "contact@example.com"}`,
      icon: <RiMailFill />,
    },
    {
      title: aboutData.contacts?.discord.name || "username",
      link: `https://discord.com/users/${aboutData.contacts?.discord || "123456789"}`,
      icon: <SiDiscord />,
    },
  ];

  return (
    <>
      <div className="container" style={{ justifyContent: "start" }}>
        <LeftBar width={"7vw"} className={"first-navbar-about"}>
          <div className="leftbar-about-content flex">
            <ul>
              <li>
                <RiTerminalBoxFill />
              </li>
              <li>
                <RiUser4Fill />
              </li>
              <li>
                <RiGamepadFill />
              </li>
            </ul>
          </div>
        </LeftBar>
        <LeftBar width={"15vw"}>
          <Menu className="flex leftbar-text">
            <SubMenu
              title="personal-info"
              icon={<RiArrowDropDownFill />}
              id="border-bottom"
            >
              {aboutData.aboutItems?.about?.map((v, i) => {
                return (
                  <SubMenu
                    title={v.title}
                    key={i}
                    icon={<RiFolder3Fill color={v.color} />}
                    id="margin-left-section"
                  >
                    {v.items?.map((ve, i) => {
                      return (
                        <MenuItem
                          key={i}
                          onClick={() =>
                            setInfo({
                              title: ve.title,
                              category: v.title,
                            })
                          }
                          icon={<RiMarkdownFill />}
                        >
                          {ve.title}
                        </MenuItem>
                      );
                    })}
                  </SubMenu>
                );
              })}
            </SubMenu>
          </Menu>
          <Menu className="flex leftbar-text">
            <SubMenu
              title="contacts"
              icon={<RiArrowDropDownFill />}
              id="border-bottom"
              className="border-top"
            >
              {contactList.map((v, i) => {
                return (
                  <MenuItem
                    key={i}
                    icon={v.icon}
                    className="no-margin-left"
                    onClick={() => {
                      createWindowandRedirect(v.link);
                    }}
                  >
                    {v.title}
                  </MenuItem>
                );
              })}
            </SubMenu>
          </Menu>
        </LeftBar>
        <SwitchComponent 
          info={info} 
          aboutContent={aboutData.aboutContent} 
        />
      </div>
    </>
  );
}
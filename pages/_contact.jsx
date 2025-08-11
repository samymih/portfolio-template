import React, { useRef, useState, useEffect } from "react";
import LeftBar from "./_components/leftbar";
import { RiArrowDropDownFill, RiMailFill } from "react-icons/ri";
import { SiDiscord } from "react-icons/si";
import { BiLinkExternal } from "react-icons/bi";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import axios from "axios";
import ReactDOM from "react-dom/client";
import createWindowandRedirect from "./_func/redirect";
import { Textbox, Textarea } from "react-inputs-validation";
import list from "badwords-list";

export default function Contact() {
  const form = useRef();
  const [contacts, setContacts] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isAllValid, setIsAllValid] = useState({
    name: false,
    email: false,
    message: false,
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await axios.get('/api/contact');
        setContacts(response.data.contacts);
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        setContacts({});
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const code = `const button = document.querySelector('#sendBtn');

const message = {
	name: "${message.name}",
	email: "${message.email}",
	message: "${message.message}",
	date: "${new Date().toLocaleDateString("fr-FR")}"
}

button.onclick = () => {
  form.send(message);
}`;

  const sendEmail = async (e) => {
    if (isAllValid.name && isAllValid.email && isAllValid.message) {
      e.preventDefault();
      setSending(true);
      
      const data = {
        name: message.name,
        email: message.email,
        message: message.message,
        date: new Date().toLocaleDateString("fr-FR"),
      };

      try {
        const response = await axios.post("/api/contact", data);
        
        const messageSent = (
          <div className="message-sent">
            <span>Thank you! 🤘</span>
            <p>
              Your message has been sent successfully. You will receive an answer really soon!
            </p>
            <button id="sendBtn" onClick={() => window.location.reload()}>
              send-new-message
            </button>
          </div>
        );

        const root = ReactDOM.createRoot(
          document.querySelector(".contact-form")
        );
        root.render(messageSent);

      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        
        // Afficher le message d'erreur
        const errorMessage = (
          <div className="message-error">
            <span>Oops! 😞</span>
            <p>
              {error.response?.data?.message || 'An error occurred while sending your message. Please try again.'}
            </p>
            <button id="retryBtn" onClick={() => window.location.reload()}>
              try-again
            </button>
          </div>
        );

        const root = ReactDOM.createRoot(
          document.querySelector(".contact-form")
        );
        root.render(errorMessage);
      } finally {
        setSending(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ width: "100%" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  const data = contacts?.find_me?.links || [];
  const contactData = [
    {
      title: contacts?.contacts?.email || "contact@sopow.fr",
      link: `mailto:${contacts?.contacts?.email || "contact@sopow.fr"}`,
      icon: <RiMailFill />,
    },
    {
      title: contacts?.contacts?.discord?.name || "username",
      link: `https://discord.com/users/${
        contacts?.contacts?.discord?.id || "123456789"
      }`,
      icon: <SiDiscord />,
    },
  ];

  return (
    <>
      <div className="container" style={{ width: "100%" }}>
        <LeftBar width={"22vw"}>
          <Menu className="flex leftbar-text">
            <SubMenu
              title="contacts"
              icon={<RiArrowDropDownFill />}
              id="border-bottom"
              className="border-top"
              style={{ width: "22vw" }}
            >
              {contactData.map((v, i) => {
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
            <SubMenu
              title="find-me-also-in"
              icon={<RiArrowDropDownFill />}
              id="border-bottom"
              className="border-top"
              style={{ width: "22vw" }}
            >
              {data.map((v, i) => {
                return (
                  <MenuItem
                    key={i}
                    icon={<BiLinkExternal />}
                    className="no-margin-left"
                    onClick={() => {
                      createWindowandRedirect(v.url);
                    }}
                  >
                    {v.name}
                  </MenuItem>
                );
              })}
            </SubMenu>
          </Menu>
        </LeftBar>
        <div className="container" style={{ borderLeft: "none" }}>
          <section className="contact-container">
            <div className="contact-form">
              <form ref={form} onSubmit={sendEmail}>
                <div className="form-group">
                  <label htmlFor="name">_name:</label>
                  <Textbox
                    attributesInput={{
                      type: "text",
                      name: "name",
                      disabled: sending
                    }}
                    classNameInput="form-control"
                    value={message.name}
                    onBlur={(e) =>
                      setMessage({ ...message, name: e.target.value })
                    }
                    validationOption={{
                      name: "name",
                      check: true,
                      required: true,
                      customFunc: (value) => {
                        if (value.length < 3) {
                          return "Your name is too short";
                        } else {
                          setIsAllValid({ ...isAllValid, name: true });
                          return true;
                        }
                      },
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">_email:</label>
                  <Textbox
                    attributesInput={{ 
                      type: "email", 
                      id: "email",
                      disabled: sending
                    }}
                    classNameInput="form-control"
                    value={message.email}
                    onBlur={(e) =>
                      setMessage({ ...message, email: e.target.value })
                    }
                    validationOption={{
                      name: "email",
                      check: true,
                      required: true,
                      customFunc: (email) => {
                        const reg =
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (reg.test(String(email).toLowerCase())) {
                          setIsAllValid({ ...isAllValid, email: true });
                          return true;
                        } else {
                          return "Please enter a valid email address";
                        }
                      },
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">_message:</label>
                  <Textarea
                    attributesInput={{
                      type: "text",
                      id: "message",
                      disabled: sending
                    }}
                    classNameInput="form-control"
                    id="message"
                    value={message.message}
                    onBlur={(e) =>
                      setMessage({ ...message, message: e.target.value })
                    }
                    validationOption={{
                      name: "message",
                      check: true,
                      required: true,
                      customFunc: (value) => {
                        if (value.length < 10) {
                          return "Your message is too short";
                        } else if (value.match(list.regex)) {
                          return "Your message contains bad words";
                        } else {
                          setIsAllValid({ ...isAllValid, message: true });
                          return true;
                        }
                      },
                    }}
                  />
                </div>
              </form>
              <button 
                id="sendBtn" 
                onClick={(e) => sendEmail(e)}
                disabled={sending}
                style={{ opacity: sending ? 0.6 : 1 }}
              >
                {sending ? 'sending...' : 'submit-message'}
              </button>
            </div>
          </section>
          <section className="contact-preview">
            <SyntaxHighlighter
              language="javascript"
              style={atomOneDark}
              showLineNumbers={true}
            >
              {code}
            </SyntaxHighlighter>
          </section>
        </div>
      </div>
    </>
  );
}
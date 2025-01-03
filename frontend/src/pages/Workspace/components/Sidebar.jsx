import styles from "./Sidebar.module.css";
import { MdOutlineTextsms } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { LuCalendar } from "react-icons/lu";
import { LuStar } from "react-icons/lu";
import { LuSquareCheckBig } from "react-icons/lu";

import { MdAlternateEmail } from "react-icons/md";

function Sidebar({ onAddField: addField }) {
  const bubbleOptions = [
    {
      label: "Text",
      icon: <MdOutlineTextsms size="2rem" color="#4B83FF" />,
      type: "text-display",
    },
    {
      label: "Image",
      icon: <LuImage size="2rem" color="#4B83FF" />,
      type: "image-display",
    },
  ];

  const inputOptions = [
    {
      label: "Text",
      icon: "T",
      type: "text",
    },
    {
      label: "Number",
      icon: "#",
      type: "number",
    },
    {
      label: "Email",
      icon: <MdAlternateEmail size="2rem" color="#ffa54c" />,
      type: "email",
    },
    {
      label: "Phone",
      icon: <LuPhone size="2rem" color="#ffa54c" />,
      type: "phone",
    },
    {
      label: "Date",
      icon: <LuCalendar size="2rem" color="#ffa54c" />,
      type: "date",
    },
    {
      label: "Rating",
      icon: <LuStar size="2rem" color="#ffa54c" />,
      type: "rating",
    },
    {
      label: "Buttons",
      icon: <LuSquareCheckBig size="2rem" color="#ffa54c" />,
      type: "buttons",
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <p className={styles.title}>Bubbles</p>
      <div className={styles.grid2Col}>
        {bubbleOptions.map((option) => (
          <button
            key={option.type}
            className={styles.btn}
            onClick={() => addField(option.type)}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles.title}>Inputs</p>
      <div className={styles.grid2Col}>
        {inputOptions.map((option) => (
          <button
            key={option.type}
            className={styles.btn}
            onClick={() => addField(option.type)}
          >
            <span className={styles.icon}>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

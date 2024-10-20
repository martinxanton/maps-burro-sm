import "material-symbols";
import { useState } from "react";
import PropTypes from "prop-types";

const Toast = ({ text, icon, className }) => {
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    const element = document.querySelector(".alert");
    element.classList.add("translate-x-96");
    setTimeout(() => {
      return null;
    }, 1000);
  }

  return (
    <div
      role="alert"
      className={`alert alert-success w-56 md:w-80 flex text-white  duration-100  ${className}`}
      onClick={() => {
        setIsHidden(true);
        console.log("Toast clicked");
        console.log(isHidden);
      }}
    >
      <span className="material-symbols-outlined m-0 p-0">{icon}</span>
      <label>{text}</label>
    </div>
  );
};

Toast.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  isHidden: PropTypes.bool,
};

export default Toast;

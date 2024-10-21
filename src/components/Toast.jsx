import "material-symbols";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Toast = ({ text, icon, className, onDelete, color }) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (isHidden) {
      onDelete();
    }
  }, [isHidden, onDelete]); // Se ejecuta cuando isHidden cambia

  setTimeout(() => {
    setIsHidden(true); // Oculta el toast después de 5 segundos
  }, 5000);

  return (
    <div className={`${className} z-20 absolute flex w-full justify-center`}>
      <div
        role="alert"
        className={`alert alert-success ${color} w-56 md:w-80 flex text-white  duration-100`}
        onClick={() => {
          setIsHidden(true);
          console.log("Toast clicked");
          console.log(isHidden);
        }}
      >
        <span className="material-symbols-outlined m-0 p-0">{icon}</span>
        <label>{text}</label>
      </div>
    </div>
  );
};

Toast.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
  isHidden: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default Toast;

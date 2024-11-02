import "material-symbols";
import PropTypes from 'prop-types';

const Fab = ({ onClick, className, icon, isActive }) =>  {


  return (
    <>
      {/*<!-- Component: Large primary button with icon  --> */}
      <button
        className={`btn btn-circle  ${ isActive ? 'bg-blue-900 text-white' : 'bg-neutral-100 text-black' }   shadow-sm border-2 hover:bg-neutral-200 hover:border-neutral-400 border-neutral-400  ${className}`}
        onClick={onClick}
      >
        <span className="material-symbols-outlined m-0 p-0">{icon}</span>
      </button>
    </>
  );
};
  

Fab.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};


export default Fab;
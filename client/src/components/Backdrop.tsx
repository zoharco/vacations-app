import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = (props: any) => {
  const portalDiv = document.getElementById('backdrop-hook');
  return portalDiv ? ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>, portalDiv
  ) : null;
};
 
export default Backdrop;

import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = (props: any) => {
      if (props.to) {
        return (
          <Link
            to={props.to}
            
            className={`button button--${props.size || 'default'} ${props.inverse &&
              'button--inverse'} ${props.danger && 'button--danger'} ${props.className}`}
          >
            {props.children}
          </Link>
        );
      }
      return (
        <button
          className={`button button--${props.size || 'default'} ${props.inverse &&
            'button--inverse'} ${props.danger && 'button--danger'}`}
          type={props.type}
          onClick={props.onClick}
          disabled={props.disabled}
        >
          {props.children}
        </button>
      );
};

export default Button;
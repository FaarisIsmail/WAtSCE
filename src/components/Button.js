import React from 'react';
import './Button.css';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';



const STYLES = [
  'btn--primary',
  'btn--outline',
]

const SIZES = [
  'btn--medium',
  'btn--large',
]

export const Button = ({ children, type, onClick, buttonStyle, buttonSize }) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

  return (
    <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={() => firebase.auth().signOut()} type={type}>
      {children}
    </button>
  )
}
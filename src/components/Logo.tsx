import React from 'react';
import logo from '../img/logo.svg';

export enum LogoSize {
  SMALL = 6,
  MEDIUM = 10,
  LARGE = 16
}

function LogoImage(props: {size?: LogoSize}) {
  let size = props.size || LogoSize.MEDIUM;
  return (
    <div className={`inline-block rounded-full bg-white p-0 m-0 w-${size} h-${size}`}>
      <img style={{"filter": "invert(1)"}} src={logo} className="ml-auto mr-auto mt-0 mb-0 h-full"/>
    </div>
  )
}

type LogoProps = {
    size?: LogoSize,
    onClick?: () => void
}

export function Logo(props: LogoProps) {
  let size = props.size || LogoSize.MEDIUM;
  
  let textSize: string;
  switch (size) {
    case LogoSize.LARGE:
      textSize = "text-5xl";
      break;
    default:
      textSize = "text-3xl";
  }

  let hasOnClick = !!props.onClick;
  let onClick = hasOnClick ? props.onClick : () => null;

  return (
    <div className={`m-4 flex ${hasOnClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <div className="self-center h-full"><LogoImage size={size}/></div>
      {size > LogoSize.SMALL && <h1 className={`inline-block self-center ${textSize} pl-2 pb-2`}>Auxify</h1>}
    </div>
  )
}

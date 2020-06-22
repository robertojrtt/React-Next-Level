import React from "react";
// JS
// function Header(pros) {
//   return (
//  <div>{pros.title}</div>
// );
// }

// Typescrtip
interface HeaderProps{
  title:string;
  email?:string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div>
      {props.title}
    </div>
  );
};

export default Header;

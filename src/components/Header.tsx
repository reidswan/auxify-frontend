import React from 'react';
import { FiUser, FiLogOut, FiMenu } from 'react-icons/fi'
import { Logo } from './Logo';
import { Link } from 'react-router-dom';


class Menu extends React.Component<{}, { menuDropDownVisible: boolean, menuDropDownHover: boolean }> {

  constructor(props: {}) {
    super(props);
    this.state = {
      menuDropDownVisible: false,
      menuDropDownHover: false
    }
  }

  showDropDown = () => {
    this.setState({ menuDropDownHover: true })
  }

  hideDropDown = () => {
    this.setState({ menuDropDownHover: false })
  }

  toggleDropDown = () => {
    let menuDropDownVisible = !this.state.menuDropDownVisible;
    let newState: any = {menuDropDownVisible};
    if (!menuDropDownVisible) {
      newState.menuDropDownHover = false;
    }
    this.setState(newState)
  }

  render() {
    return (
      <div onMouseEnter={this.showDropDown} onMouseLeave={this.hideDropDown} className="order-last justify-end inline-block py-4 h-full mb-auto mt-auto">
        <FiMenu size={30} onClick={this.toggleDropDown} />
        { (this.state.menuDropDownVisible || this.state.menuDropDownHover) &&
          <div className="bg-gray-900 right-0 my-2 mx-4 absolute z-20 rounded-md">
            <button className="menu-entry"><FiUser className="inline-block float-right"/> Preferences</button>
            <button className="menu-entry"><FiLogOut className="inline-block float-right"/> Logout</button>
          </div>
        }
      </div>
    )
  }
}

export function Header() {
  return (
    <div className="flex flex-row justify-between mt-2">
      <Link className="justify-start flex-grow-0" to="/"><Logo /></Link>
      <Menu />
    </div>
  )
}
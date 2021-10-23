import React from 'react';
import { MenuItems } from './MenuItems';
import { Button } from '../Button'
import './Navbar.css';
import {auth} from '../../firebase.js'

class Navbar extends React.Component {

  state = { clicked: false }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked })
  }

  render() {

    return (
      <nav className="NavbarItems">
        <h1 className="navbar-logo">Hello {auth.currentUser.displayName || auth.currentUser.phoneNumber.substring(2,12) || "Anonymous"}!</h1>
        {/* <h1 className="navbar-logo">React<i className="fab fa-react"></i></h1> */}
        <div className="menu-icon" onClick={this.handleClick}>
          <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName} href={item.url}>
                {item.title}
                </a>
              </li>
            )
          })}
        </ul>
          <Button onClick={() => auth.signOut()}>Sign Out </Button>
      </nav>
    )
  }
}

export default Navbar;
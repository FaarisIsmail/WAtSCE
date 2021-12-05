import React from 'react';
import { MenuItems } from './MenuItems';
import { MenuItemsHost } from './MenuItemsHost';
import { Button } from '../Button'
import './Navbar.css';
import {auth} from '../../firebase.js'
import logo from './logo7.png';

let navbarItems = [];

class Navbar extends React.Component {

  state = { clicked: false }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked })
  }

  render() {

    {
      if (this.props.role == 'host' || this.props.role == 'admin') {
        navbarItems = MenuItemsHost
      } else {
        navbarItems = MenuItems
      }
    }

    return (
      <nav className="NavbarItems">

        <hr /><hr /><hr /><hr /><hr /><hr /><hr /><hr />

        <a href="/">
          <img className="nav-icon" src={logo} alt="logo_main" width="150"/>
        </a>

        <hr /><hr /><hr /><hr /><hr /><hr />

        <h1 className="navbar-logo">Hello {auth.currentUser.displayName}!</h1>
        {/* <h1 className="navbar-logo">React<i className="fab fa-react"></i></h1> */}
        <div className="menu-icon" onClick={this.handleClick}>
          <p>≡</p>
          {/* <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i> */}
        </div>

        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
          {navbarItems.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName} href={item.url}>
                {item.title}
                </a>
              </li>
            )
          })}
            <Button onClick={() => auth.signOut()}>Sign Out </Button> <br/>
        </ul>
        {/* <div class="signout-button">
          <Button onClick={() => auth.signOut()}>Sign Out </Button>
        </div> */}
      </nav>
    )
  }
}

export default Navbar;
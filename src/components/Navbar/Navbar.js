import React from 'react';
import { MenuItems } from './MenuItems';
import { Button } from '../Button'
import './Navbar.css';
import {auth} from '../../firebase.js'
import logo from './logo7.png';

class Navbar extends React.Component {

  state = { clicked: false }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked })
  }

  render() {

    return (
      <nav className="NavbarItems">

        <hr /><hr /><hr /><hr /><hr /><hr /><hr /><hr />

        <a href="/">
          <img src={logo} alt="logo_main" width="150"/>
        </a>

        <hr /><hr /><hr /><hr /><hr /><hr />

        <h1 className="navbar-logo">Hello {auth.currentUser.displayName}!</h1>
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
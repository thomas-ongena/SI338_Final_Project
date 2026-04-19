import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
// import { fetchUser } from '../store/userSlice';
// import { Roles } from '../types/user';
import './styles/header.scss';
import { ABOUT_ID, CONTACT_ID, HOME_ID, SERVICES_ID, VALUE_ID } from '../pages/home';

const Header: React.FC = () => {
  // const handleLoginRedirect = () => {
  //   window.location.href = '/login';
  // };

  // const handleLogoutRedirect = () => {
  //   window.location.href = '/logout';
  // };

  const dispatch = useDispatch<AppDispatch>();
  // const user = useSelector((state: RootState) => state.user);
  const [shrink, setShrink] = useState(false);

  const handleScroll = useCallback(() => {
    setShrink(window.scrollY > 50); // Shrink header when scrolling down
  }, []);

  useEffect(() => {
    // dispatch(fetchUser());

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, handleScroll]);

  // const isAdmin = user.roles.includes(Roles.admin);

  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  // const siteLogin = () => (
  //   <div className="login-logout">
  //     {isAdmin && (
  //       <Link className="admin-page-btn" to="/admin">
  //         Admin
  //       </Link>
  //     )}
  //     {user.loggedIn && (
  //       <Link className="view-tools-btn" to="/viewTools">
  //         View Tools
  //       </Link>
  //     )}
  //     {user.loggedIn ? <button onClick={handleLogoutRedirect}>Logout</button> : <button onClick={handleLoginRedirect}>Login</button>}
  //   </div>
  // );

  return (
    <div className={`header ${shrink ? 'shrink' : ''}`}>
      <div className="header-content">
        <img className="logo" src={require('../assets/TMGLogo.png')} alt="TMG Logo" />
        <nav className="nav-links">
          <button onClick={() => handleNavClick(HOME_ID)}>Home</button>
          <button onClick={() => handleNavClick(SERVICES_ID)}>Services</button>
          <button onClick={() => handleNavClick(VALUE_ID)}>Value Delivered</button>
          <button onClick={() => handleNavClick(ABOUT_ID)}>About</button>
          <button onClick={() => handleNavClick(CONTACT_ID)}>Contact</button>
         <button
          className="login-btn"
          onClick={() => (window.location.href = 'https://portal.toolingmanagementgroup.com')}
        >
          Login
        </button>
          {/* {siteLogin()} */}
        </nav>
      </div>
    </div>
  );
};

export default Header;

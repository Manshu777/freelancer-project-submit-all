import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import Navigation from './Navigation';  // Assuming your Navigation component is in this location

const NavbarWrapper = () => {
  const currentRoute = useNavigationState(state => {
    // Safeguard to ensure 'state' and 'state.routes' are defined
    if (state && state.routes && state.routes[state.index]) {
      const routeName = state.routes[state.index].name;
      console.log(routeName);
      const matchedRoutes = ['Home', 'OurCoaches', 'Chat'];
      return matchedRoutes.includes(routeName) ? routeName : null;
    }
    return null;
  });

  // Render Navbar only if currentRoute matches one of the specified routes
  return currentRoute ? <Navigation currentRoute={currentRoute} /> : null;
};

export default NavbarWrapper;

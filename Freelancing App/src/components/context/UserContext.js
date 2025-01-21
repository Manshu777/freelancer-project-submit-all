import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const loadLoginUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loginUser');
        if (storedUser) {
          setLoginUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load login user:', error);
      }
    };

    loadLoginUser();
  }, []);

  return (
    <UserContext.Provider value={{loginUser, setLoginUser}}>
      {children}
    </UserContext.Provider>
  );
};

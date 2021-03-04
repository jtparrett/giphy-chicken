import { createContext, ReactNode, useContext, useState } from 'react';

const Context = createContext(null);

interface Props {
  children?: ReactNode;
}

export const UserProvider = ({ children }: Props): JSX.Element => {
  const [user, setUser] = useState(null);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};

export const useUser = () => useContext(Context);

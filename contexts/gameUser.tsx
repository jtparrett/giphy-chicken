import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const Context = createContext(null);

interface Props {
  children?: ReactNode;
  gameId: string;
}

export const GameUserProvider = ({ children, gameId }: Props): JSX.Element => {
  const storageId = `user_${gameId}`;
  const [userId, updateUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(storageId);
    if (token) updateUserId(token);
  }, [gameId]);

  const setUserId = (id: string) => {
    localStorage.setItem(storageId, id);
    updateUserId(id);
  };

  return (
    <Context.Provider value={{ userId, setUserId }}>
      {children}
    </Context.Provider>
  );
};

export const useGameUser = () => useContext(Context);

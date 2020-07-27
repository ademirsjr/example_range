import { createContext, useContext } from 'react';

const ContextFilter = createContext({
  isModalOpen: false,
  setIsModalOpen: () => {},
});

export default ContextFilter;

export const useContextFilter = () => useContext(ContextFilter);

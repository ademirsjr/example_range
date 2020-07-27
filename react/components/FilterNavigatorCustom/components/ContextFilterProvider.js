import React, { useState, useMemo } from 'react';
import ContextFilter from './ContextFilter';

const ContextFilterProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const provideModal = useMemo(() => ({ isModalOpen, setIsModalOpen }), [
    isModalOpen,
    setIsModalOpen,
  ]);
  return (
    <ContextFilter.Provider value={provideModal}>
      {children}
    </ContextFilter.Provider>
  );
};

export default ContextFilterProvider;

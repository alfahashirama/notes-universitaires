import { useState } from 'react';

/**
 * Hook pour gérer l'état d'un modal
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = (data = null) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Attendre la fin de l'animation avant de réinitialiser les données
    setTimeout(() => {
      setModalData(null);
    }, 300);
  };

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal,
    setModalData,
  };
};
// useModalOutsideClick.ts
import React from 'react';

const useModalOutsideClick = <T extends HTMLElement>(): [
  boolean,
  React.MutableRefObject<T | null>,
  (isOpen: boolean) => void
] => {
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const modalRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, isModalOpen]);

  return [isModalOpen, modalRef, setModalOpen];
};

export default useModalOutsideClick;

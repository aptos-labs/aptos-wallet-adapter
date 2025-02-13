import { type MouseEvent, useState } from 'react';

export function useDisclosure() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement>()
  const onOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const isOpen = anchorElement !== undefined;
  return { anchorElement, onOpen, onClose, isOpen };
}

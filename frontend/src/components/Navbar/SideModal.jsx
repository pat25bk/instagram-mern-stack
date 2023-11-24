import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import React from 'react'

function SideModal({ open, onClose, children }) {
    const modalClasses = `fixed h-full w-[400px] rounded-r-xl bg-white transition-transform ${
      open ? 'translate-x-0' : '-translate-x-[450px]'
    }`;
    
    return (
    <ClickAwayListener onClickAway={onClose}>
      <div style={{boxShadow:"0 0 10px 0 rgba(0,0,0,0.5)"}} className={modalClasses}>
      {children}
      </div>
    </ClickAwayListener>
    );
  }

export default SideModal
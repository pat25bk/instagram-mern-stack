import { Modal } from '@mui/material'
import React from 'react'

function UserListModal({open,onClose,modalTitle}) {
  return (
    <Modal>
        <div>{modalTitle}</div>
        <div>

        </div>
    </Modal>
  )
}

export default UserListModal
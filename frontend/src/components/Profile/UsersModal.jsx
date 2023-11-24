import { Dialog, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { searchIcon } from '../Navbar/SvgIcons'
import { Link } from 'react-router-dom'
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants'
import CloseIcon from '@mui/icons-material/Close';
import UserListItem from '../Layouts/UserListItem'
import { useSelector } from 'react-redux'

function UsersModal({ open, onClose, modalTitle, userList, username }) {
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const logginUser = useSelector((state) => state.user.user);
  const isPageOfLogginUser = logginUser.username === username;
  return (
    <Modal open={open} onClose={onClose} className="flex justify-center items-center" maxWidth="xl">
      {/* <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth={true}> */}
      <div className="w-1/3 h-2/3 bg-white flex flex-col rounded-xl overflow-y-hidden">
      
        <div className="flex justify-between font-semibold px-3 py-2 border-b border-gray-200">
          <p className="flex-1 text-center">{modalTitle}</p>
          <CloseIcon className="cursor-pointer" onClick={onClose} />
        </div>

        {isPageOfLogginUser &&
          <div className="p-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-2 text-xs">
              {!searching && searchIcon}
              <input className="pl-1 flex-1 outline-none bg-transparent"
                type="text"
                value={searchTerm}
                onFocus={() => setSearching(true)}
                onChange={(e) => setSearchTerm(e.value)}
                placeholder='Search' />
            </div>
          </div>
        }
        <div className="overflow-y-scroll h-full">
          {userList.map((u, i) => <UserListItem {...u} id={u._id} isPageOfLogginUser onClose={onClose} />)}
        </div>
      </div>
    </Modal>
  )
}

export default UsersModal
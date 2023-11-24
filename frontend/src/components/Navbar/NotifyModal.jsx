import React from 'react'
import SideModal from './SideModal'
import { Skeleton } from '@mui/material'

function NotifyModal({ open, onClose }) {
    const modalClasses = `fixed h-full w-[400px] rounded-r-xl bg-white transition-transform duration-500 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-[450px]'
      }`;
    return (
        <div style={{boxShadow:"0 0 10px 0 rgba(0,0,0,0.5)"}} className={modalClasses}>
            <h1 className="text-2xl font-bold py-4 pl-5">Notifications</h1>
            <div className="px-4">
                <div className="flex items-center mb-3">
                    <Skeleton variant="circular" width="44px" height="44px" animation="wave" />
                    <div className="flex-1 text-left pl-4">
                        <Skeleton width="50%" />
                        <Skeleton width="30%" />
                    </div>
                    {/* <div className="text-xs text-primary-blue font-semibold cursor-pointer">Follow</div> */}
                </div>
            </div>
            <div className="px-4">
                <div className="flex items-center mb-3">
                    <Skeleton variant="circular" width="44px" height="44px" animation="wave" />
                    <div className="flex-1 text-left pl-4">
                        <Skeleton width="50%" />
                        <Skeleton width="30%" />
                    </div>
                    {/* <div className="text-xs text-primary-blue font-semibold cursor-pointer">Follow</div> */}
                </div>
            </div>
        </div>
    )
}

export default NotifyModal
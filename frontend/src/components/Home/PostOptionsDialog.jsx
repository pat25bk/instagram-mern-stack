import { Dialog, Modal } from '@mui/material'
import React from 'react'

function PostOptionsDialog({open,onClose}) {
    const options = ["Report","Unfollow","Add to favourite","Go to post","Share to...","Copy link","Embed","About this account","Cancel"];
    const handleOptionClick=(i)=>{
        switch(i){
            case "Cancel":
                onClose();
                break;
            default:
                onClose();
        }
        
    }
  return (
    <Modal open={open} onClose={onClose} className="flex items-center justify-center">
        <div className="w-[400px] rounded-xl bg-white text-center text-sm">
        <ul className="">
            {options.map((e,i)=><li onClick={()=>handleOptionClick(e)} className={`py-3 border-b border-gray-300 cursor-pointer"+${(i<2)?" text-red-500 font-bold":""}`} id={i}>{e}</li>)}
        </ul>
        </div>
    </Modal>
  )
}

export default PostOptionsDialog
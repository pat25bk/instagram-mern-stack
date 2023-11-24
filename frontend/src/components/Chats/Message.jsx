import React from 'react'
import { BASE_PROFILE_IMAGE_URL } from '../../utils/constants'

function Message({ isOwnMsg, friendAvatar, content }) {
    return (
        isOwnMsg ?
            <div className="flex justify-end items-center m-3">
                {content==='❤️'?
                <div className="text-4xl">{content}</div>
                :
                <div className="rounded-full bg-sky-500 px-3 py-1.5 text-white">{content}</div>
                }
            </div>
            :
            <div className="flex flex-row items-center m-3">
                {content==='❤️'?
                <div className="text-4xl">{content}</div>
                :
                <>
                <div className="w-8 h-8 mr-3"><img className="w-full h-full rounded-full object-cover" src={BASE_PROFILE_IMAGE_URL+ friendAvatar} alt="avatar" /></div>
                <div className="rounded-full bg-gray-200 px-3 py-1.5">{content}</div>
                </>
                }
            </div>
    )
}

export default Message
import React, { useEffect, useState } from 'react'
import SideModal from './SideModal'
import axiosInstance from '../../axiosInit';
import { searchIcon } from './SvgIcons';
import SearchUserItem from './SearchBar/SearchUserItem';
import CloseIcon from '@mui/icons-material/Close';
import { ClickAwayListener } from '@mui/material';

function SearchModal({ open, onClose }) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(false);
    const [searching, setSearching] = useState(false);

    const modalClasses = `fixed h-full w-[400px] rounded-r-xl bg-white transition-transform ease-in-out duration-500 ${
        open ? 'translate-x-0' : '-translate-x-[450px]'
      }`;

    const fetchUsers = async (term) => {
        setLoading(true);
        const res = await axiosInstance.get(`/api/user/users/?keyword=${term}`);
        setUsers(res.data);
        setLoading(false);
    }

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            fetchUsers(searchTerm);
        }

        return () => {
            setUsers([])
        }
    }, [searchTerm]);

    const handleFocus = () => {
        setSearchResult(true)
        setSearching(true)
    }

    console.log(open,onClose);
    return (
        <div style={{boxShadow:"0 0 10px 0 rgba(0,0,0,0.5)"}} className={modalClasses}>
            <div className="flex flex-col h-full">

            <h1 className="text-2xl font-bold py-6 pl-5">Search</h1>

            <div className="w-full p-5 border-b border-gray-200">
                <div className="flex items-center pl-4 py-2 bg-[#efefef] rounded-lg w-full space-x-1">
                    {!searching && searchIcon}
                    <input
                        className="bg-transparent text-base border-none outline-none flex-1 pr-3"
                        type="search"
                        value={searchTerm}
                        onFocus={handleFocus}
                        onBlur={()=>setSearching(false)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search"
                    />
                </div>
            </div>

            {users && searchResult &&
                <div className={`${loading ? 'justify-center items-center' : users.length < 1 && 'justify-center items-center'} overflow-y-auto overflow-x-hidden flex-1 max-h-full flex flex-col w-full bg-white rounded`}>
                    {loading ?
                        <svg aria-label="Loading..." className="h-6 w-6 my-2 animate-spin" viewBox="0 0 100 100"><rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg>
                        : users.length > 0 ?
                            users.map((user) => (
                                <SearchUserItem {...user} key={user._id} onClose={onClose} />
                            ))
                            :
                            <span className="text-gray-400 text-sm">No results found.</span>
                    }
                </div>
            }
            </div>
        </div>
    )
}

export default SearchModal
import React, { useEffect, useState } from 'react'
import StoriesContainer from './StoriesContainer';
import InfiniteScroll from "react-infinite-scroll-component";
import PostItem from './PostItem';
import SpinLoader from '../Layouts/SpinLoader';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../axiosInit';
import SkeletonPost from '../Layouts/SkeletonPost';
import { reloadUser } from '../../actions/userAction';
import { useDispatch } from 'react-redux';

function PostContainer() {
  const [newsfeed,setNewsfeed] = useState({
    error:null,
    posts:[],
    totalPosts:0,
    loading:true});

  const dispatch = useDispatch();

  const [page,setPage]=useState(1);

  const [posts,setPosts] = useState(Array(5).fill(1));

  //Update info about saved, like of the logginUser
  useEffect(()=>{
    reloadUser(dispatch);
  },[dispatch])

  useEffect(()=>{
    const fetchPosts=async()=>{
      // setTimeout(()=>setPosts([...posts,...Array(5).fill(1)]),5000);
      // console.log("fetchMorePosts called");
      setNewsfeed((prev)=>({...prev,loading:true}));
      try{
        const res = await axiosInstance.get(`/api/post/posts?page=${page}`);
        setNewsfeed((prev)=>{
          return {
            ...prev,
            posts:[...prev.posts,...res.data.posts],
            totalPosts:res.data.totalPosts,
            loading:false
          }
        });
      }catch(err){
        toast.error(err);
        setNewsfeed((prev)=>{
          return {
            ...prev,
            loading:false
          }
        })
      }
    };
    fetchPosts();
  },[page])

  const fetchMorePosts=()=>{
    setPage(page+1);
  }

  console.log("newsfeed:",newsfeed);
  console.log("page:",page);
  return (
    <div className="flex flex-col items-center w-full lg:w-2/3 sm:px-8 mb-8">
      <ToastContainer/>
      <StoriesContainer/>
      {newsfeed.loading&&Array(4).fill("").map((e,i)=><SkeletonPost id={i}/>)}
      <InfiniteScroll
        dataLength={newsfeed.posts.length}
        next={fetchMorePosts}
        hasMore={true}
        loader={<SpinLoader/>}
      >
      <div className="w-[468px] mt-10">
      {newsfeed.posts.map((p,i)=><PostItem {...p} id={p._id}/>)}
      </div>
      </InfiniteScroll>
    </div>
  )
}

export default PostContainer
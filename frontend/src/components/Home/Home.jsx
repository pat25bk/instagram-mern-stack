import React from 'react'
import SEO from '../SEO/SEO'
import PostContainer from './PostContainer'
import SideBar from './SideBar'

function Home() {
  return (
    <div className="bg-white w-screen">
    <SEO title="instagram"/>
    <div className="flex h-full w-full lg:w-5/6 md:w-4/5 pt-20 mx-auto">
    <PostContainer/>
    <SideBar/>
    </div>
    </div>
  )
}

export default Home
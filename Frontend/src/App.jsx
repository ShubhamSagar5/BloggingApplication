import React from 'react'
import './App.css'
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Home from './components/pages/Home'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import About from './components/pages/About'
import AllAuthor from './components/pages/AllAuthor'
import Blogs from './components/pages/Blogs'
import Dashboard from './components/pages/Dashboard'
import SingleBlog from './components/pages/SingleBlog'
import UpdateBlog from './components/pages/UpdateBlog'


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/authors' element={<AllAuthor/>}/>
          <Route path='/blogs' element={<Blogs/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/blog/:id' element={<SingleBlog/>}/>
          <Route path='/blog/update/:id' element={<UpdateBlog/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
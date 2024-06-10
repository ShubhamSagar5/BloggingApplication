import axios from 'axios'
import React, { useContext } from 'react'
import { Context } from '../../main'

const Login = () => {
  
  const {setIsAuthenticated,setUser} = useContext(Context)

  const handleLogin = async() => {
    try {
      const {data} = await axios.post("http://localhost:4000/api/v1/user/login",{
        email:"author@gmail.com",
        password:"12345677",
        role:"Author"},
      {
        withCredentials:true,
        headers:{"Content-Type":"application/json"}
      })
      console.log(data.user)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.log(error.response.message)
    }
  }
  
  
  return (
    <div>

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
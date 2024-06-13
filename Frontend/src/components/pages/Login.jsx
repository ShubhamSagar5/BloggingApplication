import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { mode, isAuthenticated,user,setUser,setIsAuthenticated } = useContext(Context);
  const [loading,setLoading] = useState(false)
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        setLoading(true)
        fetchUser()
        toast.success(res.data.message);
        setEmail("");
        setPassword("");
        setRole("");
        navigateTo("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(()=>{
        setLoading(false)
      })
  };

    const fetchUser = async () => {
      try {
        const {data} = await axios.get("http://localhost:4000/api/v1/user/myProfile",{withCredentials:true})
        setUser(data.user)
        setIsAuthenticated(true)
      } catch (error) {
        setUser({})
        setIsAuthenticated (false)
        console.log(error.response.data.message)
      }
    }

  if(isAuthenticated){
    return <Navigate to={'/'}/>
  }

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <section className="auth-form">
        <form onSubmit={handleLogin}>
          <h1>LOGIN</h1>
          <div>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">SELECT ROLE</option>
              <option value="Reader">READER</option>
              <option value="Author">AUTHOR</option>
            </select>
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p>
            Don't have any Account? <Link to={"/register"}>Register Now</Link>
          </p>
          {
           loading ? ( <BeatLoader size={30} color='gray' style={{display:"flex",
          justifyContent:"center",alignItems:"center"}}/>) : <button className="submit-btn" type="submit">
            LOGIN
          </button>
          }
          
        </form>
      </section>
    </article>
  );
};

export default Login;
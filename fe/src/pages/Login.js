import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import socialDesktop from '../images/social-desktop.PNG'; // Make sure to provide correct image paths
import socialMobile from '../images/social-mobile.PNG';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config';
import logo from "../images/logo.PNG";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (event) => {
    event.preventDefault();
    setLoading(true);
    const requestData = { email, password };
    axios.post(`${API_BASE_URL}/login`, requestData)
      .then((result) => {
        if (result.status === 200) {
          setLoading(false);
          localStorage.setItem("token", result.data.result.token);
          localStorage.setItem("user", JSON.stringify(result.data.result.user));
          dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.user });
          setLoading(false);
          navigate('/myprofile');
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: error.response.data.error
        });
      });
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="welcome">
          <img src={logo} alt="Welcome back" />
        </div>
        <div className="login-form">
          <h2>Login</h2>
          {loading ? <div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : ''}
          <form onSubmit={(e) =>login(e)}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          <p className="register-link">
            Don't have an account? <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

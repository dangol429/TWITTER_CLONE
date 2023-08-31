import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import socialDesktop from '../images/social-desktop.PNG';
import socialMobile from '../images/social-mobile.PNG';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config'; // Update with the correct API URL
import logo from '../images/logo.PNG'; // Update with the correct image path
import './signup.css'; // Update with the correct CSS file path

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = (event) => {
    event.preventDefault();
    setLoading(true);

    const requestData = { fullName: fullName, email, password }; // Include 'profileImg' if needed

    axios
      .post(`${API_BASE_URL}/signup`, requestData)
      .then((result) => {
        if (result.status === 201) {
          setLoading(false);
          Swal.fire({
            icon: 'success',
            title: 'User successfully registered',
          });
        }
        setFullName('');
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Some error occurred, please try again later!',
        });
      });
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="welcome">
          <img src={logo} alt="Welcome" />
        </div>
        <div className="register-form">
          <h2>Register</h2>
          {loading ? <div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : ''}
          <form onSubmit={(e) => signup(e)}>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              placeholder="Password"
              required
            />
            {/* Include additional fields if needed */}
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

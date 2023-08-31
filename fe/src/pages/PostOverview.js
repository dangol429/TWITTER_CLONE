import React, { useEffect, useState} from 'react';
import Card from '../components/Card';
import { API_BASE_URL } from '../../src/config';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import './postoverview.css'
import { Link}from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.PNG'
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import horizontalMoreAction from '../images/horizontalMoreAction.PNG'
import { useSelector } from 'react-redux';


const PostOverview = () => {

    const user = useSelector(state => state.userReducer);

    const [allposts, setAllposts] = useState([]);
    const [image, setImage] = useState({ preview: '', data: '' })

    const [myallposts, setMyallposts] = useState([]);

    const [postDetail, setPostDetail] = useState({});
  
    const [show, setShow] = useState(false);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const [showPost, setShowPost] = useState(false);
  
    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    const getAllPosts = async () => {
        const response = await axios.get(`${API_BASE_URL}/allposts`);

        if (response.status === 200) {
            setAllposts(response.data.posts);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Some error occurred while getting all posts'
            })
        }
    }

    const deletePost = async (postId) => {
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
        if (response.status === 200) {
            getAllPosts();
        }
    }

    const handleFileSelect = (event) => {
        const img = {
          preview: URL.createObjectURL(event.target.files[0]),
          data: event.target.files[0]
        }
        setImage(img);
      }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);
        
        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }    
        

    const addPost = async () => {

        if (image.preview === '') {
          Swal.fire({
            icon: 'error',
            title: 'Post image is mandatory!'
          })
        } else if (caption === '') {
          Swal.fire({
            icon: 'error',
            title: 'Post caption is mandatory!'
          })
        } else if (location === '') {
          Swal.fire({
            icon: 'error',
            title: 'Location is mandatory!'
          })
        } else {
          setLoading(true);
          const imgRes = await handleImgUpload();
          const request = { description: caption, location: location, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
          // write api call to create post
          const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ)
          setLoading(false);
          if (postResponse.status === 201) {
            navigator("/posts")
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Some error occurred while creating post'
            })
          }
        }
      }

    const showDetail = (post) => {
        setPostDetail(post);
    }

    useEffect(() => {
        getAllPosts();
    }, []);

  return (
    <div className='container mt-3'>
      <div className='row'>
        <div className='col-md-4'>
          {/* Sidebar */}
          <div className='d-flex flex-column h-100'>
            <div className='logo'>
              <img src={logo} alt='logo' style={{ width: '100%' }}></img>
            </div>
            <ul className="nav-links">
              <li>
                <Link to='/home'>
                  <FaHome className="icon" />
                  Home
                </Link>
              </li>
              <li>
                <Link to='/myprofile'>
                  <FaUser className="icon" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to='/logout'>
                  <FaSignOutAlt className="icon" />
                  Logout
                </Link>
              </li>
            </ul>
            <div className='bottom-content mt-auto'>
              <div className='profile-info'>
                <div className='profile-pic'>
                  <img
                    src="https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHdpbnRlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt='profile pic'
                    style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                  />
                </div>
                <div className='profile-details ms-2'>
                  <div className='username'>{user.user.fullName}</div>
                  <div className='email'>{user.user.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-8'>
          {/* Main Content */}
          <div className='main-content'>
            <h2>Home</h2>
            <button className='new-tweet-button' onClick={handlePostShow}>
              Post a New Tweet
            </button>
            <div className='row my-3'>
              {myallposts.map((post) => {
                return (
                  <div className='col-md-4 col-sm-12' key={post._id}>
                    <div className="card" onClick={handleShow}>
                      <img
                        onClick={() => showDetail(post)}
                        src={post.image}
                        className="card-img-top"
                        alt={post.description}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-md-6'>
              <div >
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                  <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={postDetail.image} alt="..." />
                    </div>
                    <div className="carousel-item">
                      <img src="https://images.unsplash.com/photo-1664574653790-cee0e10a4242?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                      <img src="https://images.unsplash.com/photo-1670396118274-4f14fdd6323d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" className="d-block w-100" alt="..." />
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='row'>
                <div className='col-6 d-flex'>
                  <img className='p-2 post-profile-pic' alt="profile pic" src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                  <div className='mt-2 ms-2'>
                    <p className='fs-6 fw-bold'>{postDetail.location}</p>
                    <p className='location'>{postDetail.description}</p>
                  </div>

                  <div className="dropdown ms-5">
                    <a className="btn" href="#" role="button" data-bs-toggle="dropdown">
                      <img alt="more action" src={horizontalMoreAction} />
                    </a>

                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">
                        <i className="fa-regular fa-pen-to-square px-2"></i>
                        Edit Post
                      </a></li>
                      <li>
                        <a className="dropdown-item" onClick={() => deletePost(postDetail._id)}>
                          <i className="fa-sharp fa-solid fa-trash px-2"></i>Delete Post
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <span className='p-2 text-muted'>2 Hours Ago</span>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='col-12 ms-2'>
                  <p>Lorem Ipsum</p>
                </div>
              </div>
              <div className='row my-3'>
                <div className='col-6 d-flex'>
                  <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                  <i className="ps-3 fs-4 fa-regular fa-comment"></i>
                  <i className="ps-3 fs-4 fa-solid fa-location-arrow"></i>
                </div>
                <div className='col-12 mt-3 ms-2'>
                  <span className='fs-6 fw-bold'>200 likes</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
        <Modal.Header closeButton>
          <span className='fw-bold fs-5'>Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-md-6 col-sm-12 mb-3'>
              <div className='upload-box'>
                <div className="dropZoneContainer">
                  <input name="file" type="file" id="drop_zone" className="FileUpload" accept=".jpg,.png,.gif" onChange={handleFileSelect} />
                  <div className="dropZoneOverlay">
                    {image.preview && <img src={image.preview} width='150' height='150' />}
                    <i class="fa-solid fa-cloud-arrow-up fs-1"></i><br />Upload Photo From Computer</div>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-between'>
              <div className='row'>
                <div className='col-sm-12 mb-3'>
                  <div className="form-floating">
                    <textarea onChange={(ev) => setCaption(ev.target.value)} className="form-control" placeholder="Add Caption" id="floatingTextarea"></textarea>
                    <label for="floatingTextarea">Add Caption</label>
                  </div>
                </div>
                <div className='col-sm-12'>
                  <div className="form-floating mb-3">
                    <input type="text" onChange={(ev) => setLocation(ev.target.value)} className="form-control" id="floatingInput" placeholder="Add Location" />
                    <label for="floatingInput"><i className="fa-solid fa-location-pin pe-2"></i>Add Location</label>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-12'>
                  {loading ? <div className='col-md-12 mt-3 text-center'>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div> : ''}
                  <button onClick={() => addPost()} className="custom-btn custom-btn-pink float-end">
                    <span className='fs-6 fw-600'>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </Modal.Body>
      </Modal>
    </div>
  )
}

      

export default PostOverview;

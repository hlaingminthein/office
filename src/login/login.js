import React, { useState } from 'react'
import { fetchLoginControllerLogin } from '../network/apiFetcher'
import { reactLocalStorage } from 'reactjs-localstorage';
import logo from '../../src/assets/img/Logo.png'
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};document.getElementById('root')

const Login = (props) => { 
    // const data = reactLocalStorage.getObject('data')
    // console.log('token is=>',data);
    // if(data.token) 
    reactLocalStorage.clear();
    // window.location.reload();

    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [modalopen, setModalopen] = useState(false)
    const [text, setText] = useState('')
    const login = (e) => {
        e.preventDefault();
        if (username && password) {
            fetchLoginControllerLogin({ username, password }, (networkErr, userErr, data) => {

                if (networkErr !== null) console.log(networkErr)
                else if (userErr !== null) {
                    setModalopen(true);
                    setText("Username or password does not match!")
                }
                else {
                    reactLocalStorage.setObject('data', data.payload);
                    props.history.push('/dashboard')
                }
            })
        }
        else {
            setModalopen(true);
            setText("Username and password required!");
        }
    }

    const closeModal = () => {
        setModalopen(false);
        setusername('');
        setpassword('');
        document.getElementById('name').focus();
    }

    return (
        <div>
            <div className="login">
                <img className="loginIcon" alt="" src={logo}></img>
                <form onSubmit={(e) => login(e)} autoComplete="off">
                    <div className="form-group ">
                        <label htmlFor="exampleInputEmail1">Username</label>
                        <input type="text" autoFocus 
                            className="form-control"
                            id="name"
                            placeholder="Enter Username"
                            onChange={(e) => setusername(e.target.value)}
                            value={username}
                            style={{ boxShadow: "none", outline: "none", padding: "25px" }} />
                    </div>
                    <div className="form-group" style={{ boxShadow: "none", outline: "none" }}>
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password"
                            className="form-control"
                            placeholder="Enter Password"
                            onChange={(e) => setpassword(e.target.value)}
                            value={password}
                            style={{ boxShadow: "none", outline: "none", padding: "25px" }} />
                    </div>
                    <div className="form-group py-3">
                        <button type="submit" className="btn btn-lg btn-block"
                            style={{ border: "1px solid #71c7ec", outline: "none", background: "#028900", color: 'white' }}>Submit</button>
                    </div>
                </form>
            </div>
            <Modal
                isOpen={modalopen}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div>
                    <h4 style={{ color: 'green' }}>Login Error</h4>

                    <p style={{ color: 'red' }}>{text}</p>

                    <button className="button" onClick={() => closeModal()}>ok</button>
                </div>
            </Modal>
        </div>
    )
}
export default Login

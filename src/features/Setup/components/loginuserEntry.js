import React, { useEffect, useState } from 'react'
import { fetchUserById, saveUser, updateUser, fetchEmployee } from '../../../network/apiFetcher'
import { Form } from '@progress/kendo-react-form';
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { useAlert } from 'react-alert'

const Loginuser = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errname, seterrname] = useState(false);
    const [errpass, seterrpass] = useState(false);
    const [erremp, seterremp] = useState(false);
    const [active, setActive] = useState(true)
    const [employeeId, setEmployeeId] = useState(0)
    const [employee, setEmployee] = useState([]);
    const [existEmployee, setExistEmployee] = useState(null);
    const [errorMsg, seterrorMsg] = useState([]);

    const alert = useAlert()

    useEffect(() => {
        const id = props.match.params.id;
        fetchEmployee().then(employeeData => {
            if (employeeData.payload) {
                setEmployee(employeeData.payload);
            }
            if (id) {
                fetchUserById(id).then(data => {
                    if (data.payload.length) {
                        const user = data.payload[0];
                        setUsername(user.username);
                        setPassword(user.password);
                        setActive(user.active == 1);
                        setEmployeeId(user.employeeId)
                        if (employeeData.payload) {
                            employeeData.payload.map(data => {
                                if (data.employeeId == user.employeeId) setExistEmployee(data);
                            });
                        }
                    }
                    // setUsers(data.payload);
                })
            }
        })
    }, []);

    const validation = () => {
        let errArr = [];
        return new Promise((resolve) => {
            seterrname(false);
            seterrpass(false);
            seterremp(false);
            if (!username.trim()) {
                errArr.push({ name: 'Please fill username!' })
                seterrname(true);
            }
            if (!password.trim()) {
                errArr.push({ name: 'Please fill password!' })
                seterrpass(true);
            }
            if(!existEmployee){
                errArr.push({name: "Please choose employee!"})
                seterremp(true);
            }
            resolve(errArr);
        });
    }

    const changeEmployee = (e) => {
        let data = e.target.value;
        if (data) {
            setEmployeeId(data.employeeId);
            setExistEmployee(data)
        }
    }

    const setname = (e) => {
        setUsername(e.target.value);
    }

    const setpass = (e) => {
        setPassword(e.target.value);
    }

    const setactive = (e) => {
        setActive(e.value);
    }

    const save = () => {
        const id = props.match.params.id;
        validation().then(data => {
            if (data.length > 0) {
                seterrorMsg(data);
                return;
            }
            if (id) {
                //update               
                updateUser({ bodyData: { username, password, active, employeeId } }, id).then(data1 => {
                    if (data1.success) {
                        props.history.push('/user');
                        alert.show(<div>Save Success</div>)
                        seterrname(false);
                        seterrorMsg([]);
                    }
                    else {
                        seterrorMsg([{ name: data1.message }])
                        seterrname(true);
                    }
                })
            }
            else {
                //insert
                saveUser({ bodyData: { username, password, active } }).then(data1 => {
                    if (data1.success) {
                        props.history.push('/user');
                        alert.show(<div>Save Success</div>)
                        seterrname(false);
                        seterrorMsg([]);
                    }
                    else {
                        seterrorMsg([{ name: data1.message }])
                        seterrname(true);
                    }
                }).catch(err => console.log('err is=>', err))
            }
        })
    }

    const cancel = () => {
        setUsername('');
        setPassword('');
        setActive(true);
        setEmployeeId(0);
        props.history.push('/user')
    }

    return (
        <div className="container-width">
            <Form
                render={(formRenderProps) => (
                    <form onSubmit={formRenderProps.onSubmit} className={'k-form'}>
                        <fieldset>
                            <legend><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>Login User Entry</legend>
                            <div className="row">
                                <div className="col-sm-12">
                                    <button
                                        type={'submit'}
                                        className="k-button entry_save_btn"
                                        onClick={() => save()}    >
                                        Save
                                      </button>
                                    <button
                                        type={'submit'}
                                        className="k-button entry_cancel_btn"
                                        style={{ marginRight: "20px" }}
                                        onClick={() => cancel()}>
                                        Cancel
                                     </button>
                                </div>
                            </div>
                            {
                                errorMsg.length ?
                                    <div className="row">
                                        <div className="col-sm-12">
                                            {
                                                errorMsg.map((err, index) =>
                                                    <p key={index} style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {err.name}</p>
                                                )
                                            }
                                        </div>
                                    </div> : ''
                            }
                            <div className="row">
                                <div className={errname ? 'err col-sm-6' : 'col-sm-6'}>
                                    <Input
                                        name="username"
                                        style={{ width: "100%" }}
                                        label="Username*"
                                        value={username}
                                        onChange={(e) => setname(e)} maxLength="45"
                                    />
                                </div>
                                <div className={errpass ? 'err col-sm-6' : 'col-sm-6'}>
                                    <Input
                                        type="password"
                                        name="password"
                                        style={{ width: "100%" }}
                                        label="Password*"
                                        value={password}
                                        onChange={(e) => setpass(e)} maxLength="45"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className={erremp ? 'err col-sm-6' : 'col-sm-6'}>
                                    <div style={{ marginTop: "9px" }}>
                                        <DropDownList
                                            label="Employee*"
                                            data={employee}
                                            value={existEmployee}
                                            textField="employeeName"
                                            dataItemKey="employeeId"
                                            onChange={(e) => changeEmployee(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "35px" }}>
                                        <Checkbox onChange={(e) => setactive(e)} value={active} defaultChecked={active} label={'Active'} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                )}
            />
        </div>
    );
}

export default Loginuser

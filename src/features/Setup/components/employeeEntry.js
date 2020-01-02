
import React, { useEffect, useState } from 'react'
import { fetchEmployeeById, saveEmployee, updateEmployee } from '../../../network/apiFetcher'
import { Form } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useAlert } from 'react-alert'

const nophoto = require('../../../assets/img/nophoto.jpg')

const Employee = (props) => {
    const alert = useAlert()
    const [employeeName, setEmployeeName] = useState('')
    const [designation, setDesignation] = useState('')
    const [createBy, setCreateBy] = useState(0)
    const [image, setImage] = useState([])
    const [employeeImage, setEmployeeImage] = useState(null);
    const [errmsg, seterrmsg] = useState(null)
    const [errmsg1, seterrmsg1] = useState(null)
    const [emp, setEmployee] = useState(null);

    useEffect(() => {
        const id = props.match.params.id;
        const data = reactLocalStorage.getObject('data');
        setCreateBy(data.userId);
        if (id) {
            fetchEmployeeById(id).then(data => {
                if (data.payload.length) {
                    const employee = data.payload[0];
                    setEmployee(data.payload[0]);

                    setEmployeeName(employee.employeeName);
                    setDesignation(employee.designation);
                    employee.employeeImage ? setImage(`http://192.168.100.50:3333/uploads/${employee.employeeImage}`) : setImage([])
                }
                // setUsers(data.payload);
            })
        }
    }, []);

    const setname = (e) => {
        setEmployeeName(e.target.value);
    }

    const setdesignation = (e) => {
        setDesignation(e.target.value);
    }

    const save = () => {
        const id = props.match.params.id;
        if (!employeeName.trim() || !designation.trim()) {
            !employeeName.trim() ? seterrmsg("Please fill Employee Name!") : seterrmsg(null);
            !designation.trim() ? seterrmsg1("Please fill Designation!") : seterrmsg1(null);
            return;
        }
        if (id) {
            //update
            updateEmployee({ bodyData: { employeeName: employeeName.trim(), designation: designation.trim(), createBy: createBy, employeeImage } }, id).then(data => {
                if (data.success) {
                    props.history.push('/employee');
                    alert.show(<div>Save Success</div>)
                }
                else {
                    seterrmsg(data.message);
                }
            })
        }
        else {
            //insert
            saveEmployee({ bodyData: { employeeName: employeeName.trim(), designation: designation.trim(), createBy: createBy, employeeImage } }, id).then(data => {
                if (data.success) {
                    props.history.push('/employee');
                    alert.show(<div>Save Success</div>)
                }
                else {
                    seterrmsg(data.message);
                }
            })
        }
    }

    const cancel = () => {
        setEmployeeName('');
        setDesignation('');
        props.history.push('/employee')
    }

    const upload = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onloadend = () => {
                setImage(reader.result);
                setEmployeeImage(file);
            }
            reader.readAsDataURL(file)
        }
    }


    return (
        <div className="container-width">
            <Form
                render={(formRenderProps) => (
                    <form onSubmit={formRenderProps.onSubmit} className={'k-form'} encType="multipart/form-data" autoComplete="off">
                        <fieldset>
                            <legend><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>Employee Entry</legend>
                            <div className="row">
                                <div className="col-sm-12">
                                    <button
                                        type={'submit'}
                                        className="k-button entry_save_btn"
                                        onClick={() => save()}
                                    >
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
                            <div className="row">
                                <div className="col-sm-6">
                                    {
                                        errmsg && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errmsg}</p>
                                    }
                                    {
                                        errmsg1 && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errmsg1}</p>
                                    }
                                </div></div>
                            <div className="row">
                                <div className={errmsg ? 'err col-sm-6' : 'col-sm-6'}>
                                    <Input
                                        name="employeename"
                                        style={{ width: "100%" }}
                                        label="Employee Name"
                                        value={employeeName} maxLength="45"
                                        onChange={(e) => setname(e)}
                                    />
                                </div>
                                <div className={errmsg1 ? 'err col-sm-6' : 'col-sm-6'}>
                                    <Input
                                        name="disignation"
                                        style={{ width: "100%" }}
                                        label="Designation"
                                        value={designation} maxLength="45"
                                        onChange={(e) => setdesignation(e)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "35px" }}>
                                        <div className="img-max-width">
                                            {
                                                image.length ? <img style={{ height: '200px' }} src={image} alt=""></img> :
                                                    <img style={{ height: '200px' }} src={nophoto} alt=""></img>
                                            }

                                        </div>
                                        <label htmlFor="upload-photo" className="upload">Upload Image</label>
                                        <input type="file" name="photo" id="upload-photo" onChange={(e) => upload(e)} accept="image/*" />
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

export default Employee 

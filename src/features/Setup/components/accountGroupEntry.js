import React, { useEffect, useState } from 'react'
import { fetchAccountGroupById, saveAccountGroup, updateAccountGroup, fetchNature, fetchDefaultAccountGroup } from '../../../network/apiFetcher'
import { Form } from '@progress/kendo-react-form';
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useAlert } from 'react-alert'

const AccountGroupEntry = (props) => {
    const alert = useAlert()
    const [accountGroup, setAccountGroup] = useState('')
    const [defaultAccountGroupId, setDefaultAccountGroupId] = useState(0)
    const [natureId, setNatureId] = useState(0)
    const [active, setActive] = useState(true)
    const [remark, setRemark] = useState('')
    const [natures, setNatures] = useState([]);
    const [defaultAccounts, setDefaultAccounts] = useState([]);
    const [createdBy, setCreatedBy] = useState(0)
    const [nature, setNature] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [errmsg, seterrmsg] = useState(null)
    const [errmsg1, seterrmsg1] = useState(null)
    const [errmsg2, seterrmsg2] = useState(null)

    useEffect(() => {
        const id = props.match.params.id;
        const data = reactLocalStorage.getObject('data');
        if (data) setCreatedBy(data.userId);
        fetchNature().then(natures => {
            setNatures(natures.payload);
            fetchDefaultAccountGroup().then(accounts => {
                setDefaultAccounts(accounts.payload)
                if (id) {
                    fetchAccountGroupById(id).then(data => {
                        console.log('data is=>',data);
                        if (data.payload.length) {
                            const accountGroup = data.payload[0];
                            setAccountGroup(accountGroup.accountGroup);
                            setNatureId(accountGroup.natureId)
                            setActive(accountGroup.active);
                            setRemark(accountGroup.remark);
                            console.log("account payload is=>",accounts.payload);
                            console.log("data payload is=>",data.payload[0])
                            if (accounts.payload) {
                                accounts.payload.map(acc => {
                                    if (acc.defaultAccountGroupId == data.payload[0].defaultAccountGroupId) {
                                        setDefaultAccount(acc);
                                        setDefaultAccountGroupId(acc.defaultAccountGroupId);
                                    }
                                })
                            }
                            if (natures.payload) {
                                natures.payload.map(nature => {
                                    if (nature.natureId == data.payload[0].natureId){
                                        setNature(nature);
                                        setNatureId(nature.natureId);
                                    } 
                                })
                            }
                        }
                    })
                }
            });
        });
    }, []);

    const setaccountGroup = (e) => {
        setAccountGroup(e.target.value);
    }

    const setactive = (e) => {
        setActive(e.value);
    }

    const setremark = (e) => {
        setRemark(e.target.value)
    }

    const changeDefaultAccount = (e) => {
        if (e.value) {
            setDefaultAccount(e.value);
            setDefaultAccountGroupId(e.value.defaultAccountGroupId);
        }
    }

    const changeNature = (e) => {
        if (e.value) {
            setNature(e.value);
            setNatureId(e.value.natureId)
        }
    }

    const save = () => {
        const id = props.match.params.id;
        if (!accountGroup.trim() || !defaultAccount || !natureId) {
            if (!accountGroup.trim()) seterrmsg("Please fill Account Group Name!");
            else seterrmsg(null);
            if (!defaultAccount) seterrmsg1("Please fill Default Account Group");
            else seterrmsg1(null);
            if (!natureId) seterrmsg2("Please fill nature!");
            else seterrmsg2(null);
            return;
        }
        if (id) {
            //update
            updateAccountGroup({ bodyData: { accountGroup: accountGroup.trim(), defaultAccountGroupId, active, natureId, createdBy, remark: remark ? remark.trim(): ''} }, id).then(data => {
                if (data.success) {
                    props.history.push('/account');
                    alert.show(<div>Save Success</div>)
                }
                else {
                    seterrmsg(data.message);
                }
            }).catch(err => { alert(err) })
        }
        else {
            //insert
            saveAccountGroup({ bodyData: { accountGroup: accountGroup.trim(), defaultAccountGroupId, active, natureId, createdBy, remark: remark ? remark.trim(): '' } }).then(data => {
                if (data.success) {
                    props.history.push('/account');
                    alert.show(<div>Save Success</div>)
                }
                else {
                    seterrmsg(data.message);
                }
            })
        }
    }

    const cancel = () => {
        setAccountGroup('');
        setRemark('');
        setActive(true);
        props.history.push('/account')
    }

    return (
        <div className="container-width">
            <Form
                render={(formRenderProps) => (
                    <form onSubmit={formRenderProps.onSubmit} className={'k-form'}>
                        <fieldset>
                            <legend><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>AccountGroup Entry</legend>
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
                            <div className="row">
                                <div className="col-sm-6">
                                    {
                                        errmsg && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errmsg}</p>
                                    }
                                    {
                                        errmsg1 && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errmsg1}</p>
                                    }
                                    {
                                        errmsg2 && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errmsg2}</p>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className={errmsg ? 'err col-sm-6' : 'col-sm-6'}>
                                    <Input
                                        name="accountgroup"
                                        style={{ width: "100%" }}
                                        label="Account Group Name*"
                                        value={accountGroup} maxLength="45"
                                        onChange={(e) => setaccountGroup(e)}
                                    />
                                </div>
                                <div className={errmsg1 ? 'err col-sm-6' : 'col-sm-6'}>
                                    <DropDownList
                                        label="DefaultAccountGroup"
                                        value={defaultAccount}
                                        data={defaultAccounts} 
                                        textField="defaultAccountGroup"
                                        dataItemKey="defaultAccountGroupId"
                                        onChange={(e) => changeDefaultAccount(e)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className={errmsg2 ? 'err col-sm-6' : 'col-sm-6'}>
                                    <div style={{ marginTop: "35px" }}>
                                        <DropDownList
                                            onChange={(e) => changeNature(e)}
                                            label="Nature"
                                            data={natures}
                                            value={nature}
                                            textField="nature"
                                            dataItemKey="natureId"
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "35px" }}>
                                        <textarea
                                            name="Remark"
                                            style={{ width: "100%" }}
                                            label="Remark"
                                            value={remark}
                                            onChange={(e) => setremark(e)}
                                            placeholder="Remark" maxLength="250"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "35px" }}>
                                        <Checkbox onChange={(e) => setactive(e)} defaultChecked={active} label={'Active'} />
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

export default AccountGroupEntry

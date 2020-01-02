import React, { useEffect, useState } from 'react'
import { fetchAccountLedgerById, saveAccountLedger, updateAccountLedger, fetchAccountGroup, fetchNature } from '../../../network/apiFetcher'
import { Form } from '@progress/kendo-react-form';
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { reactLocalStorage } from 'reactjs-localstorage';
import { useAlert } from 'react-alert'

const AccountLedgerEntry = (props) => {
    const alert = useAlert()
    const [accountName, setAccountName] = useState('')
    const [accountCode, setAccountCode] = useState('')
    const [createdBy, setCreatedBy] = useState(0);
    const [active, setActive] = useState(true)
    const [accountGroupId, setAcccountGroupId] = useState(0);
    const [accountGroup, setAcccountGroup] = useState(null)
    const [accountGroups, setAcccountGroups] = useState([])
    const [natureId, setNatureId] = useState(0);
    const [nature, setNature] = useState(null)
    const [natures, setNatures] = useState([])
    const [remark, setRemark] = useState('')

    const [erraccname, seterraccname] = useState(null);
    const [erracccode, seterracccode] = useState(null);
    const [errnature, seterrnature] = useState(null);
    const [errdefaultacc, seterrdefaultacc] = useState(null);
    const [duplicate, setduplicate] = useState(null);

    //start
    useEffect(() => {
        const id = props.match.params.id;
        const data = reactLocalStorage.getObject('data');
        if (data) {
            setCreatedBy(data.userId)
        }
        fetchAccountGroup().then(accGroup => {
            setAcccountGroups(accGroup.payload.filter(data => data.active == 1));
            fetchNature().then(nats => {
                setNatures(nats.payload);
                if (id) {
                    fetchAccountLedgerById(id).then(data => {
                        if (data.payload.length) {
                            const ledger = data.payload[0];
                            setAccountName(ledger.accountName);
                            setAccountCode(ledger.accountCode);
                            setActive(ledger.active == 0 ? false : true);
                            setAcccountGroupId(ledger.accountGroupId);
                            setNatureId(ledger.natureId);
                            setRemark(data.remark);
                            accGroup.payload.map(accobj => {
                                if (accobj.accountGroupId == ledger.accountGroupId) setAcccountGroup(accobj);
                            });
                            nats.payload.map(natobj => {
                                if (natobj.natureId == ledger.natureId) setNature(natobj);
                            });
                        }
                    }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
        }).catch(err => console.log(err))
    }, []);

    //data setup and changes
    const setAccname = (e) => {
        setAccountName(e.target.value);
    }

    const setAccCode = (e) => {
        setAccountCode(e.target.value);
    }

    const setactive = (e) => {
        setActive(e.value);
    }

    const changeAccountGroup = (e) => {
        if (e.value) {
            setAcccountGroup(e.value);
            setAcccountGroupId(e.value.accountGroupId);
        }
    }

    const changeNature = (e) => {
        if (e.value) {
            setNature(e.value);
            setNatureId(e.value.natureId);
        }
    }

    const setremark = (e) => {
        setRemark(e.target.value)
    }

    ////////////data save
    const save = () => {
        !accountName.trim() ? seterraccname("Please fill Account Name!") : seterraccname(null);
        !accountCode.trim() ? seterracccode("Please fille Account Code!") : seterracccode(null);
        if (!accountName.trim() || !accountCode.trim() || !accountGroupId || !natureId) {
            !accountName.trim() ? seterraccname("Please fill Account Name!") : seterraccname(null);
            !accountCode.trim() ? seterracccode("Please fille Account Code!") : seterracccode(null);
            !accountGroupId ? seterrdefaultacc("Pledase fill Default Account Group!") : seterrdefaultacc(null);
            !natureId ? seterrnature("Please fill Nature!") : seterrnature(null);
            return;
        }
        const id = props.match.params.id;
        if (id) {
            //update
            updateAccountLedger({ bodyData: { accountName: accountName.trim(), accountCode: accountCode.trim(), accountGroupId, remark: remark ? remark.trim(): '', natureId, active, createdBy } }, id).then(data => {
                if (data.success) {
                    props.history.push('/ledger');
                    alert.show(<div> Save Success </div>)
                }
                else {
                    setduplicate(data.message.data);
                }
            })
        }
        else {
            //insert
            saveAccountLedger({ bodyData: { accountName: accountName.trim(), accountCode: accountCode.trim(), accountGroupId, remark: remark ? remark.trim(): '', natureId, active, createdBy } }).then(data => {
                if (data.success) {
                    props.history.push('/ledger');
                    alert.show(<div> Save Success </div>)
                }
                else {
                    setduplicate(data.message.data);
                }
            })
        }
    }

    const cancel = () => {
        setAccountName('');
        setAccountCode('');
        setActive(true);
        setRemark('');
        props.history.push('/ledger')
    }

    return (<div className="container-width" >
        <Form render={
            (formRenderProps) => (<form onSubmit={formRenderProps.onSubmit}
                className={'k-form'}
                autoComplete="off" >
                <fieldset>
                    <legend > < i onClick={
                        () => cancel()}
                        className="fa fa-arrow-circle-left"
                        aria-hidden="true" > </i>Account Ledger Entry</legend >
                    <div className="row" >
                        <div className="col-sm-12" >
                            <button type={'submit'}
                                className="k-button entry_save_btn"
                                onClick={
                                    () => save()} >Save </button>
                            <button type={'submit'}
                                className="k-button entry_cancel_btn"
                                style={
                                    { marginRight: "20px" }}
                                onClick={
                                    () => cancel()} >
                                Cancel </button>
                        </div>
                    </div>

                    {/* For error messages start*/}
                    <div className="row" >
                        <div className="col-sm-6" >
                            {
                                erraccname && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i>{erraccname}</p>
                            }
                            {
                                erracccode && <p style={{ color: 'red' }} > < i className="fa fa-exclamation-circle" aria-hidden="true" > </i> {erracccode}</p>
                            }
                            {
                                duplicate && <p style={{ color: 'red' }} > <i className="fa fa-exclamation-circle" aria-hidden="true" > </i> {duplicate}</p>
                            }
                            {
                                errdefaultacc && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i>{errdefaultacc}</p>
                            }
                            {
                                errnature && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i>{errnature}</p>
                            }
                        </div>
                    </div>
                    {/* err msg end */}

                    <div className="row" >
                        <div className={erraccname || duplicate ? 'err col-sm-6' : 'col-sm-6'} >
                            <Input name="acountName"
                                style={{ width: "100%" }}
                                label="Account Name"
                                value={accountName} maxLength="45"
                                onChange={(e) => setAccname(e)} /> </div>
                        <div className={erracccode ? 'err col-sm-6' : 'col-sm-6'} >
                            <Input name="accountCode"
                                style={{ width: "100%" }}
                                label="Account Code"
                                value={accountCode} maxLength="45"
                                onChange={(e) => setAccCode(e)}
                            /> </div> </div>
                    <div className="row" >
                        <div className={errdefaultacc ? 'err col-sm-6' : 'col-sm-6'} >
                            <div style={{ marginTop: "9px" }} >
                                <DropDownList label="Accoount Group"
                                    data={accountGroups}
                                    value={accountGroup}
                                    textField="accountGroup"
                                    dataItemKey="accountGroupId"
                                    onChange={(e) => changeAccountGroup(e)}
                                /> </div> </div>
                        <div className={errnature ? 'err col-sm-6' : 'col-sm-6'}>
                            <div style={{ marginTop: "9px" }} >
                                <DropDownList label="Nature"
                                    data={natures}
                                    value={nature}
                                    textField="nature"
                                    dataItemKey="natureId"
                                    onChange={
                                        (e) => changeNature(e)} />
                            </div> </div> </div>
                    <div className="row" >
                        <div className="col-sm-6" >
                            <div style={{ marginTop: "35px" }} >
                                <textarea name="Remark"
                                    style={{ width: "100%" }}
                                    label="Remark"
                                    value={remark}
                                    onChange={(e) => setremark(e)} maxLength="250"
                                    placeholder="Remark" />
                            </div> </div>
                        <div className="col-sm-6" >
                            <div style={
                                { marginTop: "35px" }} >
                                <Checkbox onChange={
                                    (e) => setactive(e)}
                                    value={active}
                                    defaultChecked={active}
                                    label={'Active'} />
                            </div>
                        </div>
                    </div>
                </fieldset></form>
            )
        }
        /> </div>
    );
}
export default AccountLedgerEntry
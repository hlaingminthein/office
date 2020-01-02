import React, { useEffect, useState } from 'react'
import { fetchAccountJournalByid, saveAccountJournal, updateAccountJournal, fetchAccountJournal, fetchAccountLedger } from '../../network/apiFetcher'
import { Form } from '@progress/kendo-react-form';
import { Input, Checkbox, NumericTextBox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { useAlert } from 'react-alert'
import moment from 'moment';
import { reactLocalStorage } from 'reactjs-localstorage';

const TransactionEntry = (props) => {
    const [invoiceNo, setInvoiceNo] = useState('')
    const [invoiceDate, setDate] = useState(new Date())
    const [debitAccountId, setDebitAccountId] = useState(0);
    const [debitAccount, setDebitAccount] = useState([]);
    const [existDebitAccount, setExistDebitAccount] = useState(null);
    const [creditAccount, setCreditAccount] = useState([]);
    const [creditAccountId, setCreditAccountId] = useState(0);
    const [existCreditAccount, setExistCreditAccount] = useState(null);
    const [refno, setRefno] = useState('')
    const [amount, setAmount] = useState(0)
    const [remark, setRemark] = useState('');
    const [createdBy, setCreatedBy] = useState(0)
    const [accountLedger, setAccountLedger] = useState([])
    const [creditAccCode, setCreditAccCode] = useState(null)
    const [debitAccCode, setDebitAccCode] = useState(null)

    //for errmsg
    const [errdebit, setErrDebit] = useState(null);
    const [errcredit, setErrCredit] = useState(null);
    const alert = useAlert()

    useEffect(() => {
        const id = props.match.params.id;
        const localdata = reactLocalStorage.getObject('data');
        setCreatedBy(localdata.userId)
        fetchAccountLedger().then(accledger => {
            const data1 = accledger.payload.filter(data => data.active == 1);
            const data2 = accledger.payload.filter(data => data.active == 1).sort(function (a, b) {
                var nameA = a.accountCode.toUpperCase();
                var nameB = b.accountCode.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            setAccountLedger(data2);
            setDebitAccount(data1);
            setCreditAccount(data1);
            fetchAccountJournal().then(accountJournalData => {
                //setting invoice no
                setInvoiceNo(`Inv-${moment(new Date()).format('YYMMDDHHMMSS')}-${localdata.employeeId}${localdata.userId}-${accountJournalData.payload.length + 1 < 10 ? '0' + (accountJournalData.payload.length + 1).toString() : (accountJournalData.payload.length + 1).toString()}`);
                if (id) {
                    fetchAccountJournalByid(id).then(data => {
                        if (data.payload.length) {
                            const accJournal = data.payload[0];
                            setInvoiceNo(accJournal.invoiceNo);
                            setDate(new Date(accJournal.invoiceDate));
                            const exdebit = data1.filter(data1 => data1.accountLedgerId == data.payload[0].debitAccountId);
                            const excredit = data1.filter(data1 => data1.accountLedgerId == data.payload[0].creditAccountId);
                            setExistDebitAccount(exdebit[0]);
                            setExistCreditAccount(excredit[0]);
                            setDebitAccountId(data.payload[0].debitAccountId);
                            setCreditAccountId(data.payload[0].creditAccountId);
                            setRefno(accJournal.refNo);
                            setRemark(accJournal.remark);
                            setAmount(accJournal.amount);
                        }
                    })
                }
            })
        })
    }, []);

    const changeDebitAccount = (e) => {
        setExistDebitAccount(e.value);
        setDebitAccountId(e.value.accountLedgerId);
        setDebitAccCode(accountLedger.filter(d => d.accountLedgerId == e.value.accountLedgerId)[0])
    }

    const changeCreditAccount = (e) => {
        setExistCreditAccount(e.value);
        setCreditAccountId(e.value.accountLedgerId);
        setCreditAccCode(accountLedger.filter(d => d.accountLedgerId == e.value.accountLedgerId)[0])
    }

    const changeRefno = (e) => {
        setRefno(e.target.value)
    }

    const changeAmount = (e) => {
        setAmount(e.target.value)
    }

    const setremark = (e) => {
        setRemark(e.target.value)
    }
    const changeDate = (e) => {
        setDate(e.target.value);
    }

    const save = () => {
        const id = props.match.params.id;
        if (!debitAccountId || !creditAccountId) {
            !debitAccountId ? setErrDebit('Please fill Debit Account OR Debit Account Code!') : setErrDebit(null);
            !creditAccountId ? setErrCredit('Please fill Credit Account OR Credit Account Code)!') : setErrCredit(null);
            return;
        }

        if (id) {
            updateAccountJournal({ bodyData: { invoiceNo, invoiceDate: moment(invoiceDate).format('YYYY-MM-DD'), debitAccountId, creditAccountId, refno, amount, remark: remark ? remark.trim(): '', createdBy } }).then(data1 => {
                if (data1.success) {
                    props.history.push('/transaction');
                    alert.show(<div>Save Success</div>)
                }
            })
        }
        else {
            saveAccountJournal({ bodyData: { invoiceNo, invoiceDate: moment(invoiceDate).format('YYYY-MM-DD'), debitAccountId, creditAccountId, refno, amount, remark: remark ? remark.trim(): '', createdBy } }).then(data1 => {
                if (data1.success) {
                    props.history.push('/transaction');
                    alert.show(<div>Save Success</div>)
                }
            }).catch(err => console.log('err is=>', err))
        }
    }

    const cancel = () => {
        props.history.push('/transaction')
    }

    return (
        <div className="container-width">
            <Form
                render={(formRenderProps) => (
                    <form onSubmit={formRenderProps.onSubmit} className={'k-form'} autoComplete="off">
                        <fieldset>
                            <legend><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>Account Journal Entry</legend>
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
                                <div className="col-sm-12">
                                    {
                                        errdebit && <div style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errdebit}</div>
                                    }
                                    {
                                        errcredit && <div style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> {errcredit}</div>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <Input
                                        name="invoiceno"
                                        style={{ width: "100%" }}
                                        label="InvoiceNo"
                                        value={invoiceNo}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "14px" }}>
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            value={invoiceDate}
                                            format={"yyyy-MM-dd"}
                                            onChange={(e) => changeDate(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className={errdebit ? 'err col-sm-6' : 'col-sm-6'}>
                                    <div style={{ marginTop: "14px" }}>
                                        <DropDownList
                                            label="Debit Acount Code*"
                                            data={accountLedger}
                                            value={debitAccCode}
                                            textField="accountCode"
                                            dataItemKey="accountLedgerId"
                                            onChange={(e) => changeDebitAccount(e)}
                                        />
                                    </div>
                                </div>
                                <div className={errcredit ? 'err col-sm-6' : 'col-sm-6'}>
                                    <div style={{ marginTop: "14px" }}>
                                        <DropDownList
                                            label="Credit Account Code*"
                                            data={accountLedger}
                                            value={creditAccCode}
                                            textField="accountCode"
                                            dataItemKey="accountLedgerId"
                                            onChange={(e) => changeCreditAccount(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className={errdebit ? 'err col-sm-6' : 'col-sm-6'}>
                                    <div style={{ marginTop: "14px" }}>
                                        <DropDownList
                                            label="Debit Acount*"
                                            data={debitAccount}
                                            value={existDebitAccount}
                                            textField="accountName"  maxLength="45"
                                            dataItemKey="accountLedgerId"
                                            onChange={(e) => changeDebitAccount(e)}
                                        />
                                    </div>
                                </div>
                                <div className={errcredit ? 'err col-sm-6' : 'col-sm-6'}>
                                    <div style={{ marginTop: "14px" }}>
                                        <DropDownList
                                            label="Credit Acount*"
                                            data={creditAccount}  maxLength="45"
                                            value={existCreditAccount}
                                            textField="accountName"
                                            dataItemKey="accountLedgerId"
                                            onChange={(e) => changeCreditAccount(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "14px" }}>
                                        <Input
                                            name="refno"
                                            style={{ width: "100%" }}
                                            label="RefNo"  maxLength="45"
                                            value={refno}
                                            onChange={(e) => changeRefno(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div style={{ marginTop: "29px" }}>
                                        <NumericTextBox
                                            format="n2"
                                            value={amount}
                                            onChange={(e) => changeAmount(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
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
                        </fieldset>
                    </form>
                )}
            />
        </div>
    );
}

export default TransactionEntry

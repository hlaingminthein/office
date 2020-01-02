import React, { useState, useEffect } from 'react'
import { getGeneralLedger, fetchAccountLedger } from '../../../network/apiFetcher'
import NumberFormat from 'react-number-format';
import ReactDOM from 'react-dom';
import { savePDF } from '@progress/kendo-react-pdf';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import moment from 'moment'
import ReactToExcel from 'react-html-table-to-excel'
import { composeSortDescriptors } from '@progress/kendo-data-query';
import ReactToPrint from 'react-to-print';

const excel = require('../../../assets/img/excel.png')
const pdf = require('../../../assets/img/pdf.png')
const searchIcon = require('../../../assets/img/search.png')
const print = require('../../../assets/img/print.png')


const GeneralLedger = (props) => {

    const [ledgerData, setLedgerData] = useState([]);
    const [openingDebit, setOpeningDebit] = useState(0);
    const [openingCredit, setOpeningCredit] = useState(0);
    const [closingDebit, setClosingDebit] = useState(0);
    const [closingCredit, setClosingCredit] = useState(0);
    const [table, setTable] = useState(null);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [ledgerId, setLedgerId] = useState(0);
    const [ledgerName, setLedgerName] = useState(null);
    const [accLedger, setAccLedger] = useState([]);
    const [fileraccLedger, setFilteraccledger] = useState([]);
    const [ledgervalue, setLedgervalue] = useState(null);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [showerr, setShowerr] = useState(false);

    useEffect(() => {
        fetchAccountLedger().then(data => {
            // setAccLedger(data.payload);
            const dd = data.payload.map(d => {
                return (
                    {
                        text: `${d.accountName}/${d.accountCode}`,
                        id: d.accountLedgerId
                    });
            })

            setAccLedger(dd);
            setFilteraccledger(dd);
        })
    }, []);

    const ledgerChange = (e) => {
        setLedgervalue(e.target.value);
        if (e.target.value) {
            setLedgerId(e.target.value.id);
            setLedgerName(e.target.value.text);
        }
    }

    const filterChange = (e) => {
        let search = e.filter.value;
        setFilteraccledger(accLedger.filter(data => data.text.trim().toLowerCase().indexOf(search.trim().toLowerCase()) !== -1))
    }

    const changeDate = (e) => {
        if (e.target.name == "from") setFromDate(e.target.value);
        else setToDate(e.target.value);
    }

    const search = () => {
        if (ledgervalue) {
            setShowerr(false);
            getGeneralLedger({
                bodyData: {
                    startDate: moment(fromDate).format('YYYY-MM-DD'),
                    endDate: moment(toDate).format('YYYY-MM-DD'),
                    accountLedgerId: ledgerId
                }
            }).then(data => {
                const ledger = data.payload[1];
                const opening = data.payload[0][0].opening;
                const generalData = ledger.reduce((r, c) => {
                    return ({
                        debit: r.debit + c.debit,
                        credit: r.credit + c.credit
                    })
                }
                    , { debit: 0, credit: 0 });

                setLedgerData(ledger.map(v => ({ ...v, invoiceDate: moment(v.invoiceDate).format('YYYY-MM-DD') })));

                if (opening > 0) {
                    setOpeningDebit(opening)
                    setOpeningCredit(0)
                    const closingDebit = opening + generalData.debit;
                    const closingCredit = generalData.credit;
                    const closing = closingDebit - closingCredit;
                    if (closing >= 0) {
                        setClosingCredit(closing)
                        setClosingDebit(0)
                        setTotalDebit(opening + generalData.debit)
                        setTotalCredit(generalData.credit + closing)
                    }
                    else {
                        setClosingDebit((-1) * closing)
                        setClosingCredit(0)
                        setTotalDebit(opening + generalData.debit + ((-1) * closing))
                        setTotalCredit(generalData.credit)
                    }
                }

                //opening<0
                else {
                    setOpeningCredit((-1) * opening)
                    setOpeningDebit(0)
                    const closingDebit = generalData.debit
                    const closingCredit = ((-1) * opening) + generalData.credit
                    const closing = closingDebit - closingCredit
                    if (closing >= 0) {
                        setClosingCredit(closing)
                        setClosingDebit(0)
                        setTotalDebit(generalData.debit)
                        setTotalCredit((-1 * opening) + generalData.credit + closing)
                    }
                    else {
                        setClosingDebit((-1) * closing)
                        setClosingCredit(0)
                        setTotalDebit(generalData.debit + ((-1) * closing))
                        setTotalCredit((-1 * opening) + generalData.credit)
                    }
                }
            });
        }
        else {
            setShowerr(true);
        }

    }

    const exportPDF = () => {
        savePDF(ReactDOM.findDOMNode(table), {
            paperSize: 'A4',
            margin: '10pt',
            landscape: true,
            repeatHeaders: true,
            fileName: `${ledgerName}-${moment(new Date()).format("YYYY-MM-DD")}`
        });
    }

    return (
        <div>
            <div className="container-width" >
                <div className="ph_report">
                    <div className="report-bar">
                        <div className="export-btn">
                            <ReactToPrint
                                trigger={() => <img className="export-img" onClick={() => exportPDF()} src={print} alt=""></img>}
                                content={() => table}
                            />
                        </div>
                        <div className="export-btn">
                            <img className="export-img" onClick={() => exportPDF()} src={pdf} alt=""></img>
                        </div>
                        <div className="export-btn">
                            <ReactToExcel
                                className="btn exc"
                                table="table-to-xls"
                                filename={`${ledgerName}-${moment(new Date()).format("YYYY-MM-DD")}`}
                                sheet="sheet1"
                                buttonText="" />
                            <img className="export-img" src={excel} alt=""></img>
                        </div>
                        <div className="export-btn">
                            <img className="export-img" onClick={() => search()} src={searchIcon} alt=""></img>
                        </div>
                        <div className={showerr ? 'err for-datepicker' : 'for-datepicker'}>
                            <ComboBox style={{ width: "100%" }} data={fileraccLedger} onChange={(e) => ledgerChange(e)}
                                filterable={true} onFilterChange={(e) => filterChange(e)} value={ledgervalue} textField="text" />

                        </div>
                        {/* to date */}
                        <div className="for-datepicker">
                            <DatePicker style={{ width: "100%" }} onChange={(e) => changeDate(e)} name="to" value={toDate} format={"yyyy-MM-dd"}
                            />
                        </div>
                        {/* from date */}
                        <div className="for-datepicker">
                            <DatePicker style={{ width: "100%" }} onChange={(e) => changeDate(e)} name="from" value={fromDate} format={"yyyy-MM-dd"} />
                        </div>
                        {showerr && <p style={{ color: 'red' }}><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Please choose Ledger Name or Code!</p>}
                    </div>
                    <div ref={(table) => { setTable(table) }}>
                        <div style={{ textAlign: 'center', padding: '15px', color: 'gray' }}>
                            <h5>Kumo Solutions Co.Ltds</h5>
                            <h6>
                                General Ledger ({fromDate ? moment(fromDate).format("YYYY-MM-DD") : ''} to {toDate ? moment(fromDate).format("YYYY-MM-DD") : ''})
                                </h6>

                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th colSpan="5">
                                        <h6 style={{ display: 'inline' }}>Account Ledger Name : </h6> {ledgerName}
                                    </th>
                                </tr>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Invoice Date</th>
                                    <th>Account Name</th>
                                    <th style={{ textAlign: "right" }}>Debit</th>
                                    <th style={{ textAlign: "right" }}>Credit</th>
                                    {/* <th>Remark</th> */}
                                </tr>


                                <tr style={{ color: "rgb(179, 36, 25)" }}>
                                    <td colSpan="2">
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                        Opening
                                 </td>
                                    <td className="thousand_s" >
                                        <NumberFormat disabled="true" className="pad" value={openingDebit} thousandSeparator={true} />
                                    </td>
                                    <td className="thousand_s" >
                                        <NumberFormat disabled="true" className="pad" value={openingCredit} thousandSeparator={true} />
                                    </td>
                                </tr>

                            </thead>
                            <tbody>
                                {ledgerData.length > 0 &&
                                    ledgerData.map(data => {
                                        return (
                                            <tr>
                                                <td>{data.invoiceNo}</td>
                                                <td>{data.invoiceDate}</td>
                                                <td>{data.accountName}</td>
                                                <td className="thousand_s" > <NumberFormat disabled="true" className="pad" value={data.debit} thousandSeparator={true} /></td>
                                                <td className="thousand_s" ><NumberFormat disabled="true" className="pad" value={data.credit} thousandSeparator={true} /></td>
                                                {/* <td>{data.remark}</td> */}
                                            </tr>
                                        )
                                    })
                                }
                                <tr style={{ color: "rgb(179, 36, 25)" }}>
                                    <td colSpan="2">
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                        Closing
                                        </td>
                                    <td className="thousand_s" >
                                        <NumberFormat disabled="true" className="pad" value={closingDebit} thousandSeparator={true} />
                                    </td>
                                    <td className="thousand_s" >
                                        <NumberFormat disabled="true" className="pad" value={closingCredit} thousandSeparator={true} />
                                    </td>
                                </tr>
                                <tr style={{ color: "#000000" }}>
                                    <th colSpan="3" style={{ textAlign: 'center' }}>
                                        Total
                                        </th>
                                    <th className="thousand_s" >
                                        <NumberFormat disabled="true" className="pad" value={totalDebit} thousandSeparator={true} />
                                    </th>
                                    <th className="thousand_s" >
                                        <NumberFormat disabled="true" className="pad" value={totalCredit} thousandSeparator={true} />
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                        {/*   ************************For Excel***************************** */}
                        <table className="table" id="table-to-xls" style={{ display: 'none' }}>
                            <thead>
                                <tr>
                                    <th colSpan="5">
                                        <h6 style={{ display: 'inline' }}>Account Ledger Name : {ledgerName} </h6>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Invoice Date</th>
                                    <th>Account Name</th>
                                    <th style={{ textAlign: "right" }}>Debit</th>
                                    <th style={{ textAlign: "right" }}>Credit</th>
                                    {/* <th>Remark</th> */}
                                </tr>
                                {
                                    ledgerData.length > 0 &&
                                    <tr style={{ color: "rgb(179, 36, 25)" }}>
                                        <th colSpan="2">
                                        </th>
                                        <th style={{ textAlign: "left" }}>
                                            Opening
                                 </th>
                                        <th className="thousand_s" style={{ textAlign: 'right' }} >
                                            {openingDebit}
                                        </th>
                                        <th className="thousand_s" style={{ textAlign: 'right' }} >
                                            {openingCredit}
                                        </th>
                                    </tr>
                                }
                            </thead>
                            <tbody>
                                {ledgerData.length > 0 &&
                                    ledgerData.map(data => {
                                        return (
                                            <tr>
                                                <td>{data.invoiceNo}</td>
                                                <td>{data.invoiceDate}</td>
                                                <td>{data.accountName}</td>
                                                <td className="thousand_s" >{data.debit}</td>
                                                <td className="thousand_s" >{data.credit}</td>
                                                {/* <td>{data.remark}</td> */}
                                            </tr>
                                        )
                                    })
                                }
                                {ledgerData.length > 0 &&
                                    <tr style={{ color: "rgb(179, 36, 25)" }}>
                                        <th colSpan="2">
                                        </th>
                                        <th style={{ textAlign: "left" }}>
                                            Closing
                                        </th>
                                        <th className="thousand_s" >
                                            {closingDebit}
                                        </th>
                                        <th className="thousand_s" >
                                            {closingCredit}
                                        </th>
                                    </tr>
                                }
                                {ledgerData.length > 0 &&
                                    <tr style={{ color: "#000000" }}>
                                        <th colSpan="3" style={{ textAlign: 'center' }}>
                                            Total
                                        </th>
                                        <th className="thousand_s" >
                                            {totalDebit}
                                        </th>
                                        <th className="thousand_s" >
                                            {totalCredit}
                                        </th>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GeneralLedger
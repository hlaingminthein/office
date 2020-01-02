import React, { useEffect, useState } from 'react'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { fetchAccountJournal } from '../../network/apiFetcher'
import { orderBy } from '@progress/kendo-data-query';
import NumberFormat from 'react-number-format';
import moment from 'moment'
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { GridPDFExport } from '@progress/kendo-react-pdf';

const Transaction = (props) => {
    const [accountJournal, setaccountJournal] = useState([]);
    const [filterAccountJournal, setfilterAccountJournal] = useState([]);
    const [sort, setSort] = useState([{ field: 'invoiceNo', dir: 'asc' }]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(15);

    let gridPDFExport;

    useEffect(() => {
        fetchAccountJournal().then(data => {
            const dd = data.payload.map(v => ({ ...v, invoiceDate: moment(v.invoiceDate).format('YYYY-MM-DD') }));
            const accjournal = dd.filter(v => v.invoiceDate == moment(new Date()).format('YYYY-MM-DD'));
            setaccountJournal(dd);
            setfilterAccountJournal(accjournal);
        })
    }, []);

    const addnew = (e) => {
        if (e) props.history.push(`/transactionentry/${e.accountJournalId}`)
        else props.history.push('/transactionentry/')
    }

    const cancel = () => {
        props.history.push('/transaction')
    }

    const searching = (e) => {
        let fromdateValue = null;
        let todateValue = null;
        let serchValue = null;

        if (e.target.name == "fromdate") {
            fromdateValue = e.value;
            setFromDate(e.value)
        }
        else if (e.target.name == "todate") {
            todateValue = e.value;
            setToDate(e.value)
        }
        else {
            serchValue = e.target.value;
            setSearch(serchValue);
        }
        filter(fromdateValue, todateValue, serchValue);
    }

    const filter = (fromdateValue, todateValue, searchValue) => {
        fromdateValue = !fromdateValue ? fromDate ? moment(fromDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
            : fromdateValue ? moment(fromdateValue).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');

        todateValue = !todateValue ? toDate ? moment(toDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
            : todateValue ? moment(todateValue).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');

        searchValue = searchValue == "" ? null : !searchValue ? search : searchValue;

        if (searchValue && fromdateValue) {
            setfilterAccountJournal(accountJournal.filter(data => ((data.invoiceNo.trim().toLowerCase() + "¶»" + data.refNo.trim().toLowerCase() + "¶»" + data.debit.trim().toLowerCase()
                + "¶»" + data.credit.trim().toLowerCase()).indexOf(searchValue.trim().toLowerCase()) !== -1) && (new Date(data.invoiceDate) <= new Date(todateValue) && new Date(data.invoiceDate) >= new Date(fromdateValue))))
        }
        else if (searchValue) {
            setfilterAccountJournal(accountJournal.filter(data => ((data.invoiceNo.trim().toLowerCase() + "¶»" + data.refNo.trim().toLowerCase() + "¶»" + data.debit.trim().toLowerCase()
                + "¶»" + data.credit.trim().toLowerCase()).indexOf(searchValue.trim().toLowerCase()) !== -1)))
        }
        else if (fromdateValue) {
            setfilterAccountJournal(accountJournal.filter(data => new Date(data.invoiceDate) <= new Date(todateValue) && new Date(data.invoiceDate) >= new Date(fromdateValue)))
        }
        else {
            setfilterAccountJournal(accountJournal)
        }
    }

    const refresh = () => {
        setFromDate(new Date());
        setToDate(new Date());
        setSearch('');
        filter(new Date(), new Date(), '');
    }

    const pageChange = (event) => {
        console.log("event.page is=>", event.page);
        setSkip(event.page.skip);
        setTake(event.page.take);
    }

    const exportPDF = () => {
        gridPDFExport.save(filterAccountJournal);
    }

    return (
        <div className="container-width" >

                <Grid sortable sort={sort} onSortChange={(e) => setSort(e.sort)} pageable={true} onPageChange={(e) => pageChange(e)} skip={skip} take={take} total={filterAccountJournal.length}
                    style={{ minWidth: "1000px", height: "calc(100vh - 123px)" }} data={orderBy(filterAccountJournal, sort).slice(skip, take + skip)} >
                    <GridToolbar >
                        <div>
                            <h5 className="label">Account Journal</h5>
                            {/* <button
                        title="Export PDF"
                        className="k-button k-primary"
                        onClick={()=>exportPDF()}
                    /> */}
                            <button onClick={() => addnew()} style={{ float: 'right', marginRight: '10px' }}
                                title="Add new" className="k-button k-primary">
                                Add new
                        </button>
                            <div className="over-search">
                                <i className="fa fa-search s-icon"
                                    aria-hidden="true"> </i>
                                <input type='text' autoComplete="off" name="searchKeyword" value={search} onChange={(e) => searching(e)} className="search" />
                            </div>
                            {/* to date */}
                            <div className="for-datepicker">
                                <DatePicker style={{ width: "100%" }} value={toDate} format={"yyyy-MM-dd"}
                                    name="todate"
                                    onChange={(e) => searching(e)}
                                />
                            </div>
                            {/* from date */}
                            <div className="for-datepicker">
                                <DatePicker style={{ width: "100%" }} value={fromDate} format={"yyyy-MM-dd"}
                                    name="fromdate"
                                    onChange={(e) => searching(e)}
                                />
                            </div>
                            <div className="refresh" onClick={() => refresh()}>
                                <i className="fa fa-refresh" aria-hidden="true"></i>
                            </div>
                        </div>
                    </GridToolbar>
                    <Column title="No" width="50px"
                        cell={props => (
                            <td style={{ textAlign: 'center' }} >
                                {props.dataIndex}
                            </td>
                        )} />
                    <Column field="invoiceNo" title="InvoiceNo" />
                    <Column field="invoiceDate" title="InvoiceDate" />
                    <Column field="refNo" title="RefNo" />
                    <Column field="debit" title="DebitAccount" />
                    <Column field="credit" title="CreditAccount" />
                    <Column title="Amount" cell={props => (
                        <td className="thousand_s" style={{ textAlign: 'center' }} >
                            <NumberFormat value={props.dataItem.amount} thousandSeparator={true} />
                        </td>)} />
                    <Column field="remark" title="Remark" />
                    <Column width="50px"
                        cell={props => (
                            <td style={{ textAlign: 'center' }} >
                                < i onClick={() => addnew(props.dataItem)}
                                    className="fa fa-pencil edit-button"
                                    aria-hidden="true" > </i> </td>)} />
                </Grid>
            
        </div>
    )
}

export default Transaction
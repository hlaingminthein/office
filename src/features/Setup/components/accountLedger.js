import React, { useEffect, useState } from 'react'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { fetchAccountLedger } from '../../../network/apiFetcher'
import { orderBy } from '@progress/kendo-data-query';

const AccountLedger = (props) => {
    const [ledger, setLedger] = useState([])
    const [filterAccountLedger, setfilterAccountLedger] = useState([]);
    const [sort, setSort] = useState([{ field: 'accountName', dir: 'asc' }, { field: 'accountCode', dir: 'asc' }]);

    const addnew = (e) => {
        if (e) props.history.push(`/accountledgerentry/${e.accountLedgerId}`)
        else props.history.push('/accountledgerentry/')
    }

    useEffect(() => {
        fetchAccountLedger().then(data => {
            setLedger(data.payload);
            setfilterAccountLedger(data.payload);
        })
    }, []);

    const cancel = () => {
        props.history.push('/setup')
    }

    const filter = (e) => {
        let search = e.target.value;
        if (search) {
            setfilterAccountLedger(ledger.filter(data => (data.accountName.trim().toLowerCase() + "¶»" + data.accountCode.trim().toLowerCase()).indexOf(search.trim().toLowerCase()) !== -1))
        }
        else setfilterAccountLedger(ledger);
    }

    return (
        <div className="container-width">
            {/* I am login user */}
            <Grid sortable sort={sort} onSortChange={(e) => setSort(e.sort)}
                style={{ minWidth: "700px", height: "calc(100vh - 123px)" }}
                data={orderBy(filterAccountLedger, sort)}
            >
                <GridToolbar>
                    <div>
                        <h5 className="label"><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>Account Ledger</h5>
                        <button style={{ float: 'right', marginRight: '10px' }} onClick={() => addnew()} title="Add new" className="k-button k-primary" >
                            Add new
                    </button>
                        <div className="over-search">
                            <i className="fa fa-search s-icon"
                                aria-hidden="true"> </i>
                            <input type='text' onChange={(e) => filter(e)} className="search" />
                        </div>
                    </div>
                </GridToolbar>
                <Column title="No" width="50px"
                    cell={props => (
                        <td style={{ textAlign: 'center' }} >
                            {props.dataIndex}
                        </td>
                            )}/>
                <Column field="accountName" title="Account Name" />
                <Column field="accountCode" title="Account Code" />
                <Column field="remark" title="Remark" />
                <Column width="100px"
                    field="active"
                    title="Active"
                    cell={props => (
                        <td>
                            <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                        </td>
                    )}
                />
                <Column width="50px" cell={props => (
                    <td style={{ textAlign: 'center' }}>
                        <i onClick={() => addnew(props.dataItem)} className="fa fa-pencil edit-button" aria-hidden="true"></i>
                    </td>
                )} />
            </Grid>
        </div>
    )
}

export default AccountLedger

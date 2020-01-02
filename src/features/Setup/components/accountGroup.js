import React, { useEffect, useState } from 'react'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { fetchAccountGroup } from '../../../network/apiFetcher'
import { orderBy } from '@progress/kendo-data-query';

const AccountGroup = (props) => {
    const [accountGroup, setaccountGroup] = useState([])
    const [sort, setSort] = useState([{ field: 'accountGroup', dir: 'asc' }, { field: 'defaultAccountGroup', dir: 'asc' }]);
    const [filterAccGroup, setFilterAccGroup] = useState([]);

    useEffect(() => {
        fetchAccountGroup().then(data => {
            setaccountGroup(data.payload);
            setFilterAccGroup(data.payload);
        })
    }, []);

    const addnew = (e) =>{
        if(e) props.history.push(`/accountgroupentry/${e.accountGroupId}`)
        else props.history.push('/accountgroupentry/')
    }

    const cancel = () => {
        props.history.push('/setup')
    }

    const filter = (e) => {
        let search = e.target.value;
        if (search) {
            setFilterAccGroup(accountGroup.filter(data => (data.accountGroup.trim().toLowerCase()).indexOf(search.trim().toLowerCase()) !== -1))
        }
        else setFilterAccGroup(accountGroup);
    }

    return (
        <div className="container-width">
            {/* I am login user */}
            <Grid sortable sort={sort} onSortChange={(e) => setSort(e.sort)}
                style={{ minWidth: "800px", height: "calc(100vh - 123px)" }}
                data={orderBy(filterAccGroup,sort)}
            >
                <GridToolbar>
                    <div>
                        <h5 className="label"><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>Account Group</h5>
                        <button  onClick={()=>addnew()} style={{ float: 'right', marginRight: '10px' }} title="Add new" className="k-button k-primary" >
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
                <Column field="accountGroup" title="Account Group" />
                <Column field="defaultAccountGroup" title="Default Account Group" />
                <Column field="nature" title="Nature" />
                <Column field="remark" title="Remark" />
                <Column width="70px"
                    field="active"
                    title="Active"
                    cell={props => (
                        <td style={{ textAlign: 'center' }}>
                            <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                        </td>
                    )}
                />
                <Column width="50px" cell={props => (
                    <td style={{ textAlign: 'center' }}>
                        <i  onClick={()=>addnew(props.dataItem)} className="fa fa-pencil edit-button" aria-hidden="true"></i>
                    </td>
                )} />
            </Grid>
        </div>
    )
}

export default AccountGroup

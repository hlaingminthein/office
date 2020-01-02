import React, { useEffect, useState } from 'react'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { fetchUser } from '../../../network/apiFetcher'
import { orderBy } from '@progress/kendo-data-query';
import { filter } from '@progress/kendo-data-query/dist/npm/transducers';

const Loginuser = (props) => {
    const [users, setUsers] = useState([]);
    const [filterUser, setfilterUser] = useState([]);
    const [sort, setSort] = useState([{ field: 'username', dir: 'asc' }])

    useEffect(() => {
        fetchUser().then(data => {
            setUsers(data.payload);
            setfilterUser(data.payload);
        })
    }, []);

    const addnew = (e) => {
        if (e) props.history.push(`/userentry/${e.userId}`)
        else props.history.push('/userentry/')
    }

    const cancel = () => {
        props.history.push('/setup')
    }

    const filter = (e) => {
        // this.dataListFiltered.filter((s) => (s.invNo.trim() + (s.customer ? '¶»' + s.customer.name.trim() : '') 
        // + (s.site ? "¶»" + s.site.siteCode.trim() : '')).toLowerCase().indexOf(this.search.toLowerCase().trim()) !== -1);
        let search = e.target.value;
        if (search) {
            setfilterUser(users.filter(data => data.username.trim().toLowerCase().indexOf(search.trim().toLowerCase()) !== -1))
        }
        else setfilterUser(users);
    }

    return (
        <div className="container-width" >
            <Grid sortable sort={sort} onSortChange={(e) => setSort(e.sort)} 
                style={{ minWidth: "500px", height: "calc(100vh - 123px)" }} data={orderBy(filterUser, sort)} >
                <GridToolbar >
                    <div>
                        <h5 className="label"> <i onClick={() => cancel()}
                            className="fa fa-arrow-circle-left" aria-hidden="true">
                        </i>Login User</h5>
                        <button onClick={() => addnew()} style={{ float: 'right', marginRight: '10px' }}
                            title="Add new" className="k-button k-primary">
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
                <Column field="username"
                    title="Username" />
                <Column width="70px"
                    field="active"
                    title="Active"
                    cell={props => (<td style={
                        { textAlign: 'center' }} >
                        <input disabled type="checkbox"
                            checked={props.dataItem[props.field]}
                        />
                    </td>
                    )} />
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

export default Loginuser
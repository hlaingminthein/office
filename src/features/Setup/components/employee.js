import React, { useEffect, useState } from 'react'
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { fetchEmployee } from '../../../network/apiFetcher'
import { orderBy } from '@progress/kendo-data-query';

const Employee = (props) => {
    const [employee, setEmployee] = useState([])
    const [sort, setSort] = useState([{ field: 'employeeName', dir: 'asc' }, {field: 'disignation', dir: 'asc'}])
    const [filterEmployee, setFilterEmployee] = useState([]);

    useEffect(() => {
        fetchEmployee().then(data => {
            setEmployee(data.payload);
            setFilterEmployee(data.payload);
        })
    }, []);

    const addnew = (e) =>{
        if(e) props.history.push(`/employeeentry/${e.employeeId}`)
        else props.history.push('/employeeentry/')
    }

    const cancel = () => {
        props.history.push('/setup')
    }

    const filter = (e) => {
        let search = e.target.value;
        if (search) {
            setFilterEmployee(employee.filter(data => (data.employeeName.trim().toLowerCase() + "¶»" + data.designation.trim().toLowerCase()).indexOf(search.trim().toLowerCase()) !== -1))
        }
        else setFilterEmployee(employee);
    }
    
    return (
        <div className="container-width">
            {/* I am login user */}
            <Grid sortable sort={sort} onSortChange={(e) => setSort(e.sort)}
                style={{ minWidth: "500px", height: "calc(100vh - 123px)" }}
                data={orderBy(filterEmployee, sort)}
            >
                <GridToolbar>
                    <div>
                        <h5 className="label"><i onClick={() => cancel()} className="fa fa-arrow-circle-left" aria-hidden="true"></i>Employee</h5>
                        <button onClick={()=>addnew(props.dataItem)} style={{ float: 'right', marginRight: '10px' }} title="Add new" className="k-button k-primary" >
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
                <Column field="employeeName" title="Employee Name" />
                <Column field="designation" title="Designation" />
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
                <Column width="50px" cell={props => (
                    <td style={{ textAlign: 'center' }}>
                        <i onClick={()=>addnew(props.dataItem)} className="fa fa-pencil edit-button" aria-hidden="true"></i>
                    </td>
                )} />
            </Grid>
        </div>
    )
}

export default Employee

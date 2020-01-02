import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '../Home/container/main'
import Setup from '../Setup/setup'
import Report from '../Report/container/Report'
import Transaction from '../Transaction/transaction'
import TransactionEntry from '../Transaction/transactionEntry'
import User from '../Setup/components/loginuser'
import UserEntry from '../Setup/components/loginuserEntry'
import Employee from '../Setup/components/employee'
import EmployeeEntry from '../Setup/components/employeeEntry'
import Account from '../Setup/components/accountGroup'
import AccountGroupEntry from '../Setup/components/accountGroupEntry'
import Ledger from '../Setup/components/accountLedger'
import AccountLedgerEntry from '../Setup/components/accountLedgerEntry'
import GeneralLedger from '../Report/component/generalLedger'


// import HomeContainer from '../Home/Container/Homecontainer';
import login from '../../login/login'
const Routing = props => {
    return (
        <div>
            <Switch>
                <Route path='/' exact component={login} />
                <Route path='/login' exact component={login} />
                <Route path='/dashboard' exact component={Home} />
                <Route path="/setup" exact component={Setup} />
                <Route path="/transaction" exact component={Transaction} />
                <Route path="/transactionentry" exact component={TransactionEntry} />
                <Route path="/transactionentry/:id" exact component={TransactionEntry} />
                <Route path="/report" exact component={Report} />
                <Route path="/generalledger" exact component={GeneralLedger} />

                <Route path="/user" exact component={User} />
                <Route path="/userentry" exact component={UserEntry} />
                <Route path="/userentry/:id" exact component={UserEntry} />

                <Route path="/employee" exact component={Employee} />
                <Route path="/employeeentry" exact component={EmployeeEntry} />
                <Route path="/employeeentry/:id" exact component={EmployeeEntry} />

                <Route path="/account" exact component={Account} />
                <Route path="/accountgroupentry" exact component={AccountGroupEntry} />
                <Route path="/accountgroupentry/:id" exact component={AccountGroupEntry} />

                <Route path="/ledger" exact component={Ledger} />
                <Route path="/accountledgerentry" exact component={AccountLedgerEntry} />
                <Route path="/accountledgerentry/:id" exact component={AccountLedgerEntry} />

                <Redirect to='/' />
            </Switch>
        </div>

    )
}

export default Routing
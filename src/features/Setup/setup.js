import React from 'react'

const setup = (props) => {

    const goRoute = (name) => {
        props.history.push(`/${name}`)
    }

    return (
        <div>
            <div className="container-width" >
                <div className="s_card" onClick={() => goRoute("user")}>
                    <span className="fa fa-user f-icon"></span>
                    Login User
                </div>
                <div className="s_card" onClick={() => goRoute("employee")}>
                    <span className="fa fa-address-card f-icon"></span>
                    Employee
                </div>
                <div className="s_card" onClick={() => goRoute("account")}>
                    <span className="fa fa-users f-icon"></span>
                    Account Group
                </div>
                <div className="s_card" onClick={() => goRoute("ledger")}>
                    <span className="fa fa-book f-icon"></span>
                    Account Ledger
                </div>
            </div>
        </div>
    )
}
export default setup

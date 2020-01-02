import React from 'react'

const report = (props) => {

    const goRoute = (name) => {
        props.props.history.push(`/${name}`)
    }

    return (
        <div>
            <div className="container-width" >
                <div className="g_card" onClick={() => goRoute("generalledger")}>
                    <span className="fa fa-book f-icon"></span>
                    General Ledger
                </div>
            </div>
        </div>
    )
}
export default report

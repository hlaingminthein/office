import {
    LOGIN_CONTROLLER_ADMIN,
    USER_CONTROLLER, ADDUSER_CONTROLLER, UPDATEUSER_CONTROLLER,
    EMPLOYEE_CONTROLLER, ADDEMPLOYEE_CONTROLLER, UPDATEEMPLOYEE_CONTROLLER,
    ACCOUNTGROUP_CONTROLLER, ADDACCOUNTGROUP_CONTROLLER, UPDATEACCOUNTGROUP_CONTROLLER,
    ACCOUNTLEDGER_CONTROLLER, ADDACCOUNTLEDGER_CONTROLLER, UPDATEACCOUNTLEDGER_CONTROLLER,
    NATURE_CONTROLLER, DEFAULTACCOUNTGROUP_CONTROLLER,
    ACCOUNTJOURNAL_CONTROLLER, ADDACCOUNTJOURNAL_CONTROLLER, UPDATEACCOUNTJOURNAL_CONTROLLER, GETACCOUNTJOURNAL_CONTROLLER,
    GENERALLEDGER_CONTROLLER,DASHBOARD_CONTROLLER
}
    from './api.train'
import { Promise } from 'q'

export const fetchLoginControllerLogin = ({ username, password }, callback) => {
    fetch(LOGIN_CONTROLLER_ADMIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        body: JSON.stringify({ username: username, password: password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) callback(null, null, data)
            else callback(null, data, null)
        })
        .catch(error => callback(error, null, null))
}

//user
export const fetchUser = () => {
    return new Promise((resolve) => {
        fetch(USER_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const fetchUserById = (id) => {
    return new Promise((resolve) => {
        fetch(USER_CONTROLLER + `byid/${id}`).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const saveUser = ({ bodyData }) => {
    return new Promise((resolve) => {
        fetch(ADDUSER_CONTROLLER, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

export const updateUser = ({ bodyData }, id) => {
    return new Promise((resolve) => {
        fetch(`${UPDATEUSER_CONTROLLER}/${id}`, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "put",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}


//employee
export const fetchEmployee = () => {
    return new Promise((resolve) => {
        fetch(EMPLOYEE_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const fetchEmployeeById = (id) => {
    return new Promise((resolve) => {
        fetch(EMPLOYEE_CONTROLLER + `byid/${id}`).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const saveEmployee = ({ bodyData }) => {
    console.log('employeeImage is=>',bodyData.employeeImage);
    return new Promise((resolve) => {
        let form = new FormData();
        form.append('employeeName', bodyData.employeeName);
        form.append('designation', bodyData.designation);
        form.append('employeeImage', bodyData.employeeImage);
        form.append('createBy', bodyData.createBy);

        fetch(ADDEMPLOYEE_CONTROLLER, {
            headers: {
                "Accept": "*/*"
            },
            method: "post",
            body: form,
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

export const updateEmployee = ({ bodyData }, id) => {
    return new Promise((resolve) => {
        let form = new FormData();
        form.append('employeeName', bodyData.employeeName);
        form.append('designation', bodyData.designation);
        form.append('createBy', bodyData.createBy);
        if (bodyData.employeeImage) form.append('employeeImage', bodyData.employeeImage);

        fetch(`${UPDATEEMPLOYEE_CONTROLLER}/${id}`, {
            headers: {
                "Accept": "*/*",
            },
            method: "put",
            body: form
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

//account group
export const fetchAccountGroup = () => {
    return new Promise((resolve) => {
        fetch(ACCOUNTGROUP_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })

    });
}


export const fetchAccountGroupById = (id) => {
    return new Promise((resolve) => {
        fetch(ACCOUNTGROUP_CONTROLLER + `byid/${id}`).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const saveAccountGroup = ({ bodyData }) => {
    return new Promise((resolve) => {
        fetch(ADDACCOUNTGROUP_CONTROLLER, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

export const updateAccountGroup = ({ bodyData }, id) => {
    return new Promise((resolve) => {
        fetch(`${UPDATEACCOUNTGROUP_CONTROLLER}/${id}`, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "put",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

//account ledger
export const fetchAccountLedger = () => {
    return new Promise((resolve) => {
        fetch(ACCOUNTLEDGER_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const fetchAccountLedgerById = (id) => {
    return new Promise((resolve) => {
        fetch(ACCOUNTLEDGER_CONTROLLER + `byid/${id}`).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const saveAccountLedger = ({ bodyData }) => {
    return new Promise((resolve) => {
        fetch(ADDACCOUNTLEDGER_CONTROLLER, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

export const updateAccountLedger = ({ bodyData }, id) => {
    return new Promise((resolve) => {
        fetch(`${UPDATEACCOUNTLEDGER_CONTROLLER}/${id}`, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "put",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

///commommmmmm

export const fetchNature = () => {
    return new Promise((resolve) => {
        fetch(NATURE_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const fetchDefaultAccountGroup = () => {
    return new Promise((resolve) => {
        fetch(DEFAULTACCOUNTGROUP_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

//account journal and transaction


export const fetchAccountJournal = () => {
    return new Promise((resolve) => {
        fetch(ACCOUNTJOURNAL_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}

export const fetchAccountJournalByid = (id) => {
    return new Promise((resolve) => {
        fetch(`${GETACCOUNTJOURNAL_CONTROLLER}/${id}`).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser") })
    });
}


export const saveAccountJournal = ({ bodyData }) => {
    return new Promise((resolve) => {
        fetch(ADDACCOUNTJOURNAL_CONTROLLER, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

export const updateAccountJournal = ({ bodyData }) => {
    return new Promise((resolve) => {
        fetch(UPDATEACCOUNTJOURNAL_CONTROLLER, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "put",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    })
}

//report

export const getGeneralLedger = ({bodyData}) => {
    console.log("bodydAta is=>",bodyData);
    return new Promise((resolve) => {
        fetch(GENERALLEDGER_CONTROLLER, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(bodyData)
        })
            .then(response =>
                response.json()
            ).then(data => {
                resolve(data);
            }).catch(err => console.log('err is=>', err));
    });
}

//dashboard
export const getDashboard = () =>{
    return new Promise((resolve) => {
        fetch(DASHBOARD_CONTROLLER).then(response => response.json())
            .then(data => {
                if (data.success) resolve(data);
                else resolve(data);
            })
            .catch(error => { console.log("err in getuser",error) })
    });
}
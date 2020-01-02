 export const BASE_URL = "http://192.168.100.50:3333"


 
 export const LOGIN_CONTROLLER_ADMIN = BASE_URL + "/api/v1/auth/login"

 //user
 export const USER_CONTROLLER = BASE_URL + "/api/v1/user/getuser"
 export const ADDUSER_CONTROLLER = BASE_URL + "/api/v1/user/adduser"
 export const UPDATEUSER_CONTROLLER = BASE_URL + "/api/v1/user/updateuser"
 
 //employee
 export const EMPLOYEE_CONTROLLER = BASE_URL + "/api/v1/employee/getemployee"
 export const ADDEMPLOYEE_CONTROLLER = BASE_URL + "/api/v1/employee/addemployee"
 export const UPDATEEMPLOYEE_CONTROLLER = BASE_URL + "/api/v1/employee/updateemployee"

 //account group
 export const ACCOUNTGROUP_CONTROLLER = BASE_URL + "/api/v1/account/getaccountgroup"
 export const ADDACCOUNTGROUP_CONTROLLER = BASE_URL + "/api/v1/account/addaccountgroup"
 export const UPDATEACCOUNTGROUP_CONTROLLER = BASE_URL + "/api/v1/account/updateaccountgroup"

 //account ledger
 export const ACCOUNTLEDGER_CONTROLLER = BASE_URL + "/api/v1/account/getaccountledger"
 export const ADDACCOUNTLEDGER_CONTROLLER = BASE_URL + "/api/v1/account/addaccountledger"
 export const UPDATEACCOUNTLEDGER_CONTROLLER = BASE_URL + "/api/v1/account/updateaccountledger"

 //nature && default account
 export const NATURE_CONTROLLER = BASE_URL + "/api/v1/common/getnature"
 export const DEFAULTACCOUNTGROUP_CONTROLLER = BASE_URL + "/api/v1/common/getdefaultaccountgroup"


 //account transaction and journal
 export const ACCOUNTJOURNAL_CONTROLLER = BASE_URL+"/api/v1/account/getaccountjournal"
 export const ADDACCOUNTJOURNAL_CONTROLLER=BASE_URL+"/api/v1/account/addaccountjournal"
 export const UPDATEACCOUNTJOURNAL_CONTROLLER=BASE_URL+"/api/v1/account/updateaccountjournal"
 export const GETACCOUNTJOURNAL_CONTROLLER=BASE_URL+"/api/v1/account/getaccountjournalbyid"

 //report
 export const GENERALLEDGER_CONTROLLER = BASE_URL + "/api/v1/report/getgeneralledger";
 export const DASHBOARD_CONTROLLER = BASE_URL + "/api/v1/report/getdashboard"


//  export const REGISTER_CONTROLLER_EMPLOYEE = BASE_URL + "/api/user/v1/login"
//  export const REGISTER_CONTROLLER_ADMIN = BASE_URL + "/api/user/v1/login"
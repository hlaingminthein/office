import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import React,{useState} from 'react'
import {reactLocalStorage} from 'reactjs-localstorage';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';


const Sidebar = (props) => {

    const [expand, setExpand] = useState(false);

    const ChangeRoute = (name) =>{
        setExpand(false);
        if(name == "login") reactLocalStorage.clear();
        props.props.history.push(`/${name}`);
    }

    const data = reactLocalStorage.getObject('data');

    if(!data.token){
        props.props.history.push('/');
      }

    return (
        <div>
            <SideNav style={{height: '100vh'}}
                onSelect={(selected) => {
                    // Add your code here
                }} expanded={expand}
                
            >
                <SideNav.Toggle onClick={()=>setExpand(!expand)}/>
                <SideNav.Nav defaultSelected="home">
                    <NavItem eventKey="home" title="Dashboard" className="changecolor" style={{cursor: 'pointer'}} onClick={(e)=>ChangeRoute("dashboard")} >
                        <NavIcon>
                            <i className="fa fa-fw fa-home changecolor" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Dashboard
            </NavText>
                    </NavItem>
                    <NavItem eventKey="home" title="Transactions" className="changecolor" style={{cursor: 'pointer'}} onClick={(e)=>ChangeRoute("transaction")} >
                        <NavIcon>
                            <i className="fa fa-money" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Transactions
            </NavText>
                    </NavItem>
                    <NavItem eventKey="home" title="Report" className="changecolor" style={{cursor: 'pointer'}} onClick={(e)=>ChangeRoute("report")} >
                        <NavIcon>
                            <i className="fa fa-book" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Report
            </NavText>
                    </NavItem>
                    <NavItem eventKey="home" title="Setup" className="changecolor" style={{cursor: 'pointer'}} onClick={(e)=>ChangeRoute("setup")} >
                        <NavIcon>
                            <i className="fa fa-cogs" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Setup
            </NavText>
                    </NavItem>
                    <NavItem eventKey="home" title="Logout" className="changecolor" onClick={(e)=>ChangeRoute("login")} style={{cursor: 'pointer'}}>
                        <NavIcon>
                            <i className="fa fa-sign-out" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Logout
            </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        </div>
    )
}

export default Sidebar
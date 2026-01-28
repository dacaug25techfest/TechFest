import { Link } from "react-router-dom"

const Navbar=()=>{
    return <>
        <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/home">Home</Link></li>
          
        </ul>
    </>
}

export default Navbar
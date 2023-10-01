import searchSVG from './images/SVG/search.svg'
import reportListSVG from './images/SVG/folder.svg'
import exitSVG from './images/SVG/exit.svg'
import filterSVG from './images/SVG/filter.svg'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "./styles/NavBottom.css"
import { useState, useEffect } from "react"

const NavBottom = ({ setCep, setMarkerPoints, loggedIn, setLoggedIn, userEmail, userPassword, setEmail, setPassword, setShowSearchModal, setShowFilterModal }) => {
  const [isReportsClicked, setIsReportsClicked] = useState(false)
  const navigate = useNavigate()
  const logout = () => {
    setLoggedIn(false)
    localStorage.setItem('isLoggedIn', false)
    localStorage.setItem('email', "")
    localStorage.setItem('password', "")
    localStorage.setItem('cep', "")
    setEmail("")
    setPassword("")
    setCep("")
    setMarkerPoints([])
    navigate('/login/citizen')
  }
  useEffect(() => {
    if (isReportsClicked) {//When isReportsClicked is true...
      navigate('/')//Redirect it to the Map page
    }
  }, [isReportsClicked])
  const handleReportsClick = () => {
    setIsReportsClicked((currentValue) => !currentValue)//Toggle the isReportsClicked value
  }
  return (
    <>
      <nav className="bottomNavBar">
        <div className="searchBtn bottomNavBar_Div" onClick={() => { setShowSearchModal(true) }}>
          <img src={searchSVG} className="searchSVG iconSVG" alt="searchSVG" />
          <label>Pesquisar</label>
        </div>
        <div className="filterDiv bottomNavBar_Div" onClick={() => { setShowFilterModal(true) }}>
          <img src={filterSVG} className="searchSVG iconSVG" alt="searchSVG" />
          <label>Filtrar</label>
        </div>
        <Link to="/reports" className={`reportListDiv bottomNavBar_Div ${!isReportsClicked ? 'clicked' : ''}`} onClick={handleReportsClick}>
          <img src={reportListSVG} className="reportListSVG iconSVG" alt="reportListSVG"></img>
          <label>Reportes</label>
        </Link>
        <div className="exitDiv bottomNavBar_Div" onClick={logout}>
          <img src={exitSVG} className="exitSVG iconSVG" alt="reportListSVG"></img>
          <label>Sair</label>
        </div>
      </nav>
    </>
  )
}
export default NavBottom
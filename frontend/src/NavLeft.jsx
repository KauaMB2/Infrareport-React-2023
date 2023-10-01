import logoPNG from './images/logo.png'
import currentPositionSVG from './images/SVG/currentPosition.svg'
import searchSVG from './images/SVG/search.svg'
import reportListSVG from './images/SVG/folder.svg'
import exitSVG from './images/SVG/exit.svg'
import filterSVG from './images/SVG/filter.svg'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import "./styles/NavLeft.css"

const NavLeft = ({ cityData, setCityData, setShowErrorModal, setErrorCode, setErrorMessage, errorMessage, errorCode, setMarkerPoints, setCep, cep, loggedIn, setLoggedIn, userEmail, userPassword, setEmail, setPassword, setShowSearchModal, setShowFilterModal }) => {
  const navigate = useNavigate()
  const [isReportsClicked, setIsReportsClicked] = useState(false)
  useEffect(() => {
    const getCityAndUF = async () => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        if (!response.ok) {
          setCityData({
            cep: "X",
            logradouro: "X",
            complemento: "X",
            bairro: "X",
            localidade: "X",
            uf: "X",
            ibge: "X",
            gia: "X",
            ddd: "X",
            siafi: "X"
          })
        } else {
          const data = await response.json()
          setCityData(data)
        }
        // You can access specific properties like data.logradouro, data.bairro, data.localidade, data.uf, etc.
      } catch (error) {
        setCityData({
          cep: "X",
          logradouro: "X",
          complemento: "X",
          bairro: "X",
          localidade: "X",
          uf: "X",
          ibge: "X",
          gia: "X",
          ddd: "X",
          siafi: "X"
        })
      }
    }
    getCityAndUF()
  }, [])
  const logout = () => {
    setMarkerPoints([])
    setLoggedIn(false)
    localStorage.setItem('isLoggedIn', false)
    localStorage.setItem('email', "")
    localStorage.setItem('cep', "")
    localStorage.setItem('password', "")
    setEmail("")
    setPassword("")
    setCep("")
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
      <nav className="leftNavbar">
        <div className="logo_positionDiv">
          <Link to='/' className="logoDiv">
            <img src={logoPNG} className="logoPNG" alt="logoPNG" />
          </Link>
          <div className="animate__animated animate__slideInLeft currentPositionDiv leftNavbar_Div">
            <img src={currentPositionSVG} className="currentPositionSVG iconSVG" alt="currentPositionSVG"></img>
            {cityData && <h5>{cityData.localidade} - {cityData.uf}</h5>}
          </div>
        </div>
        <div className="animate__animated animate__slideInLeft search_relatoryDiv leftNavbar_Div">
          <button className="searchBtn leftNavbar_Btn" onClick={() => { setShowSearchModal(true) }}>
            <img src={searchSVG} className="searchSVG iconSVG" alt="searchSVG" />
            <label>Pesquisar ocorrências</label>
          </button>
          <button className="filterBtn leftNavbar_Btn" onClick={() => { setShowFilterModal(true) }}>
            <img src={filterSVG} className="searchSVG iconSVG" alt="searchSVG" />
            <label>Filtrar ocorrências</label>
          </button>
          <Link to="/reports" className="reportListBtn leftNavbar_Btn" onClick={handleReportsClick}>
            <img src={reportListSVG} className="reportListSVG iconSVG" alt="reportListSVG"></img>
            <label>Lista de reportes</label>
          </Link>
        </div>
        <div className="animate__animated animate__slideInLeft exitDiv leftNavbar_Div">
          <button className="exitBtn leftNavbar_Btn" onClick={logout}>
            <img src={exitSVG} className="exitSVG iconSVG" alt="exitSVG"></img>
            <label>Sair</label>
          </button>
        </div>
      </nav>
    </>
  )
}
export default NavLeft
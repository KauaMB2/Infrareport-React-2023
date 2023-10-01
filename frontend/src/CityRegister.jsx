import "./styles/CityRegister.css"
import "./styles/Login.css"
import 'animate.css'
import logoPNG from './images/logo.png'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

const CityLogin = ({ setCityData, cep, setCep, setErrorCode, setErrorMessage, errorCode, errorMessage, showErrorModal, setShowErrorModal, loggedIn, setMarkerPoints, markerPoints, setLoggedIn, userEmail, userPassword, setEmail, setPassword }) => {
  const brazilianUFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  const navigate = useNavigate()
  const [cityName, setCityName] = useState("")
  const [stateName, setStateName] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (stateName === "") {
      setErrorCode("Estado não selecionado")
      setErrorMessage("Por favor, selecione um estado.")
      setShowErrorModal(true)
      return
    }
    try {
      const formData = {
        city_name: cityName,
        state_name: stateName,
        email: userEmail,
        cep: cep,
        password: userPassword,
      }

      const response2 = await fetch("https://infrareportapi2--infrareportfeti.repl.co/postCity/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response2.json()
      if (!response2.ok) {
        setErrorCode(response2.status)
        setErrorMessage(data.Erro)
        setShowErrorModal(true)
        return
      }
      const cityResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const cityData = await cityResponse.json()
      setCityData(cityData)
      setLoggedIn(true)
      setCityName("")
      setStateName("")
      // Store email and password in localStorage
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('citizenAccount', false)
      localStorage.setItem('email', formData.email)
      localStorage.setItem('password', formData.password)
      localStorage.setItem('cep', formData.cep)
      navigate('/')
    } catch (error) {
      setErrorCode("Erro desconhecido(0X008)")
      setErrorMessage(error)
      setShowErrorModal(true)
      return
    }
  }
  return (
    <main className="animate__animated background animate__pulse">
      <div className="animate__animated loginDiv_alignment animate__pulse ">
        <div className="loginDiv">
          <div className="loginDiv_welcome">
            <h4 id="welcomeText" className="loginDiv_welcome_row">Seja Bem Vindo ao Infrareport!</h4>
            <Link id="logoImg" className="loginDiv_welcome_image" to='/cityRegister'>
              <img src={logoPNG} className="logo" alt="logo" />
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="state_name_input_div">
              <div>
                <label htmlFor="cityName">Nome da Cidade:</label>
                <input
                  type="text"
                  className="form-control"
                  id="cityName"
                  name="city_name"
                  placeholder="Digite o nome da cidade"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
              <div className="email_cep_div">
                <div className="cep-input">
                  <label htmlFor="cep">CEP:</label>
                  <input
                    type="cep"
                    className="form-control"
                    id="cep"
                    name="cep"
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => { setCep(e.target.value) }}
                  />
                </div>
                <div className="dropdown dropdownState">
                  <label htmlFor="stateName">UF<label id="selectedUF" htmlFor="selectedState">({stateName})</label>:</label>
                  <button
                    className="btn btn-primary+  dropdown-toggle ufBtn"
                    type="button"
                    id="stateDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Estado
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="stateDropdown">
                    {brazilianUFs.map((uf, index) => (
                      <li key={index}>
                        <div className="dropdown-item" onClick={() => { setStateName(uf) }}>
                          {uf}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Endereço de Email:</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Digite o email"
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small id="emailHelp" className="form-text text-muted">
                Nunca compartilharemos seu email com terceiros.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Senha:</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                placeholder="Senha"
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="buttonsDiv">
              <button type="submit" className="btn-submit btn btn-primary">
                Registrar
              </button>
              <div className="right-buttons">
                <Link to="/login/city" className="loginBtn">
                  <button type="submit" className="btn-submit btn btn-outline-secondary">
                    Login
                  </button>
                </Link>
                <Link to="/citizenRegister" className="citizenBtn">
                  <button type="submit" className="btn-submit btn btn-outline-secondary">
                    Sou cidadão
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default CityLogin
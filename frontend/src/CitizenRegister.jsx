import "./styles/Login.css"
import "./styles/CitizenRegister.css"
import 'animate.css'
import logoPNG from './images/logo.png'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

const CitizenLogin = ({ setCityData, setCep, cep, setErrorCode, setErrorMessage, errorCode, errorMessage, showErrorModal, setShowErrorModal, loggedIn, setMarkerPoints, markerPoints, setLoggedIn, userEmail, userPassword, setEmail, setPassword }) => {
  const brazilianUFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  const [cityName, setCityName] = useState("")
  const [stateName, setStateName] = useState("")
  const [street, setStreet] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [citizenName, setCitizenName] = useState("")
  const [residentialNumber, setResidentialNumber] = useState(0)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        citizen_name: citizenName,
        email: userEmail,
        password: userPassword,
        state_name: stateName,
        city_name: cityName,
        cep: cep,
        street: street,
        neighborhood: neighborhood,
        residential_number: residentialNumber
      }
      // Send a POST request to the server
      const response2 = await fetch('https://infrareportapi2--infrareportfeti.repl.co/postCitizen/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
      // Reset form fields
      setLoggedIn(true)
      setCityName("")
      setStateName("")
      setCitizenName("")
      setNeighborhood("")
      setStreet("")
      setResidentialNumber(0)
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('citizenAccount', true)
      localStorage.setItem('email', formData.email)
      localStorage.setItem('password', formData.password)
      localStorage.setItem('cep', formData.cep)
      navigate("/")
    } catch (error) {
      setErrorCode("Erro desconhecido(0X005)")
      setErrorMessage(error.toString())
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
            <Link id="logoImg" className="loginDiv_welcome_image" to='/citizenRegister'>
              <img src={logoPNG} className="logo" alt="logo" />
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="name_email_input_div">
              <div>
                <label htmlFor="citizenName">Seu nome:</label>
                <input
                  type="text"
                  className="form-control"
                  id="citizen_name"
                  name="citizen_name"
                  placeholder="Digite o seu nome"
                  value={citizenName}
                  onChange={(e) => { setCitizenName(e.target.value) }}
                />
              </div>
              <div>
                <label htmlFor="email">Endereço de Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  aria-describedby="emailHelp"
                  placeholder="Digite o email"
                  value={userEmail}
                  onChange={(e) => { setEmail(e.target.value) }}
                />
              </div>
            </div>
            <div className="password_state_input_div">
              <div className="form-group">
                <label htmlFor="password">Senha:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Senha"
                  value={userPassword}
                  onChange={(e) => { setPassword(e.target.value) }}
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

            <div className="city_informations_input_div">
              <div className="city_street_div">
                <div>
                  <label htmlFor="cityName">Nome da Cidade:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city_name"
                    name="city_name"
                    placeholder="Digite o nome da cidade"
                    value={cityName}
                    onChange={(e) => { setCityName(e.target.value) }}
                  />
                </div>
                <div>
                  <label htmlFor="street">Rua:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    placeholder="Digite a rua"
                    value={street}
                    onChange={(e) => { setStreet(e.target.value) }}
                  />
                </div>
              </div>
              <div className="neighborhood_number_div">
                <div>
                  <label htmlFor="neighborhood">Bairro:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="neighborhood"
                    name="neighborhood"
                    placeholder="Digite o bairro"
                    value={neighborhood}
                    onChange={(e) => { setNeighborhood(e.target.value) }}
                  />
                </div>

                <div>
                  <label htmlFor="residentialNumber">Nº:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="residentialNumber"
                    name="residentialNumber"
                    placeholder="Nº"
                    step="1"
                    value={residentialNumber}
                    onChange={(e) => { setResidentialNumber(e.target.value) }}
                  />
                </div>
              </div>
            </div>

            <small id="emailHelp" className="form-text text-muted">
              Nunca compartilharemos seu email com terceiros.
            </small>
            <div className="buttonsDiv">
              <button type="submit" className="btn-submit btn btn-primary">
                Registrar
              </button>
              <div className="right-buttons">
                <Link to="/login/citizen" className="loginBtn">
                  <button type="submit" className="btn-submit btn btn-outline-secondary">
                    Login
                  </button>
                </Link>
                <Link to="/cityRegister" className="cityBtn">
                  <button type="submit" className="btn-submit btn btn-outline-secondary">
                    Sou cidade
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

export default CitizenLogin
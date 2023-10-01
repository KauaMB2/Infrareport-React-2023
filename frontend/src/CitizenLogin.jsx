import "./styles/CityRegister.css"
import "./styles/Login.css"
import 'animate.css'
import logoPNG from './images/logo.png'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useNavigate } from 'react-router-dom'
const Login = ({ setErrorCode, setErrorMessage, errorCode, errorMessage, showErrorModal, setShowErrorModal, setCep, cep, setMarkerPoints, markerPoints, loggedIn, setLoggedIn, userEmail, userPassword, setEmail, setPassword }) => {
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        email: userEmail,
        password: userPassword,
      }
      const response = await fetch("https://infrareportapi2--infrareportfeti.repl.co/login/citizen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) {
        setErrorCode(response.status)
        setErrorMessage(data.Erro)
        setShowErrorModal(true)
        return;
      }
      setCep(data.cep)
      try {
        var link = `https://infrareportapi2--infrareportfeti.repl.co/getAllOccurrences/${data.cep}/${1}/${userEmail}/${userPassword}`
        const response2 = await fetch(link, {
          method: "GET",
        });
        const occurrencesData = await response2.json()
        if (!response2.ok) {
          setErrorCode(response2.status)
          setErrorMessage(occurrencesData.Erro)
          setShowErrorModal(true)
          return
        }
        const pointsData = occurrencesData.map((currentData) => ({
          position: {
            lat: currentData.latitude,
            lng: currentData.longitude,
          },
          id: currentData.id,
          concluded: currentData.concluded,
          occurrence_type: currentData.occurrence_type,
        }))
        setMarkerPoints(pointsData)
      } catch (error) {
        setErrorCode("Erro desconhecido")
        setErrorMessage(error.toString())
        setShowErrorModal(true)
        return
      }
      // Rest of your code...
      
      setLoggedIn(true)
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('citizenAccount', true)
      localStorage.setItem('email', formData.email)
      localStorage.setItem('password', formData.password)
      localStorage.setItem('cep', data.cep)
      navigate('/')
    } catch (error) {
      setErrorCode("Erro desconhecido")
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
            <Link id="logoImg" className="loginDiv_welcome_row" to='/citizenRegister'>
              <img src={logoPNG} className="logo" alt="logo" />
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="email_password_input_div">
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
            </div>
            <div className="buttonsDiv">
              <button type="submit" className="btn-submit btn btn-primary">
                Login
              </button>
              <div className="right-buttons">
                <Link to="/citizenRegister" className="loginBtn">
                  <button type="button" className="btn-submit btn btn-outline-secondary">
                    Registrar
                  </button>
                </Link>
                <Link to="/login/city" className="cityBtn">
                  <button type="button" className="btn-submit btn btn-outline-secondary">
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

export default Login
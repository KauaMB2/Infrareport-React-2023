import "./styles/App.css"
import 'animate.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import NavLeft from './NavLeft'
import NavBottom from './NavBottom'
import Map from './Map'
import NotFound from './NotFound'
import Reports from './Reports'
import CitizenRegister from './CitizenRegister'
import CityRegister from './CityRegister'
import CityLogin from './CityLogin'
import CitizenLogin from './CitizenLogin'
import FilterModal from './FilterModal'
import SearchModal from './SearchModal'
import PostOccurrenceModal from './PostOccurrenceModal'
import ReportInfoModal from "./ReportInfoModal"

const App=()=>{
  var citizenAccount = localStorage.getItem("citizenAccount")
  if(citizenAccount==="true"){
    citizenAccount=true
  }
  if(citizenAccount==="false"){
    citizenAccount=false
  }
  const cep = localStorage.getItem("cep")
  const [userEmail, setEmail] = useState(localStorage.getItem("email"))
  const [userPassword, setPassword] = useState(localStorage.getItem("password"))
  const [map, setMap] = useState(null)
  const [markerPoints, setMarkerPoints] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [imageUrls, setImageUrls] = useState({})
  const [imageFile, setImageFile] = useState(null) // State to hold the image file  
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showReportInfoModal, setShowReportInfoModal] = useState(false)
  const [showPostOccurrenceModal, setShowPostOccurrenceModal] = useState(false)
  const [currentPoint,setCurrentPoint]=useState({position: { lat: 0, lng: 0 },id:-1,concluded:"Em aberto",occurrence_type:"Postes Danificados"})
  const [currentReport,setCurrentReport]=useState({})
  const [reportsLabels, setReportsLabels] = useState([])
  const [reportsCount, setReportsCount] = useState([])
  const [typeLabels, setTypeLabels] = useState([])
  const [typeCount, setTypeCount] = useState([])
  const [selectedOption, setSelectedOption] = useState("Postes Danificados")
  const [showMarkersON, setShowMarkersON]=useState(false)
  const [showSolvedOn, setShowSolvedOn]=useState(false)
  const [editedData, setEditedData] = useState({})
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchedData, setSearchedData] = useState(null)
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true' || false)
  const infraestructureProblems = [
    "Postes Danificados",
    "Buracos nas Ruas",
    "Calçadas Quebradas",
    "Esgotos e Calhas Transbordando ou Bloqueados",
    "Placas de Trânsito Quebradas ou Ausentes",
    "Edifícios Abandonados ou Deteriorados",
    "Problemas na Manutenção de Parques Públicos",
    "Pichações e Atos de Vandalismo",
    "Descarte Ilegal de Lixo",
    "Semáforos com Mau Funcionamento",
    "Sinalização Insuficiente nas Ruas",
    "Banheiros Públicos Mal Conservados",
    "Pontes ou Viadutos Danificados",
    "Corpos d'água Poluídos",
    "Bancos ou Abrigos Públicos Danificados",
    "Vegetação Excessiva Bloqueando Estradas",
    "Apagões"
  ]
  useEffect( ()=>{//If searchedData variable change...
    const fetchImages=async()=>{
      const urls={}
      for (const data of searchedData) {
        const imageUrl=await treatImage(data.id)
        urls[data.id]=imageUrl
      }
      setImageUrls(urls)
    }
    if(searchedData instanceof Array){//If the searchedData is a array...
      fetchImages()
    }
  },[searchedData])
  const treatImage=async (id)=>{
    const imageRespose=await fetch(`http://127.0.0.1:8000/returnImage/${id}`,{method:"GET"})
    const blob = await imageRespose.blob()
    const imageUrl = URL.createObjectURL(blob)
    return imageUrl
  }
  const tryLogin=async()=>{
    var data={
      email:userEmail,
      password:userPassword
    }
    var response
    if(citizenAccount===true){
      response = await fetch("http://127.0.0.1:8000/login/citizen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    }
    if(citizenAccount===false){
      response = await fetch("http://127.0.0.1:8000/login/city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    }
    if(response!==undefined){
      if (!response.ok) {
        localStorage.setItem('isLoggedIn', false)
        localStorage.setItem('citizenAccount', undefined)
        localStorage.setItem('email', "")
        localStorage.setItem('password', "")
        localStorage.setItem('cep', "")
      }
    }
  }
  const getSpecificReports = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/getMostRepeatedReports/${cep}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (response.ok) {
        const responseData = await response.json()
        const neighborhoodList=responseData['neighborhood']
        const typeList=responseData['type']
        const newReportsLabels = []
        const newReportsCount = []
        const newTypeLabels = []
        const newTypeCount = []
  
        if (neighborhoodList.length>0) { // Check if 'neighborhood' exists in responseData
          for (var i = 0; i < neighborhoodList.length; i++) {
            newReportsLabels.push(responseData['neighborhood'][i]['neighborhood']);
            newReportsCount.push(responseData['neighborhood'][i]['count']);
          }
        }
  
        if (typeList.length>0) { // Check if 'type' exists in responseData
          for (var i = 0; i < typeList.length; i++) {
            newTypeLabels.push(responseData['type'][i]['type']);
            newTypeCount.push(responseData['type'][i]['count']);
          }
        }
  
        setReportsLabels(newReportsLabels)
        setReportsCount(newReportsCount)
        setTypeLabels(newTypeLabels)
        setTypeCount(newTypeCount)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleMapClick = (event) => {
    if (citizenAccount){
      const lat = event.latLng.lat()//Gets the latitude coordenates
      const lng = event.latLng.lng()//Gets the longitude coordenates
      const currentCordenate={position: { lat: lat, lng: lng }}
      // Create a new marker
      setCurrentPoint(currentCordenate)
      setShowPostOccurrenceModal(!showPostOccurrenceModal)
    }
  }
  const getAllOccurrences=async()=>{
    try{
      var link
      if(citizenAccount){
        link=`http://127.0.0.1:8000/getAllOccurrences/${cep}/${1}/${userEmail}/${userPassword}`
      }else{
        link=`http://127.0.0.1:8000/getAllOccurrences/${cep}/${0}/${userEmail}/${userPassword}`
      }
      const response = await fetch(link,  {
        method: "GET"
      })
      const data = await response.json()
      const pointsData = data.map((currentData) => (
        {
          position:{
            lat: currentData.latitude,
            lng: currentData.longitude
          },
          id:currentData.id,
          concluded:currentData.concluded,
          occurrence_type: currentData.occurrence_type
        }
      ))
    setMarkerPoints(pointsData)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    tryLogin()
    getAllOccurrences()
    getSpecificReports()
  },[])
  return (
    <>
      <Router>
        <FilterModal userEmail={userEmail} citizenAccount={citizenAccount} cep={cep} setMarkerPoints={setMarkerPoints} selectedOption={selectedOption} setSelectedOption={setSelectedOption} infraestructureProblems={infraestructureProblems} showFilterModal={showFilterModal} setShowFilterModal={setShowFilterModal}></FilterModal>
        <SearchModal imageUrls={imageUrls} setImageUrls={setImageUrls} treatImage={treatImage} setSearchedData={setSearchedData} searchedData={searchedData} citizenAccount={citizenAccount} endDate={endDate} setEndDate={setEndDate} startDate={startDate} setStartDate={setStartDate} userEmail={userEmail} cep={cep} setMarkerPoints={setMarkerPoints} selectedOption={selectedOption} setSelectedOption={setSelectedOption} infraestructureProblems={infraestructureProblems} showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal}></SearchModal>
        <PostOccurrenceModal setCurrentPoint={setCurrentPoint} imageFile={imageFile} setImageFile={setImageFile} infraestructureProblems={infraestructureProblems} currentPoint={currentPoint} showPostOccurrenceModal={showPostOccurrenceModal} setShowPostOccurrenceModal={setShowPostOccurrenceModal } markerPoints={markerPoints} setMarkerPoints={setMarkerPoints}></PostOccurrenceModal>
        <ReportInfoModal markerPoints={markerPoints} setMarkerPoints={setMarkerPoints} setCurrentPoint={setCurrentPoint} currentPoint={currentPoint} userPassword={userPassword} userEmail={userEmail} infraestructureProblems={infraestructureProblems} editedData={editedData} setEditedData={setEditedData} imageFile={imageFile} setImageFile={setImageFile} citizenAccount={citizenAccount} currentImage={currentImage} setCurrentImage={setCurrentImage} currentReport={currentReport} setCurrentReport={setCurrentReport} showReportInfoModal={showReportInfoModal} setShowReportInfoModal={setShowReportInfoModal}></ReportInfoModal>
        <main className={loggedIn ? "loggedInStyles":""}>
          {loggedIn && <NavLeft cep={cep} loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} userPassword={userPassword} setEmail={setEmail} setPassword={setPassword} setShowSearchModal={setShowSearchModal} setShowFilterModal={setShowFilterModal} />}
          <Routes>
            {loggedIn ? (
              <>
                <Route path="/" element={<Map userEmail={userEmail} userPassword={userPassword} treatImage={treatImage} setCurrentPoint={setCurrentPoint} showSolvedOn={showSolvedOn} setShowSolvedOn={setShowSolvedOn} currentImage={currentImage} setCurrentImage={setCurrentImage} currentReport={currentReport} setCurrentReport={setCurrentReport} showReportInfoModal={showReportInfoModal} setShowReportInfoModal={setShowReportInfoModal} showMarkersON={showMarkersON} setShowMarkersON={setShowMarkersON} citizenAccount={citizenAccount} markerPoints={markerPoints} handleMapClick={handleMapClick} map={map} setMap={setMap} />} />
                <Route path="/cityRegister" element={<Navigate to="/" replace />} />
                <Route path="/citizenRegister" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/reports" element={<Reports reportsLabels={reportsLabels} reportsCount={reportsCount} typeLabels={typeLabels} typeCount={typeCount} />} />
                <Route path="/login/city" element={<Navigate to="/" replace />} />
                <Route path="/login/citizen" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/citizenRegister" replace />} />
                <Route path="/cityRegister" element={<CityRegister loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} userPassword={userPassword} setEmail={setEmail} setPassword={setPassword} />} />
                <Route path="/citizenRegister" element={<CitizenRegister loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} userPassword={userPassword} setEmail={setEmail} setPassword={setPassword} />} />
                <Route path="/reports" element={<Navigate to="/citizenRegister" />} />
                <Route path="/login/city" element={<CityLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} userPassword={userPassword} setEmail={setEmail} setPassword={setPassword} />} />
                <Route path="/login/citizen" element={<CitizenLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} userPassword={userPassword} setEmail={setEmail} setPassword={setPassword} />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {loggedIn && <NavBottom loggedIn={loggedIn} setLoggedIn={setLoggedIn} userEmail={userEmail} userPassword={userPassword} setEmail={setEmail} setPassword={setPassword} setShowSearchModal={setShowSearchModal} setShowFilterModal={setShowFilterModal} />}
        </main>
      </Router>
    </>
  )
}
export default App

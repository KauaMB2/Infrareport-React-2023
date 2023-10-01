import { GoogleMap, useLoadScript, Marker, HeatmapLayer } from "@react-google-maps/api"
import BathroomIcon from "./images/reportIcons/Bathroom.png"
import BridgeIcon from "./images/reportIcons/Bridge.png"
import BuildIcon from "./images/reportIcons/Build.png"
import ForestIcon from "./images/reportIcons/Forest.png"
import GrafittiIcon from "./images/reportIcons/Grafitti.png"
import HoleIcon from "./images/reportIcons/Hole.png"
import ParkIcon from "./images/reportIcons/Park.png"
import WaterIcon from "./images/reportIcons/Water.png"
import PersonSignIcon from "./images/reportIcons/PersonSign.png"
import SewageIcon from "./images/reportIcons/Sewage.png"
import StreetIcon from "./images/reportIcons/Street.png"
import StreetLampOffIcon from "./images/reportIcons/StreetLampOff.png"
import StreetLampOnIcon from "./images/reportIcons/StreetLampOn.png"
import TrafficLightIcon from "./images/reportIcons/TrafficLight.png"
import TrashIcon from "./images/reportIcons/Trash.png"
import VandalismIcon from "./images/reportIcons/Vandalism.png"
import ConcludedIcon from "./images/reportIcons/Concluded.png"
import WithoutLightIcon from "./images/reportIcons/WithoutLight.png"
import "./styles/Maps.css"
import { GOOGLE_MAPS_API_KEY } from './GOOGLE_KEY'

const libraries = ["visualization"]

const Map = ({ setErrorCode, setErrorMessage, errorCode, errorMessage, showErrorModal, setShowErrorModal, userEmail, userPassword, treatImage, setCurrentPoint, showSolvedOn, setShowSolvedOn, currentImage, setCurrentImage, currentReport, setCurrentReport, showReportInfoModal, setShowReportInfoModal, showMarkersON, setShowMarkersON, citizenAccount, markerPoints, handleMapClick, map, setMap }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })
  const hashTableImage = {
    "Postes Danificados": StreetLampOnIcon,
    "Buracos nas Ruas": HoleIcon,
    "Calçadas Quebradas": StreetIcon,
    "Esgotos e Calhas Transbordando ou Bloqueados": SewageIcon,
    "Placas de Trânsito Quebradas ou Ausentes": PersonSignIcon,
    "Edifícios Abandonados ou Deteriorados": BuildIcon,
    "Problemas na Manutenção de Parques Públicos": ParkIcon,
    "Pichações e Atos de Vandalismo": GrafittiIcon,
    "Descarte Ilegal de Lixo": TrashIcon,
    "Semáforos com Mau Funcionamento": TrafficLightIcon,
    "Sinalização Insuficiente nas Ruas": StreetLampOffIcon,
    "Banheiros Públicos Mal Conservados": BathroomIcon,
    "Pontes ou Viadutos Danificados": BridgeIcon,
    "Corpos d'água Poluídos": WaterIcon,
    "Bancos ou Abrigos Públicos Danificados": VandalismIcon,
    "Vegetação Excessiva Bloqueando Estradas": ForestIcon,
    "Apagões": WithoutLightIcon
  }
  const center = {
    lat: -22.2469,
    lng: -45.7031
  }
  const handleMapLoad = (map) => {
    setMap(map)
  }
  const handlePointClick = async (point) => {
    var response = null
    if (citizenAccount) {
      response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/occurrence/${point.id}/${1}/${userEmail}/${userPassword}`, { method: "GET" })
    }
    else if (!citizenAccount) {
      response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/occurrence/${point.id}/${0}/${userEmail}/${userPassword}`, { method: "GET" })
    }
    const reportData = await response.json()
    if (!response.ok) {
      setErrorCode(response.status)
      setErrorMessage(reportData.Erro)
      setShowErrorModal(true)
      return
    }
    const imageUrl = await treatImage(reportData.id)
    setCurrentReport(reportData)
    setCurrentPoint({
      position: { lat: reportData.latitude, lng: reportData.longitude },
      id: reportData.id,
      concluded: reportData.concluded,
      occurrence_type: reportData.occurrence_type
    })
    setCurrentImage(imageUrl)
    setShowReportInfoModal(!showReportInfoModal)
  }
  const handleSwitchSolved = async () => {
    setShowSolvedOn(!showSolvedOn)
    if (!citizenAccount) {
      setShowMarkersON(true)
    }
  }
  const containerStyle = {
    width: "100%",
    height: "100%",
  }
  const handleSwitchMarkers = () => {
    setShowMarkersON(!showMarkersON)
    if (!citizenAccount) {
      setShowSolvedOn(false)
    }
  }

  if (loadError) {
    return <div>Error loading Google Maps.</div>;
  }

  return (
    <>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <div className="mapWidthHeight">
          <GoogleMap
            mapContainerStyle={containerStyle}
            className="mapContainer"
            center={center}
            zoom={13.5}
            onClick={handleMapClick}
            onLoad={handleMapLoad}
          >
            {!citizenAccount && (
              <>
                <div className="form-check form-switch" style={{ position: "absolute", top: 10, left: 190, zIndex: 1 }}>
                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={showMarkersON} onChange={handleSwitchMarkers} />
                  <label className="form-check-label text-primary" htmlFor="flexSwitchCheckDefault">Exibir reportes</label>
                </div>
                <div className="form-check form-switch" style={{ position: "absolute", top: 30, left: 190, zIndex: 1 }}>
                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={showSolvedOn} onChange={handleSwitchSolved} />
                  <label className="form-check-label text-primary" htmlFor="flexSwitchCheckDefault">Exibir reportes resolvidos</label>
                </div>
              </>
            )}
            {citizenAccount && (
              <div className="form-check form-switch" style={{ position: "absolute", top: 10, left: 190, zIndex: 1 }}>
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={showSolvedOn} onChange={handleSwitchSolved} />
                <label className="form-check-label text-primary" htmlFor="flexSwitchCheckDefault">Exibir reportes resolvidos</label>
              </div>
            )}
            {map && (
              <>
                {citizenAccount ? (
                  markerPoints.map((markerPoint, index) => (
                    markerPoint.concluded === "Concluído" ? (
                      showSolvedOn ? (
                        <Marker
                          id={markerPoint.id}
                          key={markerPoint.id}
                          position={markerPoint.position}
                          map={map}
                          icon={{
                            url: ConcludedIcon,
                            scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the marker icon
                          }}
                          onClick={() => handlePointClick(markerPoint)}
                        />
                      ) : (<></>)
                    ) : (
                      <Marker
                        id={markerPoint.id}
                        key={markerPoint.id}
                        position={markerPoint.position}
                        map={map}
                        icon={{
                          url: hashTableImage[markerPoint.occurrence_type],
                          scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the marker icon
                        }}
                        onClick={() => handlePointClick(markerPoint)}
                      />
                    )))
                ) : showMarkersON ? (
                  markerPoints.map((markerPoint, index) => (
                    markerPoint.concluded === "Concluído" ? (
                      showSolvedOn ? (
                        <Marker
                          id={markerPoint.id}
                          key={markerPoint.id}
                          position={markerPoint.position}
                          map={map}
                          icon={{
                            url: ConcludedIcon,
                            scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the marker icon
                          }}
                          onClick={() => handlePointClick(markerPoint)}
                        />
                      ) : (<></>)
                    ) : (
                      <Marker
                        id={markerPoint.id}
                        key={markerPoint.id}
                        position={markerPoint.position}
                        map={map}
                        icon={{
                          url: hashTableImage[markerPoint.occurrence_type],
                          scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the marker icon
                        }}
                        onClick={() => handlePointClick(markerPoint)}
                      />
                    )
                  ))
                ) : (
                  <></>
                )}
                {!citizenAccount ? (<HeatmapLayer
                  data={markerPoints
                    .filter((markerPoint) => markerPoint.concluded === "Em aberto")
                    .map((markerPoint) => ({
                      location: new window.google.maps.LatLng(markerPoint.position.lat, markerPoint.position.lng),
                      weight: 1
                    }))
                  }
                  options={{
                    radius: 10,
                    opacity: 0.5,
                    dissipating: true,
                  }}
                  map={map}
                  onClick={(event) => {
                    handlePointClick({
                      position: {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                      }
                    })
                  }}
                />) : (<></>)}
              </>
            )}
          </GoogleMap>
        </div>
      )}
    </>
  );
};

export default Map;

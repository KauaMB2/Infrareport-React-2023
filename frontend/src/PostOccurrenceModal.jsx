import { Button, Modal } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import React, { useState, useEffect } from "react"
import { GOOGLE_MAPS_API_KEY } from './GOOGLE_KEY'

const PostOccurrenceModal = ({ cep, setErrorCode, setErrorMessage, errorCode, errorMessage, showErrorModal, setShowErrorModal, setCurrentPoint, imageFile, setImageFile, infraestructureProblems, currentPoint, showPostOccurrenceModal, markerPoints, setShowPostOccurrenceModal, setMarkerPoints }) => {
  const accountEmail = localStorage.getItem('email')
  const [userComment, setUserComment] = useState("")
  const [occurrenceType, setOccurrenceType] = useState("Postes Danificados")
  const postOccurrence = async () => {
    if (userComment === "") {
      setErrorCode("Comentário vazio")
      setErrorMessage("Por favor, insira um comentário.")
      setShowErrorModal(true)
      return
    }
    // Initialize variables to store the neighborhood and street
    var neighborhoodGeocoding = ""
    var streetGeocoding = ""
    try {
      const geocodingResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentPoint.position.lat},${currentPoint.position.lng}&key=${GOOGLE_MAPS_API_KEY}`
      )
      const geocodeData = await geocodingResponse.json()
      var foundAllAddressInfo = 0
      // Iterate through the address_components
      for (const component of geocodeData.results[0].address_components) {
        // Check if the component has the "neighborhood" type
        if (component.types.includes('neighborhood')) {
          neighborhoodGeocoding = component.long_name
          foundAllAddressInfo++
        }
        // Check if the component has the "route" type
        if (component.types.includes('route')) {
          streetGeocoding = component.long_name
          foundAllAddressInfo++
        }
        if (foundAllAddressInfo == 2) {
          break
        }
      }
    } catch (error) {

    }
    const formData = new FormData()
    formData.append("citizen_email", accountEmail)
    formData.append("occurrence_type", occurrenceType)
    formData.append("cep", cep)
    formData.append("neighborhood", neighborhoodGeocoding)
    formData.append("street", streetGeocoding)
    formData.append("user_comment", userComment)
    formData.append("latitude", currentPoint.position.lat)
    formData.append("longitude", currentPoint.position.lng)
    formData.append("image", imageFile)
    const response = await fetch("https://infrareportapi2--infrareportfeti.repl.co/occurrence/", {
      method: "POST",
      body: formData,
    })
    const data = await response.json()
    if (!response.ok) {
      setErrorCode(response.status)
      setErrorMessage(data.Erro)
      setShowErrorModal(true)
      return
    }
    currentPoint.id = data.id
    currentPoint.occurrence_type = data.occurrence_type
    currentPoint.concluded = data.concluded
    if (!response.ok) {
      setErrorCode(response.status)
      setErrorMessage(data.Erro)
      setShowErrorModal(true)
      return
    } else {
      //Add the new marker to the markers state
      const newMarkers = [...markerPoints, currentPoint]
      setMarkerPoints(newMarkers)
    }
    console.log(imageFile)
    setCurrentPoint({
      position: currentPoint.position,
      id: data.id,
      occurrence_type: occurrenceType
    })
    setShowPostOccurrenceModal(!showPostOccurrenceModal)
    setUserComment("")
    setImageFile(null)
  }

  return (
    <>
      <Modal show={showPostOccurrenceModal} onHide={() => setShowPostOccurrenceModal(!showPostOccurrenceModal)}>
        <Modal.Header className='bg-primary' closeButton>
          <Modal.Title className='text-center text-white bg-primary'>Publique uma ocorrência</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Ocorrência:</label>
          <Form.Select name="team" variant="primary" id="dropdown-basic" className='mb-4'
            value={occurrenceType} onChange={(e) => setOccurrenceType(e.target.value)}>
            {infraestructureProblems.map((problem, key) => {
              return <option key={key}>{problem}</option>
            })}
          </Form.Select>
          <label>Comentário:</label>
          <Form.Control as="textarea" rows={5} value={userComment} onChange={(e) => setUserComment(e.target.value)} required />
          <div className="form-group">
            <label htmlFor="exampleFormControlFile1">Imagem:</label><br />
            <input type="file" className="form-control-file" id="exampleFormControlFile1" label="Escolha a imagem" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} required />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPostOccurrenceModal(!showPostOccurrenceModal)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => postOccurrence()}>
            Inserir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostOccurrenceModal;

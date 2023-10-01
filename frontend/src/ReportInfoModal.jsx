import React from "react"
import { Button, Modal } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import "./styles/ReportInfoModal.css"

const ReportInfoModal = ({ setShowErrorModal, setErrorCode, setErrorMessage, errorCode, errorMessage, markerPoints, setMarkerPoints, setCurrentPoint, currentPoint, userPassword, userEmail, infraestructureProblems, editedData, setEditedData, imageFile, setImageFile, citizenAccount, currentImage, setCurrentImage, currentReport, setCurrentReport, showReportInfoModal, setShowReportInfoModal }) => {
  const handleReopenClick = async () => {
    const formData = new FormData()
    formData.append("email", userEmail)
    formData.append("password", userPassword)
    const response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/concludeReport/1/${currentReport.id}`, {
      method: "PUT",
      body: formData,
    })
    const data = await response.json()
    if (!response.ok) {
      setErrorCode(response.status)
      setErrorMessage(data.Erro)
      setShowErrorModal(true)
      return
    } else {
      markerPoints.map((marker) => {
        if (marker.id === data.id) {
          marker.concluded = "Em aberto"
          setCurrentPoint({
            position: currentPoint.position,
            concluded: "Em aberto"
          })
        }
      })
    }
    setShowReportInfoModal(!showReportInfoModal)
  }
  const handleFixedClick = async () => {
    const formData = new FormData()
    formData.append("cityComment", editedData.user_comment)
    formData.append("email", userEmail)
    formData.append("password", userPassword)
    const response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/concludeReport/0/${currentReport.id}`, {
      method: "PUT",
      body: formData,
    })
    const data = await response.json()
    if (response.ok) {
      markerPoints.map((marker) => {
        if (marker.id === data.id) {
          marker.concluded = "Concluído"
          setCurrentPoint({
            position: currentPoint.position,
            concluded: "Concluído"
          })
        }
      })
    } else {
      setErrorCode(response.status)
      setErrorMessage(data.Erro)
      setShowErrorModal(true)
    }
    currentReport.user_comment = ""
    setShowReportInfoModal(!showReportInfoModal)
  }
  const handleDeleteClick = async () => {
    const response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/occurrence/${currentReport.id}/${1}/${userEmail}/${userPassword}`, {
      method: "DELETE"
    })
    const data = await response.json()
    // Assuming the server response provides the correct marker id to delete as data.id
    if (response.ok) {
      // Remove the marker with the id equal to data.id
      const updatedMarkers = markerPoints.filter((marker) => (marker.id !== data.data.id))
      setMarkerPoints(updatedMarkers)
    } else {
      // Handle the error case if the DELETE request was not successful
      console.log("Error deleting marker:", response.status)
    }
    setShowReportInfoModal(!showReportInfoModal)
  }
  const handleSaveClick = async () => {
    const formData = new FormData()
    formData.append("occurrence_type", currentReport.occurrence_type)
    formData.append("neighborhood", currentReport.neighborhood)
    formData.append("street", currentReport.street)
    formData.append("user_comment", currentReport.user_comment)
    formData.append("image", imageFile)
    // Make the PUT request to update the data in the backend
    try {
      var response = null
      if (citizenAccount) {
        response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/occurrence/${currentReport.id}/${1}/${userEmail}/${userPassword}`, {
          method: 'PUT',
          body: formData
        })
      }
      if (!citizenAccount) {
        response = await fetch(`https://infrareportapi2--infrareportfeti.repl.co/occurrence/${currentReport.id}/${0}/${userEmail}/${userPassword}`, {
          method: 'PUT',
          body: formData
        })
      }
      const data = await response.json()
      if (response.ok) {
        setCurrentPoint({
          position: currentPoint.position,
          id: data.id,
          concluded: data.concluded,
          occurrence_type: data.occurrence_type
        })
        markerPoints.map((marker) => {
          if (marker.id === data.id) {
            marker.occurrence_type = currentReport.occurrence_type
          }
        })
      } else {
        setErrorCode("Atualização de dados")
        setErrorMessage("Erro durante a atualização dos dados.")
        setShowErrorModal(true)
        return
      }
    } catch (error) {
      setErrorCode("Erro desconhecido(0X009)")
      setErrorMessage(error.toString())
      setShowErrorModal(true)
      return
    }
    setEditedData({
      occurrence_type: "",
      user_comment: "",
      neighborhood: "",
      street: ""
    })
    setShowReportInfoModal(!showReportInfoModal)
  }
  const handleCancelClick = () => {
    // Reset the edited data to the currentReport values
    setEditedData({
      occurrence_type: "",
      user_comment: "",
      neighborhood: "",
      street: ""
    })
    setShowReportInfoModal(!showReportInfoModal)
  }
  return (
    <>
      <Modal show={showReportInfoModal} onHide={() => setShowReportInfoModal(!showReportInfoModal)}>
        <Modal.Header className='bg-primary' closeButton>
          <Modal.Title className='text-center text-white bg-primary'>Informações da ocorrência</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citizenAccount ? (
            <div>
              <div>
                <div className="form-group">
                  <img src={currentImage} className='image_div' alt="Occurrence Image" />
                  {currentPoint.concluded === "Em aberto" &&
                    <>
                      <label htmlFor="exampleFormControlFile1">Imagem:</label><br />
                      <input type="file" className="form-control-file" id="exampleFormControlFile1" label="Escolha a imagem" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} />
                    </>
                  }
                </div>
                <hr></hr>
                <Form.Group controlId="occurrenceType">
                  <label>Ocorrência:</label>
                  <Form.Select name="team" variant="primary" id="dropdown-basic" className='mb-4'
                    value={currentReport.occurrence_type} onChange={(e) => setCurrentReport({ ...currentReport, occurrence_type: e.target.value })}>
                    {infraestructureProblems.map((problem, key) => {
                      return <option key={key}>{problem}</option>
                    })}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="comment">
                  <Form.Label>Comentário:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={currentReport.user_comment} // Corrected property name to 'user_comment'
                    onChange={(e) => setCurrentReport({ ...currentReport, user_comment: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="street">
                  <Form.Label>Bairro:</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentReport.neighborhood}
                    placeholder="Bairro"
                    onChange={(e) => setCurrentReport({ ...currentReport, neighborhood: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="street">
                  <Form.Label>Rua:</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentReport.street}
                    placeholder="Rua"
                    onChange={(e) => setCurrentReport({ ...editedData, street: e.target.value })}
                  />
                </Form.Group>
                <hr></hr>
                {currentPoint.concluded === "Concluído" ? (
                  <div className="status_comment_div">
                    <div className="status_div">
                      <Form.Label>Estado: </Form.Label><p>{currentReport.concluded}</p>
                    </div>
                    <div className="finalComment_div">
                      <Form.Label>Comentário final da prefeitura: </Form.Label><p>{currentReport.city_comment}</p>
                    </div>
                  </div>) :
                  (<></>)
                }
              </div>
            </div>) : (
            <>
              <div className="form-group">
                <img src={currentImage} className='image_div' alt="Occurrence Image" />
              </div>
              <hr></hr>
              <div className='show_info_div'>
                <Form.Label className="showUserName">Usuário:</Form.Label><p>{currentReport.userName}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label>Email do usuário: </Form.Label><p>{currentReport.userEmail}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label className="showUserEmail">Tipo de ocorrência:</Form.Label><p>{currentReport.occurrence_type}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label>Comentário: </Form.Label><p>{currentReport.user_comment}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label>Bairro: </Form.Label><p>{currentReport.neighborhood}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label>Rua: </Form.Label><p>{currentReport.street}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label>Inserção: </Form.Label><p>{currentReport.created_at}</p>
              </div>
              <div className='show_info_div'>
                <Form.Label>Conclusão: </Form.Label><p>{currentReport.created_at}</p>
              </div>
              {currentPoint.concluded === "Em aberto" ? (
                <Form.Group controlId="comment">
                  <Form.Label>Comentário final:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={editedData.user_comment}
                    onChange={(e) => setEditedData({ ...editedData, user_comment: e.target.value })}
                  />
                </Form.Group>) : (
                <div className="finalComment_div">
                  <Form.Label>Comentário final da prefeitura: </Form.Label><p>{currentReport.city_comment}</p>
                </div>
              )
              }
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => {
            setShowReportInfoModal(!showReportInfoModal)
            handleCancelClick()
          }}>
            Cancelar
          </Button>
          {citizenAccount ? (
            <>
              <Button variant="danger" onClick={() => { handleDeleteClick() }}>
                Deletar
              </Button>
              {currentPoint.concluded === "Em aberto" ? (
                <Button variant="primary" onClick={() => { handleSaveClick() }}>
                  Modificar
                </Button>) : (<></>)}
            </>
          ) : (
            currentPoint.concluded === "Em aberto" ? (
              <Button variant="success" onClick={() => { handleFixedClick() }}>
                Concluir
              </Button>
            ) : (
              <Button variant="success" onClick={() => { handleReopenClick() }}>
                Reabrir
              </Button>
            )
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReportInfoModal;

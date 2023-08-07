import React from "react"
import { Button, Form, Modal } from "react-bootstrap"
import "./styles/SearchModal.css"

const SearchModal = ({ imageUrls, setImageUrls, treatImage, setSearchedData, searchedData, cep, endDate, setEndDate, startDate, setStartDate, selectedOption, setSelectedOption, showSearchModal, setShowSearchModal, infraestructureProblems, handleSearch }) => {
  const handleSearchOccurrence=async ()=>{
    if (!startDate || !endDate){
      alert("Selecione uma data.")
      return
    }
    try {
      const url = `http://127.0.0.1:8000/searchOccurrences/${cep}/${startDate}/${endDate}/${selectedOption}` // Replace with the actual API endpoint
      const response = await fetch(url)
      if (!response.ok){
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setSearchedData(data)
      return 
    } catch (error){
      console.error('Error fetching data:', error)
      throw error
    }
  }
  return (
    <>
      <Modal show={showSearchModal} onHide={() => {
        setSearchedData(null)
        setShowSearchModal(false)}}>
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-center text-white bg-primary">Pesquise as ocorrências</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOccurrenceType">
              <Form.Label>Ocorrência:</Form.Label>
              <Form.Select
                name="team"
                variant="primary"
                id="dropdown-basic"
                className="mb-4"
                defaultValue={selectedOption}
                onChange={(event)=>(setSelectedOption(event.target.value))}
              >
                {infraestructureProblems.map((problem, key) => (
                  <option key={key}>{problem}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formDateRange">
              <Form.Label>Selecione um intervalo de datas:</Form.Label>
              <div className="date_time_div">
                <div className="date_div">
                  <Form.Control
                    type="date"
                    placeholder="Data inicial"
                    defaultValue={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <small id="startDateHelp" className="form-text text-muted">Data inicial</small>
                </div>
                <div className="date_div">
                  <Form.Control
                    type="date"
                    placeholder="Data final"
                    defaultValue={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <small id="endDateHelp" className="form-text text-muted">Data final</small>
                </div>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => {
            setSearchedData(null)
            setShowSearchModal(false)}}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSearchOccurrence}>
            Pesquisar
          </Button>
        </Modal.Footer>
        <hr></hr>
        <Modal.Body>
        {
            searchedData instanceof Array && searchedData.map((currentSearchedData, index)=>{
              return (
                <React.Fragment key={index}>
                  <div className="form-group">
                    <img src={imageUrls[currentSearchedData.id]} className="image_div" alt="Occurrence Image" />
                  </div>
                  <br/>
                  <div className="show_info_div">
                    <Form.Label className="formLabel">Tipo de ocorrência:</Form.Label>
                    <p>{currentSearchedData.occurrence_type}</p>
                  </div>
                  <div className="show_info_div">
                    <Form.Label className="formLabel">Comentário: </Form.Label>
                    <p>{currentSearchedData.user_comment}</p>
                  </div>
                  <div className="show_info_div">
                    <Form.Label className="formLabel">Bairro: </Form.Label>
                    <p>{currentSearchedData.neighborhood}</p>
                  </div>
                  <div className="show_info_div">
                    <Form.Label className="formLabel">Rua: </Form.Label>
                    <p>{currentSearchedData.street}</p>
                  </div>
                  <div className="show_info_div">
                    <Form.Label className="formLabel">Inserção: </Form.Label>
                    <p>{currentSearchedData.created_at}</p>
                  </div>
                  <div className="show_info_div">
                    <Form.Label className="formLabel">Conclusão: </Form.Label>
                    <p>{currentSearchedData.created_at}</p>
                  </div>
                  <hr></hr>
                </React.Fragment>
            )})
          }
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SearchModal
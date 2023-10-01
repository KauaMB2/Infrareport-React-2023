import { Button, Modal } from 'react-bootstrap'
import { Form } from 'react-bootstrap'

const SearchModal = ({ setShowErrorModal, setErrorCode, setErrorMessage, errorCode, errorMessage, userEmail, userPassword, citizenAccount, cep, setMarkerPoints, selectedOption, setSelectedOption, infraestructureProblems, showFilterModal, setShowFilterModal }) => {
  const searchOccurence = async () => {
    var response
    if (selectedOption === "Todas") {
      var link
      if (citizenAccount) {
        link = `https://infrareportapi2--infrareportfeti.repl.co/getAllOccurrences/${cep}/${1}/${userEmail}/${userPassword}`
      } else {
        link = `https://infrareportapi2--infrareportfeti.repl.co/getAllOccurrences/${cep}/${0}/${userEmail}/${userPassword}`
      }
      response = await fetch(link, {
        method: "GET"
      })
    }
    else {
      var link
      if (citizenAccount) {
        link = `https://infrareportapi2--infrareportfeti.repl.co/filterReports/${cep}/${selectedOption}/${1}/${userEmail}/${userPassword}`
      } else {
        link = `https://infrareportapi2--infrareportfeti.repl.co/filterReports/${cep}/${selectedOption}/${0}/${userEmail}/${userPassword}`
      }
      response = await fetch(link, {
        method: "GET"
      })
      response = await fetch(link, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
    }
    const data = await response.json()
    if (!response.ok) {
      setErrorCode(response.status)
      setErrorMessage(data.Erro)
      setShowErrorModal(true)
      return
    }
    const latLngList = data.map((currentData) => ({
      position: {
        lat: currentData.latitude,
        lng: currentData.longitude
      },
      id: currentData.id,
      concluded: currentData.concluded,
      occurrence_type: currentData.occurrence_type
    }))
    setMarkerPoints(latLngList)
  }
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }
  return (
    <>
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(!showFilterModal)}>
        <Modal.Header className='bg-primary' closeButton>
          <Modal.Title className='text-center text-white bg-primary'>Filtre as ocorrências</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Ocorrência: </label>
          <Form.Select name="team" variant="primary" id="dropdown-basic" className='mb-4'
            defaultValue={selectedOption}
            onChange={handleOptionChange}>
            <option>Todas</option>
            {infraestructureProblems.map((problem, key) => {
              return <option key={key}>{problem}</option>
            })}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowFilterModal(!showFilterModal)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => searchOccurence()}>
            Pesquisar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SearchModal;

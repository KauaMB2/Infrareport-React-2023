import { Button, Modal } from 'react-bootstrap'
import { Form } from 'react-bootstrap'

const SearchModal = ({ userEmail, citizenAccount, cep, setMarkerPoints, selectedOption, setSelectedOption, infraestructureProblems, showFilterModal, setShowFilterModal }) => {
    const searchOccurence=async ()=>{
        var response
        if(selectedOption==="..."){
            var link
            if(citizenAccount){
                link=`http://127.0.0.1:8000/getAllOccurrences/${cep}/${1}/${userEmail}`
            }else{
                link=`http://127.0.0.1:8000/getAllOccurrences/${cep}/${0}/${userEmail}`
            }
            response = await fetch(link, {
                method: "GET"
            })
        }
        else{
            response = await fetch(`http://127.0.0.1:8000/filterReports/${cep}/${selectedOption}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
        const data = await response.json()
        const latLngList = data.map((currentData) => ({
            position:{
                lat: currentData.latitude,
                lng: currentData.longitude
            },
            id:currentData.id,
            concluded:currentData.concluded,
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
                    value={selectedOption}
                    onChange={handleOptionChange}>
                        <option selected>...</option>
                        {infraestructureProblems.map((problem,key)=>{
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

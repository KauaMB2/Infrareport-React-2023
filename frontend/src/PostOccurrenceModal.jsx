import { Button, Modal } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import React, { useState, useEffect } from "react"

const PostOccurrenceModal=({ setCurrentPoint, imageFile, setImageFile, infraestructureProblems, currentPoint, showPostOccurrenceModal, markerPoints, setShowPostOccurrenceModal, setMarkerPoints }) => {
    const accountEmail=localStorage.getItem('email')
    const [userComment,setUserComment]=useState("")
    const [occurrenceType,setOccurrenceType]=useState("Postes Danificados")
    const postOccurrence=async ()=>{
        if (!userComment){
            alert("Insira um comentário.")
            return
        }
        const formData = new FormData()
        formData.append("citizen_email", accountEmail)
        formData.append("occurrence_type", occurrenceType)
        formData.append("cep", 37540000)
        formData.append("neighborhood", "TESTE")
        formData.append("street", "TESTE")
        formData.append("user_comment", userComment)
        formData.append("latitude", currentPoint.position.lat)
        formData.append("longitude", currentPoint.position.lng)
        formData.append("image", imageFile)
        const response = await fetch("http://127.0.0.1:8000/occurrence/", {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        currentPoint.id=data.id
        currentPoint.occurrence_type=data.occurrence_type
        currentPoint.concluded=data.concluded
        if (!response.ok) {
            const errorInfo = await response.json()
            alert(errorInfo.error)
            console.log(JSON.stringify(errorInfo.error))
            throw new Error('Failed to submit form')
        }else{
            //Add the new marker to the markers state
            const newMarkers = [...markerPoints, currentPoint]
            setMarkerPoints(newMarkers)
        }
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
                        {infraestructureProblems.map((problem,key)=>{
                            return <option key={key}>{problem}</option>
                        })}
                    </Form.Select>
                    <label>Comentário:</label>
                    <Form.Control as="textarea" rows={5} value={userComment} onChange={(e) => setUserComment(e.target.value)} required/>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlFile1">Imagem:</label><br/>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1" label="Escolha a imagem" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} required/>
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

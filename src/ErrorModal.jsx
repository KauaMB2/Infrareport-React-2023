import React from "react"
import { Button, Modal } from 'react-bootstrap'

const ErrorModal=({ code, message, setErrorCode, setErrorMessage, showErrorModal, setShowErrorModal }) => {
    const hideModal=()=>{
        setShowErrorModal(!showErrorModal)
        setErrorCode("")
        setErrorMessage("")
    }
    return (
        <>
            <Modal show={showErrorModal} onHide={() => hideModal()}>
                <Modal.Header className='bg-danger' closeButton>
                    <Modal.Title className='text-center text-white bg-danger'>ERRO - {code}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => hideModal()}>
                        Okey
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ErrorModal;

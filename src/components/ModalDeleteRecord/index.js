import './styles.css'
import api from '../../services/api'
import { getItem } from '../../utils/storage';


function ModalDeleteRecord({
  setModalOpen,
  transactions,
  setTransactions,
  tableRowEdit,
  modalPosition,
  setCount
}) {
  const token = getItem('token');

  function handleCloseModal(event) {
    setModalOpen(false);
  }

  async function handleDeleteRecord(event) {
    event.stopPropagation();
    event.preventDefault();
    const localTransactions = [...transactions]
    const findIndexTransaction = transactions.findIndex((transaction) => {
      return transaction.id === tableRowEdit.id
    })
    localTransactions.splice(findIndexTransaction, 1)

    try {
      const response = await api.delete(`/transacao/${tableRowEdit.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.message)
      setTransactions(localTransactions)
      setModalOpen(false);
      setCount(1)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='modal-delete' style={{
      position: "absolute",
      top: modalPosition.top,
      left: modalPosition.left,
    }}>
      <div id='triangulo-para-cima'></div>
      <div className='rectangle-delete'>
        <span>Apagar item?</span>
        <div className='btn-modal-delete'>
          <button onClick={(event) => handleDeleteRecord(event)} style={{ backgroundColor: '#3A9FF1' }} >Sim</button>
          <button onClick={handleCloseModal} style={{ backgroundColor: '#FF576B' }} >Não</button>
        </div>
      </div>
    </ div >

  )
}

export default ModalDeleteRecord

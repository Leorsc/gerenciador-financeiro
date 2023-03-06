import { useState } from 'react';
import './styles.css'
import ModalAddRecord from '../ModalAddRecord'

function Resume({
  transactionsIn,
  transactionsOut,
  categorias,
  transactions,
  setTransactions
}) {
  const [modalAddRecord, setModalAddRecord] = useState(false);

  function handleOpenModalAddRecord(event) {
    event.stopPropagation();
    setModalAddRecord(true)
  }

  return (
    <div className='container-resume-btn flex-column'>
      {modalAddRecord &&
        <ModalAddRecord
          modalOpen={modalAddRecord}
          setModalOpen={setModalAddRecord}
          categorias={categorias}
          transactions={transactions}
          setTransactions={setTransactions}
        />}
      <div className='resume width-236 font-rubik'>
        <div className='container-resume width-170'>
          <h1>Resumo</h1>
          <div className='resume-inputs flex-column justify-between'>
            <div className='flex-row justify-between'>
              <span>Entradas</span>
              <span
                style={{ color: 'var(--positive)' }}
              >
                {`R$ ${(transactionsIn / 100).toFixed(2).toString().replace(".", ",")}`}
              </span>
            </div>
            <div className='flex-row justify-between'>
              <span>Saídas</span>
              <span
                style={{ color: 'var(--negative)' }}
              >
                {`R$ ${(transactionsOut / 100).toFixed(2).toString().replace(".", ",")}`}
              </span>
            </div>
          </div>
        </div>
        <div className='balance flex-row justify-between'>
          <span className='font-weight-700' >Saldo</span>
          <span
            className='font-weight-500'
            style={{ color: 'rgba(58, 159, 241, 1)' }}
          >
            {`R$ ${((transactionsIn - transactionsOut) / 100).toFixed(2).toString().replace(".", ",")}`}
          </span>
        </div>
      </div>
      <button className='btn btn-home' onClick={(event) => handleOpenModalAddRecord(event)}>Adicionar Registro</button>
    </div>
  )
}

export default Resume
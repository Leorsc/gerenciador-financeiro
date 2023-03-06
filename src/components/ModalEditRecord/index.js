import closeIcon from './../../assets/close-icon.svg'
import './styles.css'
import { useState } from 'react'
import api from '../../services/api'
import { getItem } from '../../utils/storage';


function ModalEditRecord({
  setModalOpen,
  categorias,
  setTransactions,
  tableRowEdit,
  setTableRowEdit,
  setCount
}) {
  const token = getItem('token');
  const [valorInput, setValorInput] = useState((tableRowEdit.valor / 100).toFixed(2).toString().replace(".", ","));
  const [form, setForm] = useState(
    {
      tipo: tableRowEdit.tipo,
      descricao: tableRowEdit.descricao,
      data: tableRowEdit.data.slice(0, 10),
      categoria_id: tableRowEdit.categoria_id
    }
  )
  const [isFormIncomplete, setIsFormIncomplete] = useState(false);

  function handleCloseModal(event) {
    event.stopPropagation();
    setModalOpen(false);
    setTableRowEdit('')
  }

  function handleForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleChange(event) {
    const valorAtual = event.target.value;
    const regexNumeros = /^[0-9,]*$/;

    if (regexNumeros.test(valorAtual)) {
      setValorInput(valorAtual);
    } else {
      setValorInput(valorInput);
    }
  }

  function validationForm() {
    const requiredFields = ["tipo", "descricao", "data", "categoria_id"];
    for (let field of requiredFields) {
      if (!form[field]) {
        setIsFormIncomplete(true);
        return;
      }
    }
    setIsFormIncomplete(false);
  }

  async function handleEditRecord(event) {
    event.stopPropagation();
    event.preventDefault()
    validationForm()

    const transactionUpdate = {
      tipo: form.tipo,
      descricao: form.descricao,
      valor: valorInput.includes(',') ? parseFloat(valorInput.replace(',', '')) : Number(valorInput) * 100,
      data: form.data,
      categoria_id: form.categoria_id
    }

    try {
      const response = await api.put(`/transacao/${tableRowEdit.id}`, transactionUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTransactions(prevTransactions => {
        return prevTransactions.map(transaction => {
          if (transaction.id === tableRowEdit.id) {
            const categoria = categorias.find(
              categoria => categoria.id === Number(transactionUpdate.categoria_id)
            );
            return {
              ...transaction,
              tipo: transactionUpdate.tipo,
              descricao: transactionUpdate.descricao,
              valor: transactionUpdate.valor,
              data: transactionUpdate.data,
              categoria_id: transactionUpdate.categoria_id,
              categoria_nome: categoria.descricao
            };
          }
          return transaction;
        });
      });

      if (response.status === 200) {
        console.log("Transação atualizada com sucesso")
      }
      setCount(1)
      handleCloseModal(event)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='modal' >
      <div className='modal-record'>
        <img
          className='icon-close'
          onClick={(event) => handleCloseModal(event)}
          src={closeIcon}
          alt='icone fechar pagina'
        />
        <form className='form-record'
          onSubmit={(event) => handleEditRecord(event)}
        >
          <div className='form-group form-group-record'>
            <h2>Editar Registro</h2>
            <div className='flex-row'>
              <button
                className='btn-record-left'
                name='tipo'
                value='entrada'
                type='button'
                onClick={(event) => handleForm(event)}
                style={form.tipo === 'entrada' ?
                  { backgroundColor: '#3A9FF1' }
                  :
                  { backgroundColor: '#B9B9B9' }}
              >
                Entrada
              </button>
              <button
                className='btn-record-right'
                name='tipo'
                value='saida'
                type='button'
                onClick={(event) => handleForm(event)}
                style={
                  form.tipo === 'saida' ?
                    { backgroundColor: '#FF576B' }
                    :
                    { backgroundColor: '#B9B9B9' }}
              >
                Saída
              </button>
            </div>
            <div className='form-control height-104'>
              <label htmlFor="valor">Valor</label>
              <div className='form-inputs input-value'>
                <span>
                  R$
                </span>
                <input
                  className='form-inputs'
                  type="text"
                  name='valor'
                  value={valorInput}
                  onChange={(event) => handleChange(event)}
                />
              </div>

            </div>
            <div className='form-control height-104'>
              <label htmlFor="name">Categoria</label>
              <select
                className='form-inputs'
                value={form.categoria_id}
                name="categoria_id"
                onChange={(event) => handleForm(event)}>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-control height-104'>
              <label htmlFor="data">Data</label>
              <input
                className='form-inputs'
                type="date"
                name='data'
                value={form.data}
                onChange={(event) => handleForm(event)}
              />
            </div>
            <div className='form-control height-104'>
              <label htmlFor="descricao">Descrição</label>
              <input
                className='form-inputs'
                type="text"
                name='descricao'
                value={form.descricao}
                onChange={(event) => handleForm(event)}
              />
            </div>
          </div>
          <div className={isFormIncomplete ? 'error-btn' : ''}>
            {isFormIncomplete && (
              <span className="form-error">
                Por favor, preencha todos os campos.
              </span>
            )}
            <button className="btn btn-home width-236">Confirmar</button>
          </div>
        </form>
      </div >
    </div >
  )
}

export default ModalEditRecord


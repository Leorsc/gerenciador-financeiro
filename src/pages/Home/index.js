import Header from '../../components/Header';
import api from './../../services/api'
import { getItem } from './../../utils/storage'
import { useEffect, useState } from 'react'
import './styles.css'
import ModalUpdateUser from '../../components/ModalUpdateUser';
import filterIcon from '../../assets/filter-icon.svg'
import CategoryFilter from '../../components/CategoryFilter';
import SpreadSheet from '../../components/SpreadSheet';
import Resume from '../../components/Resume';


function Home() {
  const token = getItem('token');
  const [usuario, setUsuario] = useState("");
  const [modalUpdateUserOpen, setModalUpdateUserOpen] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const [count, setCount] = useState(1);
  const [categorias, setCategorias] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionsOut, setTransactionsOut] = useState(0);
  const [transactionsIn, setTransactionsIn] = useState(0);

  useEffect(() => {
    getUser();
    getCategorias();
    getTransactionsUser()
  }, []);

  useEffect(() => {
    handleDateTransactions()
  }, [transactions])

  useEffect(() => {
    getUser();
  }, [usuario])


  function handleDateTransactions() {
    const localTransactions = [...transactions]

    const valueTransctionsInFilterIn = localTransactions
      .filter((transaction) => transaction.tipo === "entrada")
      .reduce((soma, transaction) => soma + transaction.valor, 0);

    const valueTransctionsInFilterOut = localTransactions
      .filter((transaction) => transaction.tipo === "saida")
      .reduce((soma, transaction) => soma + transaction.valor, 0);

    setTransactionsIn(valueTransctionsInFilterIn)
    setTransactionsOut(valueTransctionsInFilterOut)
  }

  function handleFilter(event) {
    event.stopPropagation();
    setFilterMode(!filterMode);
  }

  async function getCategorias() {
    try {

      const response = await api.get('/categoria',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      setCategorias(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  async function getUser() {
    try {

      const response = await api.get('/usuario',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      setUsuario(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  async function getTransactionsUser() {
    try {
      const response = await api.get('/transacao',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      setTransactions(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='page background-home'>
      {modalUpdateUserOpen &&
        <ModalUpdateUser
          setModalUpdateUserOpen={setModalUpdateUserOpen}
          usuario={usuario}
          setUsuario={setUsuario}

        />}
      <Header
        only_tittle={true}
        setUsuario={setUsuario}
        usuario={usuario}
        setModalUpdateUserOpen={setModalUpdateUserOpen}
      />

      <div className='home-page'>
        <div
          className='home font-rubik'
          style={filterMode ?
            { paddingTop: '111px', paddingBottom: '50px' }
            :
            { paddingTop: '55px' }}
        >
          <div className='container-filter'>
            <img
              className='pointer filter-icon'
              src={filterIcon}
              alt='icone de filtragem'
              onClick={(event) => handleFilter(event)}
            />
            <div>
              {filterMode &&
                <CategoryFilter
                  categorias={categorias}
                  transactions={transactions}
                  setTransactions={setTransactions}
                  getTransactionsUser={getTransactionsUser}
                  setCount={setCount}
                />
              }
            </div>
          </div>
          <Resume
            transactionsIn={transactionsIn}
            transactionsOut={transactionsOut}
            categorias={categorias}
            transactions={transactions}
            setTransactions={setTransactions}
          />
          <div className='container-tabela'>
            <SpreadSheet
              transactions={transactions}
              setTransactions={setTransactions}
              categorias={categorias}
              count={count}
              setCount={setCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
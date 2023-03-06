import plusIcon from '../../assets/plus-icon.svg'
import './styles.css'
import { useRef } from 'react'
import api from '../../services/api';
import { getItem } from '../../utils/storage';

function CategoryFilter({
  categorias,
  setTransactions,
  getTransactionsUser,
  setCount
}) {
  const categoriesSelecteds = useRef(null);
  const token = getItem('token');

  function handleSelectfilter(event) {
    const FilterSelected = event.currentTarget;
    const active = FilterSelected.classList.contains("active");
    const classeAtual = active ? "active" : "not-active";
    const novaClasse = active ? "not-active" : "active";
    FilterSelected.classList.replace(classeAtual, novaClasse);
  }

  function handleSelectCategories() {
    const filters = [];
    const selected = categoriesSelecteds.current.querySelectorAll('.active');
    selected.forEach(element => {
      filters.push(element.outerText)
    });

    if (!filters.length) {
      getTransactionsUser()
    }

    handleFilter(filters)
  }

  async function handleFilter(filters) {
    const parametros = filters.map(filter => `filtro[]=${filter.replace(/\s/g, '-')}`).join('&');
    try {
      const response = await api.get(`/transacao/?${parametros}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

      setTransactions(response.data)
      setCount(1)
    } catch (error) {
      console.log(error)
    }

  }

  function handleClearFilter() {
    const selected = categoriesSelecteds.current.querySelectorAll('.active');
    selected.forEach(element => {
      element.classList.replace('active', 'not-active');
    });
    getTransactionsUser()
    setCount(1)
  }

  return (
    <div className='filter'>
      <h1>Categorias</h1>
      <div className='container-categories' ref={categoriesSelecteds} >
        {categorias.map((categoria) =>
          <div
            key={categoria.id}
            className='not-active filter-categories'
            onClick={(event) => handleSelectfilter(event)}>
            <span>{categoria.descricao}</span>
            <img src={plusIcon} alt="plus icon" />
          </div>
        )}

      </div>
      <div className='container-btn-filter font-lato font-weight-700'>
        <button
          className='btn-filter'
          onClick={handleClearFilter}
        >
          Limpar Filtros
        </button>
        <button
          className='btn-filter'
          style={
            {
              backgroundColor: 'var(--light-purple)',
              color: 'var(--white)'
            }
          }
          onClick={handleSelectCategories}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  )
}

export default CategoryFilter


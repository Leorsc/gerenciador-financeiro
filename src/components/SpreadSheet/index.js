import './styles.css'
import trashIcon from './../../assets/trash-icon.svg'
import editIcon from './../../assets/edit-icon.svg'
import ModalEditRecord from '../ModalEditRecord'
import { useState } from 'react'
import React, { useMemo } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import moment from "moment";
import "moment/locale/pt-br";
import ModalDeleteRecord from '../ModalDeleteRecord'
moment.locale("pt-br");


function SpreadSheet({
  transactions,
  setTransactions,
  categorias,
  count,
  setCount
}) {
  const [tableRowEdit, setTableRowEdit] = useState('')
  const [modalEditRecord, setModalEditRecord] = useState(false);
  const [modalDeleteRecord, setModalDeleteRecord] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  function getCellStyle(cell) {
    const isValorColumn = cell.column.id === "valor";

    if (isValorColumn && cell.row.original.tipo === "entrada") {
      return { color: 'var(--positive)' }
    } else if (isValorColumn && cell.row.original.tipo === "saida") {
      return { color: 'var(--negative)' }
    }
    return { color: '#000000' }
  }

  function handleOpenModalEditRecord(rowInfos) {
    setTableRowEdit(rowInfos)
    setModalEditRecord(true)
  }

  function handleOpenModalDeleteRecord(rowInfos, event) {
    const rowRect = event.currentTarget.getBoundingClientRect();
    const modalTop = rowRect.top + window.pageYOffset;
    setModalDeleteRecord(true)
    setTableRowEdit(rowInfos)
    setModalPosition({ top: (modalTop - 200), left: '824px' })
  }

  function previousPageCount() {
    if (count > 1) {
      setCount(count - 1);
    }
    previousPage()
  }

  function nextPageCount() {
    if (count < pageCount) {
      setCount(count + 1);
    }
    nextPage()
  }

  function lastPaget() {
    gotoPage(pageCount - 1)
    setCount(pageCount)
  }

  function firstPage() {
    gotoPage(0)
    setCount(1);
  }



  const colunas = useMemo(
    () => [
      {
        Header: "Data",
        accessor: "data",
        Cell: ({ value }) => {
          const dataFormatada = moment(value).format("DD/MM/YYYY");
          return dataFormatada
        }
      },
      {
        Header: "Dia da semana",
        accessor: ({ data }) => {
          const diaDaSemana = moment(data).locale("pt-br").format("dddd").split("-")[0];
          return diaDaSemana

        }
      },
      { Header: "Descrição", accessor: "descricao" },
      { Header: "Categoria", accessor: "categoria_nome" },
      {
        Header: "Valor", accessor: "valor",
        Cell: ({ value }) => {
          const valor = (value / 100).toFixed(2).toString().replace(".", ",")
          return `R$ ${valor}`;
        }
      },
    ],
    []
  );

  const {
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage
  } = useTable(
    {
      columns: colunas,
      data: transactions,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );


  return (
    <>
      {modalEditRecord &&
        <ModalEditRecord
          setModalOpen={setModalEditRecord}
          categorias={categorias}
          setTransactions={setTransactions}
          tableRowEdit={tableRowEdit}
          setTableRowEdit={setTableRowEdit}
          setCount={setCount}
        />}
      <div className='posicao-modal'>
        {modalDeleteRecord &&
          <ModalDeleteRecord
            setModalOpen={setModalDeleteRecord}
            transactions={transactions}
            setTransactions={setTransactions}
            tableRowEdit={tableRowEdit}
            modalPosition={modalPosition}
            setCount={setCount}
          />
        }
      </div>
      <div className='table-header'>
        {headerGroups.map((headerGroup, index) => (
          <div className='container-header' key={index}>
            {headerGroup.headers.map((column) => (
              <span
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.id}
              >
                {column.render("Header")}
                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className='table-lines'>
        {page.map((row) => {
          prepareRow(row);
          return (
            <div className='container-line' style={{ position: 'relative' }} key={row.id}>
              {row.cells.map((cell) => (
                <span
                  key={`${row.id}-${cell.column.id}`}
                  style={getCellStyle(cell)}
                >
                  {cell.render("Cell")}
                </span>
              ))}
              <div className='container-icons-table'>
                <img
                  onClick={() => handleOpenModalEditRecord(row.original)}
                  className='pointer'
                  src={editIcon} alt=""
                />

                <img
                  onClick={(event) => handleOpenModalDeleteRecord(row.original, event)}
                  className='pointer'
                  src={trashIcon} alt=" "
                  data-target={`modal${row.original.id}`}
                />
              </div>

            </div>
          );
        })}
      </div>
      <div className='pagination'>
        <div className='arrows-page'>
          <button
            id='double-arrow-left'
            onClick={() => firstPage()}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </button>
          <button
            id='arrow-left'
            onClick={() => previousPageCount()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>
          <button
            id='arrow-right'
            onClick={() => nextPageCount()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>
          <button
            id='double-arrow-right'
            onClick={() => lastPaget()}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>
        </div>
        <span>
          Página{' '}
          <strong>
            {pageCount < 1 ? `0 de ${pageCount}` : `${count} de ${pageCount}`}
          </strong>{' '}
        </span>
      </div>
    </>
  )
}


export default SpreadSheet

import closeIcon from "./../../assets/close-icon.svg";
import "./styles.css";
import { useState } from "react";
import api from "../../services/api";
import { getItem } from "../../utils/storage";

function ModalAddRecord({
  setModalOpen,
  categorias,
  transactions,
  setTransactions,
}) {
  const token = getItem("token");
  const [valorInput, setValorInput] = useState("");
  const [isFormIncomplete, setIsFormIncomplete] = useState(false);

  const [form, setForm] = useState({
    tipo: "",
    descricao: "",
    data: "",
    categoria_id: 0,
  });

  function handleCloseModal(event) {
    event.stopPropagation();
    event.preventDefault();
    clerForm();
    setModalOpen(false);
  }

  function handleForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleFormInputValue(event) {
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

  async function handleAddRecord(event) {
    event.stopPropagation();
    event.preventDefault();
    validationForm()
    try {
      const response = await api.post(
        "/transacao",
        {
          tipo: form.tipo,
          descricao: form.descricao,
          valor: valorInput.includes(",")
            ? parseFloat(valorInput.replace(",", ""))
            : Number(valorInput) * 100,
          data: form.data,
          categoria_id: form.categoria_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(transactions.concat(response.data));
      handleCloseModal(event);
    } catch (error) {
      console.log(error);
    }
  }

  function clerForm() {
    setForm({
      tipo: "",
      descricao: "",
      data: "",
      categoria_id: 0,
    });
  }

  return (
    <div className="modal">
      <div className="modal-record">
        <img
          className="icon-close"
          onClick={(event) => handleCloseModal(event)}
          src={closeIcon}
          alt="icone fechar pagina"
        />
        <form
          className={isFormIncomplete ? "form-record-error" : "form-record"}
          onSubmit={(event) => handleAddRecord(event)}
        >
          <div className="form-group form-group-record">
            <h2>Adicionar Registro</h2>
            <div className="flex-row">
              <button
                className="btn-record-left"
                name="tipo"
                value="entrada"
                type="button"
                onClick={(event) => handleForm(event)}
                style={
                  form.tipo === "entrada"
                    ? { backgroundColor: "#3A9FF1" }
                    : { backgroundColor: "#B9B9B9" }
                }
              >
                Entrada
              </button>
              <button
                className="btn-record-right"
                name="tipo"
                value="saida"
                type="button"
                onClick={(event) => handleForm(event)}
                style={
                  form.tipo === "saida"
                    ? { backgroundColor: "#FF576B" }
                    : { backgroundColor: "#B9B9B9" }
                }
              >
                Saída
              </button>
            </div>
            <div className="form-control height-104">
              <label htmlFor="valor">Valor</label>
              <div className="form-inputs input-value">
                <span>R$</span>
                <input
                  className="form-inputs"
                  type="text"
                  name="valor"
                  value={valorInput}
                  onChange={(event) => handleFormInputValue(event)}
                />
              </div>
            </div>
            <div className="form-control height-104">
              <label htmlFor="name">Categoria</label>
              <select
                className="form-inputs"
                value={form.categoria_id}
                name="categoria_id"
                onChange={(event) => handleForm(event)}
              >
                <option value={0}>Selecione a categoria</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control height-104">
              <label htmlFor="data">Data</label>
              <input
                className="form-inputs"
                type="date"
                name="data"
                value={form.data}
                onChange={(event) => handleForm(event)}
              />
            </div>
            <div className="form-control height-104">
              <label htmlFor="descricao">Descrição</label>
              <input
                className="form-inputs"
                type="text"
                name="descricao"
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
      </div>
    </div>
  );
}

export default ModalAddRecord;
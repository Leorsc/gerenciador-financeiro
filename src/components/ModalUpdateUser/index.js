import closeIcon from './../../assets/close-icon.svg'
import './styles.css'
import { useState } from 'react'
import api from '../../services/api'
import { getItem } from '../../utils/storage';

function ModalUpdateUser({
  setModalUpdateUserOpen,
  usuario,
  setUsuario
}) {

  const token = getItem('token');

  const [form, setForm] = useState(
    {
      name: usuario.nome,
      email: usuario.email,
      password: '',
      confirmPassword: ''
    }
  )

  function handleCloseModal(event) {
    event.stopPropagation();
    clerForm()
    setModalUpdateUserOpen(false);
  }

  function handleForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleUpdateUser(event) {
    event.stopPropagation();
    event.preventDefault()
    try {
      const response = await api.put('/usuario',
        {
          nome: form.name,
          email: form.email,
          senha: form.password,
          confirmarSenha: form.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.message)
      setUsuario({ name: form.name, email: form.email })
      handleCloseModal(event);
    } catch (error) {
      console.log(error)
    }
  }

  function clerForm() {
    setForm(
      {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    )
  }

  return (
    <div className='modal' >
      <div className='modal-update'>
        <img
          className='icon-close'
          onClick={(event) => handleCloseModal(event)}
          src={closeIcon}
          alt='icone fechar pagina'
        />

        <form className='form-update-user'
          onSubmit={(event) => handleUpdateUser(event)}
        >
          <div className='form-group form-group-home'>
            <h2 className='home-form-title font-weight-500'>
              Editar Perfil
            </h2>
            <div className='home-form-inputs'>
              <div className='form-control height-104'>
                <label htmlFor="name">Nome</label>
                <input
                  className='form-inputs'
                  type="text"
                  name='name'
                  value={form.name}
                  onChange={(event) => handleForm(event)}
                />
              </div>
              <div className='form-control height-104'>
                <label htmlFor="email">E-mail</label>
                <input
                  className='form-inputs'
                  type="text"
                  name='email'
                  value={form.email}
                  onChange={(event) => handleForm(event)}
                />
              </div>
              <div className='form-control height-104'>
                <label htmlFor="password">Senha</label>
                <input
                  className='form-inputs'
                  type="password"
                  name='password'
                  value={form.password}
                  onChange={(event) => handleForm(event)}
                />
              </div>
              <div className='form-control height-104'>
                <label htmlFor='confirmPassword'>Confirmar Senha</label>
                <input
                  className='form-inputs'
                  type='password'
                  name='confirmPassword'
                  value={form.confirmPassword}
                  onChange={(event) => handleForm(event)}
                />
              </div>
            </div>
          </div>
          <button className='btn width-236'>
            Confirmar
          </button>
        </form>
      </div>
    </div>
  )
}

export default ModalUpdateUser
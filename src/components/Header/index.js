import singOut from './../../assets/sign-out.svg'
import logo from './../../assets/logo.png'
import userIcon from './../../assets/user.svg'
import { clear } from './../../utils/storage'
import { Link } from 'react-router-dom'

import './styles.css'

function Header({
  only_tittle,
  usuario,
  setUsuario,
  setModalUpdateUserOpen
}) {

  function leavePage() {
    setUsuario('')
    clear()
  }

  function openModalUpdateUser(event) {
    event.preventDefault();
    event.stopPropagation();

    setModalUpdateUserOpen(true);
  }

  return (
    <header className={only_tittle ? 'header-gradiente' : ''}>
      <img className='img-logo' src={logo} alt='logo' />
      {only_tittle &&
        <div className='user-container flex-row align-center justify-between'>
          <div className='user-content font-rubik flex-row align-center justify-center' >
            <img className='pointer' onClick={(event) => openModalUpdateUser(event)} src={userIcon} alt='icone usuario' />
            <span>{usuario.nome}</span>
          </div>
          <div className='icon-sing-out'>
            <Link to='/'>
              <img onClick={() => leavePage()} className='pointer' src={singOut} alt="icone sair" />
            </Link>
          </div>
        </div>
      }
    </header>
  )
}

export default Header
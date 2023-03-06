import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn';
import { getItem } from './utils/storage'
import SignUp from './pages/SignUp';


function MainRoutes() {

  function ProtectedRoutes({ redirectTo }) {
    const token = getItem('token');
    return token ? <Outlet /> : <Navigate to={redirectTo} />
  }

  return (

    <Routes>
      <Route path='/' element={<SignIn />} />

      <Route path='/sign-up' element={<SignUp />} />

      <Route element={<ProtectedRoutes redirectTo={'/'} />} >
        <Route path='/home' element={<Home />} />
      </Route>

      <Route path='*' element={<h1>404 - Not found</h1>} />
    </Routes >
  )
}

export default MainRoutes














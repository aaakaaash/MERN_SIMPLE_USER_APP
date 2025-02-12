import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/Signin';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/adminPages/AdminDashboard';

const App = () => {
  const { currentUser } = useSelector(state => state.user);

  return (
    <BrowserRouter>
      {currentUser?.isAdmin ? <AdminHeader /> : <Header />}
      <Routes>
        {/* Redirect user based on role */}
        <Route path="/" element={currentUser?.isAdmin ? <AdminDashboard /> : <Home />} />

        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />

       
        <Route path='/profile' element={<Profile />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

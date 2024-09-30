import { Routes, Route } from 'react-router-dom';
import PageNotFound from './pages/pageNotFound/pageNotFound';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AuthProvider } from './components/Auth/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire Routes with AuthProvider */}
      <Routes>
        <Route path="/" element={<Signin />}/>
        <Route path='/page-not-found' element={<PageNotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* <Route path='*' element={<Navigate to='/page-not-found' />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../components/Auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import Dash from './pages/Dash';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name);
        }
      }
    };

    fetchUserName();
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      {currentUser && (
        <Dash profileName={name} handleSignOut={handleSignOut} />
      )}
    </div>
  );
};

export default Dashboard;
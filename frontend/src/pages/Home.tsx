import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };
  return (
    <>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

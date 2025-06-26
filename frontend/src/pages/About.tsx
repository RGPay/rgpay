import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function About() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };
  return (
    <>
      <h1>About Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

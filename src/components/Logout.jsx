import { useNavigate } from "react-router-dom";
import { auth, signOut } from "./firebaseconfig";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}

export default Logout;

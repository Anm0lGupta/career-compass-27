import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Guest demo mode — simply redirects to dashboard with mock data */
const DemoPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In the future, this could set a demo flag in context/store
    // For now, dashboard always shows mock data
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
};

export default DemoPage;

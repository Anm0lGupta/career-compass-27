import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/** Guest demo mode — sets demo flag and redirects to dashboard with mock data */
const DemoPage = () => {
  const navigate = useNavigate();
  const { setIsDemo } = useAuth();

  useEffect(() => {
    setIsDemo(true);
    navigate("/dashboard", { replace: true });
  }, [navigate, setIsDemo]);

  return null;
};

export default DemoPage;

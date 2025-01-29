import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";

const UnauthenicatedApp = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default UnauthenicatedApp;

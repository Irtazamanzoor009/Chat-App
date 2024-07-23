import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MessagePage from "./components/MessagePage";
import CheckEmailPage from "./components/Pages/Email Page/CheckEmailPage";
import CheckPasswordPage from "./components/Pages/Password Page/CheckPasswordPage";
import HomePage from "./components/Pages/HomePage/HomePage";
import RegisterPage from "./components/Pages/RegisterPage/RegisterPage";
import ForgotPassword from "./components/Pages/ForgotPassword/ForgotPassword";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Router>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/registerpage" element={<RegisterPage />}></Route>
          <Route path="/checkemailpage" element={<CheckEmailPage/>}></Route>
          <Route
            path="/checkpasswordpage"
            element={<CheckPasswordPage />}
          ></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route
            path="/:userId"
            element={
              <div>
                <HomePage ischat={true} />
                {/* <MessagePage /> */}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MessagePage from "./components/MessagePage";
import CheckEmailPage from "./components/Pages/Email Page/CheckEmailPage";
import CheckPasswordPage from "./components/Pages/Password Page/CheckPasswordPage";
import HomePage from "./components/Pages/HomePage/HomePage";
import RegisterPage from "./components/Pages/RegisterPage/RegisterPage";
function App() {
  

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/registerpage" element={<RegisterPage/>}></Route>
          <Route path="/checkemailpage" element={<CheckEmailPage/>}></Route>
          <Route path="/checkpasswordpage" element={<CheckPasswordPage/>}></Route>
          <Route
            path="/:userId"
            element={
              <div>
                <HomePage />
                <MessagePage/>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FirstPage from "./pages/FirstPage";
import HomePage from "./pages/HomePage";

const App = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/" element={<FirstPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                </Routes>
            </Router>
    );
};

export default App;
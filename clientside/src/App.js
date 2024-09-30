import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Modules/admin/component/Nav/Navigation";
import AdminRoute from "./Modules/admin/Route/AdminRoute";
import BranchRoute from "./Modules/branch/Route/BranchRoute";
import UserRoute from "./Modules/user/Route/UserRoute";
// import UserPageRoute from "./Modules/user/Route/";




function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/admin/*" element={<AdminRoute />}/>
          <Route exact path="/branch/*" element={<BranchRoute />}/>
          <Route exact path="/*" element={<UserRoute />}/>
          {/* <Route exact path="/userpage/*" element={<UserPageRoute />}/> */}
          




        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

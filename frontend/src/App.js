import React from 'react';
import Admin from './Pages/Admin/Admin';
import { Route, Routes } from "react-router-dom";
import Order from './Pages/Admin/Order';
import Addmenu from './Pages/Admin/Addmenu';
import Addrole from './Pages/Admin/Addrole';
import Adduser from './Pages/Admin/Adduser';

const App = () => {
  return (
   <>
    <Routes>
          <Route path="/" element={<Admin />}>
            <Route path="/" element={<Order />} />
            <Route path="/" element={<Addmenu />} />
            <Route path="/" element={<Addrole />} />
            <Route path="/" element={<Adduser />} />
          </Route>
    </Routes>
   </>
  );
};

export default App;

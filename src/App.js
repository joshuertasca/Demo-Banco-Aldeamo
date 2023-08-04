
import './App.css';
import React from 'react';
// import { Navbar } from './componentes/navbar';
// import { Barralateral } from './componentes/barralateral';
// import { AuthProvider, AuthRoute } from './componentes/auth'
// import { Registros } from './componentes/registros';
import { HashRouter, Routes, Route } from 'react-router-dom';
// import { Enviarplantillas } from './componentes/Enviarplantillas';
// import { Enviarmensaje } from './componentes/enviarmensaje';
// import { LoginPage } from './componentes/LoginPage';
// import { LogoutPage } from './componentes/Logoutpage';
// import { Enviarnotificacion } from './componentes/EnviarNotificacion';
// import { Enviarcodigo } from './componentes/EnviarCodigoWA';
import { LoginCode } from './componentes/loginCode';
import * as Sentry from "@sentry/react";

function App() {
  return (
  
    <HashRouter>
     
        
              <Routes>
                <Route path='/:pass?' element={<LoginCode />} />
                <Route path='*' element={<h1>No se encontró la pagina</h1>} />
              </Routes>
            

    </HashRouter>


  );
}

export default App;

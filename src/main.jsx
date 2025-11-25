import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
 //import Hi from './hi.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    {/* si vous travaillez avec le mode dev il permet de mentioner les Erreurs */}
    <ToastContainer position='top-right'/>
     <App /> 
    {/* <Hi />  */}
  </React.StrictMode>,
)

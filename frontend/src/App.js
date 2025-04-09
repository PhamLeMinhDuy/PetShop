import React, { Fragment } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { routes } from './components/routes';
import DefaultComponent from './components/pages/DefaultComponent/DefaultComponent';
import { CartProvider } from './components/context/CartContext';
const App = () => {
  return (
    <div>
      <Router>
        <CartProvider>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </CartProvider>
      </Router>
    </div>
  )
}

export default App
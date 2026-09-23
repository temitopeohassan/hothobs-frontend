import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import OrderBar from './components/OrderBar.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import MenuSection from './pages/MenuSection.jsx'
import Product from './pages/Product.jsx'
import Catering from './pages/Catering.jsx'
import CateringMenu from './pages/CateringMenu.jsx'
import About from './pages/About.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Order from './pages/Order.jsx'
import OrderComplete from './pages/OrderComplete.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Account from './pages/Account.jsx'
import RequireAuth from './components/RequireAuth.jsx'

/**
 * Every navigation starts at the top — unless it carries a hash, which the
 * menu pages use to jump straight to a category. Scrolling to 0 there would
 * undo the jump the link was for.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:menuId" element={<MenuSection />} />
          <Route path="/menu/:menuId/:slug" element={<Product />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/catering/menu" element={<CateringMenu />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
          {/* Where Paystack returns the customer after they pay. Open to
              guests: the page proves the order with its claim token, and a
              sign-in wall here would strand someone who has just paid. */}
          <Route path="/order/complete" element={<OrderComplete />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <OrderBar />
    </>
  )
}

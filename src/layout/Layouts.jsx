import React from 'react'
import Footer from './Footer'
import NavbarArea from './Navbar'

const Layouts = ({children}) => {
  return (
    <main>
        <NavbarArea/>
        {children}
        <Footer/>
    </main>
  )
}

export default Layouts
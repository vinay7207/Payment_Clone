import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#2c3e50',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        PAY & GO
      </div>

      {/* Hamburger Menu Button */}
      <div style={{
        display: 'none',
        cursor: 'pointer',
        '@media (maxwidth: 500px)': {
          display: 'block'
        }
      }} onClick={() => setIsOpen(!isOpen)}>
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px',
          transition: 'all 0.3s ease'
        }} />
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px',
          transition: 'all 0.3s ease'
        }} />
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px',
          transition: 'all 0.3s ease'
        }} />
      </div>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        '@media (maxwidth: 500px)': {
          display: isOpen ? 'flex' : 'none',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#2c3e50',
          flexDirection: 'column',
          padding: '1rem',
          gap: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          transition: 'all 0.3s ease',
          ':hover': {
            backgroundColor: '#34495e'
          },
          '@media (maxwidth: 500px)': {
            width: '100%',
            textAlign: 'center'
          }
        }}>Home</Link>
        
        <Link to="/login" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          transition: 'all 0.3s ease',
          ':hover': {
            backgroundColor: '#34495e'
          },
          '@media (maxwidth: 500px)': {
            width: '100%',
            textAlign: 'center'
          }
        }}>Login</Link>
        
        <Link to="/signup" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          transition: 'all 0.3s ease',
          ':hover': {
            backgroundColor: '#34495e'
          },
          '@media (maxwidth: 500px)': {
            width: '100%',
            textAlign: 'center'
          }
        }}>Sign Up</Link>

      </div>
    </nav>
  )
}

export default Navbar

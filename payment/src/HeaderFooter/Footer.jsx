import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          ':hover': {
            textDecoration: 'underline'
          }
        }}>Home</Link>
        
        <Link to="/login" style={{
          color: 'white',
          textDecoration: 'none',
          ':hover': {
            textDecoration: 'underline'
          }
        }}>Login</Link>
        
        <Link to="/signup" style={{
          color: 'white',
          textDecoration: 'none',
          ':hover': {
            textDecoration: 'underline'
          }
        }}>Sign Up</Link>
        
        <Link to="/transection" style={{
          color: 'white',
          textDecoration: 'none',
          ':hover': {
            textDecoration: 'underline'
          }
        }}>Transactions</Link>
      </div>
      
      <div style={{
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>
        <p>Pay anyone, everywhere. Make contactless & secure payments.</p>
      </div>
      
      <div style={{
        fontSize: '0.8rem',
        color: '#bdc3c7'
      }}>
        <p>© {new Date().getFullYear()} PAY & GO. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

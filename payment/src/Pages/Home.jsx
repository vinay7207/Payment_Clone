import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <section style={{
        maxWidth: '800px',
        width: '100%',
        padding: '2rem',
        borderRadius: '1rem',
        background: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: '#2c3e50',
          marginBottom: '1rem'
        }}>Welcome to PAY & GO</h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#7f8c8d',
          margin: '0.5rem 0'
        }}>Thank you for joining us</p>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#7f8c8d',
          margin: '0.5rem 0 2rem'
        }}>Delighted to have you with us</p>
        
        <div style={{
          margin: '2rem 0',
          lineHeight: '1.6'
        }}>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>Pay anyone, everywhere. Make contactless & secure payments in-stores or online using PAY & GO UPI or directly from your Bank Account.</p>
          <p style={{
            fontSize: '1.1rem'
          }}>Plus, send & receive money from anyone.</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          
          <Link to="/" style={{
            padding: '0.8rem 1.5rem',
            background: '#2ecc71',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            ':hover': {
              background: '#27ae60'
            }
          }}>Know More</Link>
        </div>
      </section>
    </div>
  )
}

export default Home

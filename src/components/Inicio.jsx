import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserDropdown from './UserDropdown';

import { ChartColumnBig, LayoutPanelLeft, ChartSpline, ShoppingCart, UsersRound, Package2, ChartNetwork, Handshake } from 'lucide-react';

import Logo from './imagenes/StackFlowLogo.png';

const Inicio = ({ userData, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectorStyle, setSelectorStyle] = useState({});
  const [showVentasDropdown, setShowVentasDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowVentasDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const allLinks = menuRef.current?.querySelectorAll('.nav-link');
    if (!allLinks) return;

    const activeLink = [...allLinks].find(link => {
      const path = location.pathname;
      const isVenta = path.includes('/Venta') && link.textContent.trim() === 'Ventas';
      const isMatch = link.classList.contains('active');
      return isVenta || isMatch;
    });

    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      setSelectorStyle({
        width: `${rect.width}px`,
        left: `${rect.left - menuRect.left}px`,
      });
    }
  }, [location.pathname, mobileMenuOpen]);

  const linkMotion = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300 }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleVentasDropdown = () => {
    setShowVentasDropdown(!showVentasDropdown);
  };

  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      width: '100%',
      height: '66px',
      top: 0,
      zIndex: 1000,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => navigate('/homepage')}>
        <img src={Logo} alt="Logo" style={{ width: '58px', height: '53px' }} />
        <span style={{ fontWeight: 'bold', fontSize: '1.7rem' }}>
          <span style={{ color: '#3f2569' }}>Stack</span>
          <span style={{ color: '#e5a60d' }}>Flow</span>
        </span>
      </div>

      {/* Menú Hamburguesa para móvil */}
      <div style={{ display: windowWidth <= 768 ? 'block' : 'none' }}>
        <button 
          onClick={toggleMobileMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#3f2569',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú principal */}
      <div 
        ref={menuRef} 
        style={{ 
          position: windowWidth > 768 ? 'relative' : 'fixed',
          display: windowWidth > 768 ? 'flex' : mobileMenuOpen ? 'flex' : 'none',
          flexDirection: windowWidth > 768 ? 'row' : 'column',
          gap: '1.5rem',
          alignItems: 'center',
          backgroundColor: windowWidth <= 768 ? '#f8f9fa' : 'transparent',
          top: windowWidth <= 768 ? '66px' : 'auto',
          left: windowWidth <= 768 ? 0 : 'auto',
          right: windowWidth <= 768 ? 0 : 'auto',
          padding: windowWidth <= 768 ? '1rem 2rem' : '0',
          boxShadow: windowWidth <= 768 ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          zIndex: 999,
          width: windowWidth <= 768 ? '100%' : 'auto',
          height: windowWidth <= 768 ? 'calc(100vh - 66px)' : 'auto',
          overflowY: windowWidth <= 768 ? 'auto' : 'visible',
          justifyContent: windowWidth <= 768 ? 'flex-start' : 'center'
        }}
      >
        
        {windowWidth > 768 && (
          <div
            className="selector"
            style={{
              position: 'absolute',
              bottom: 0,
              height: '2px',
              backgroundColor: '#e5a60d',
              transition: 'all 0.3s ease',
              ...selectorStyle
            }}
          />
        )}

        {/* Links animados */}
        <motion.div {...linkMotion}>
          <NavLink 
            to="/Homepage" 
            className="nav-link"
            onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
            onMouseEnter={() => setHoveredLink('Homepage')}
            onMouseLeave={() => setHoveredLink(null)}
            style={({ isActive }) => ({
              color: isActive || hoveredLink === 'Homepage' ? '#e5a60d' : '#3f2569',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '6px',
              transition: 'color 0.3s ease',
              fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
              margin: windowWidth <= 768 ? '0.5rem 0' : '0'
            })}
          >
            <LayoutPanelLeft /> Inicio
          </NavLink>
        </motion.div>

        <motion.div {...linkMotion}>
          <NavLink 
            to="/cliente/ShowCliente" 
            className="nav-link"
            onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
            onMouseEnter={() => setHoveredLink('cliente')}
            onMouseLeave={() => setHoveredLink(null)}
            style={({ isActive }) => ({
              color: isActive || hoveredLink === 'cliente' ? '#e5a60d' : '#3f2569',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '6px',
              transition: 'color 0.3s ease',
              fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
              margin: windowWidth <= 768 ? '0.5rem 0' : '0'
            })}
          >
            <UsersRound /> Cliente
          </NavLink>
        </motion.div>

        {/* Ventas con Dropdown */}
        <div
          ref={dropdownRef}
          className="ventas-dropdown"
          style={{ 
            position: 'relative', 
            paddingBottom: '6px',
            margin: windowWidth <= 768 ? '0.5rem 0' : '0'
          }}
        >
          <motion.div {...linkMotion}>
            <div
              onClick={toggleVentasDropdown}
              style={{
                color: location.pathname.includes('/Venta') || showVentasDropdown ? '#e5a60d' : '#3f2569',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                fontSize: windowWidth <= 768 ? '1.2rem' : '1rem'
              }}
            >
              <ShoppingCart />
              <span className="ventas-tab nav-link" style={{ padding: 0 }}>
                Ventas
              </span>
              <FaChevronDown size={12} style={{
                transform: showVentasDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} />
            </div>
          </motion.div>

          {showVentasDropdown && (
            <div style={{
              position: windowWidth > 768 ? 'absolute' : 'relative',
              top: windowWidth > 768 ? '100%' : '0',
              left: windowWidth > 768 ? '0' : '1rem',
              backgroundColor: windowWidth > 768 ? 'white' : 'transparent',
              boxShadow: windowWidth > 768 ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
              borderRadius: '4px',
              padding: '0.5rem 0',
              minWidth: '200px',
              zIndex: 1001,
              marginTop: windowWidth <= 768 ? '0.5rem' : '0',
              marginLeft: windowWidth <= 768 ? '1rem' : '0'
            }}>
              <NavLink 
                to="/Venta/VentaForm" 
                className="nav-link"
                onClick={() => {
                  windowWidth <= 768 && setMobileMenuOpen(false);
                  setShowVentasDropdown(false);
                }}
                onMouseEnter={() => setHoveredLink('Nventa')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'Nventa' ? '#e5a60d' : '#3f2569',
                  display: 'block',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: windowWidth <= 768 ? '1.1rem' : '1rem'
                })}
              >
                Nueva Venta
              </NavLink>

              {userData?.rol === 'Administrador' && (
                <>
                  <NavLink 
                    to="/Venta/ShowVentas" 
                    className="nav-link"
                    onClick={() => {
                      windowWidth <= 768 && setMobileMenuOpen(false);
                      setShowVentasDropdown(false);
                    }}
                    onMouseEnter={() => setHoveredLink('Hventa')}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={({ isActive }) => ({
                      color: isActive || hoveredLink === 'Hventa' ? '#e5a60d' : '#3f2569',
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: windowWidth <= 768 ? '1.1rem' : '1rem'
                    })}
                  >
                    Historial de Ventas
                  </NavLink>
                  <NavLink 
                    to="/Venta/ShowDetalleVenta" 
                    className="nav-link"
                    onClick={() => {
                      windowWidth <= 768 && setMobileMenuOpen(false);
                      setShowVentasDropdown(false);
                    }}
                    onMouseEnter={() => setHoveredLink('Dventa')}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={({ isActive }) => ({
                      color: isActive || hoveredLink === 'Dventa' ? '#e5a60d' : '#3f2569',
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: windowWidth <= 768 ? '1.1rem' : '1rem'
                    })}
                  >
                    Detalles de Ventas
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>

        {/* ADMIN-only */}
        {userData?.rol === 'Administrador' && (
          <>
            <motion.div {...linkMotion}>
              <NavLink 
                to="/proveedor/ShowProveedor" 
                className="nav-link"
                onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('proveedor')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'proveedor' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
                  margin: windowWidth <= 768 ? '0.5rem 0' : '0'
                })}
              >
                <Handshake /> Proveedor
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink 
                to="/producto/ShowProducto" 
                className="nav-link"
                onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('producto')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'producto' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
                  margin: windowWidth <= 768 ? '0.5rem 0' : '0'
                })}
              >
                <Package2 /> Productos
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink 
                to="/TopProductosChart" 
                className="nav-link"
                onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('dashboard')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'dashboard' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
                  margin: windowWidth <= 768 ? '0.5rem 0' : '0'
                })}
              >
                <ChartColumnBig /> Dashboard
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink 
                to="/FormularioPrediccion" 
                className="nav-link"
                onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('prediccion')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'prediccion' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
                  margin: windowWidth <= 768 ? '0.5rem 0' : '0'
                })}
              >
                <ChartSpline /> Prediccion
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink 
                to="/PrediccionPorDni" 
                className="nav-link"
                onClick={() => windowWidth <= 768 && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('PrediccionPorDni')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'PrediccionPorDni' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: windowWidth <= 768 ? '1.2rem' : '1rem',
                  margin: windowWidth <= 768 ? '0.5rem 0' : '0'
                })}
              >
                <ChartNetwork /> Prediccion por C.C
              </NavLink>
            </motion.div>
          </>
        )}

        {/* UserDropdown en móvil */}
        {windowWidth <= 768 && userData && (
          <div style={{ marginTop: '1rem' }}>
            <UserDropdown 
              userData={userData} 
              onLogout={onLogout} 
              mobileView={true}
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}
      </div>

      {/* UserDropdown en desktop */}
      {windowWidth > 768 && userData && (
        <UserDropdown userData={userData} onLogout={onLogout} />
      )}
    </nav>
  );
};

export default Inicio;
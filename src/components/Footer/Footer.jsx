import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/">Streamhub</Link>
          <p>Tu destino para películas y series</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3>Navegación</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/explore">Explorar</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/forum">Foro</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Categorías</h3>
            <ul>
              <li><Link to="/movies">Películas</Link></li>
              <li><Link to="/series">Series</Link></li>
              <li><Link to="/documentaries">Documentales</Link></li>
              <li><Link to="/new-releases">Novedades</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms">Términos de servicio</Link></li>
              <li><Link to="/privacy">Política de privacidad</Link></li>
              <li><Link to="/cookies">Cookies</Link></li>
              <li><Link to="/legal">Información legal</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li><Link to="/contact"><i className="fas fa-envelope"></i> contacto@streamhub.com</Link></li>
              <li><Link to="/support"><i className="fas fa-headset"></i> Soporte</Link></li>
              <li><Link to="/advertising"><i className="fas fa-bullhorn"></i> Publicidad</Link></li>
            </ul>
            <div className="social-media">
              <a href="https://facebook.com" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://youtube.com" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Streamhub. Todos los derechos reservados.</p>
        <div className="payment-options">
          <i className="fab fa-cc-visa"></i>
          <i className="fab fa-cc-mastercard"></i>
          <i className="fab fa-cc-paypal"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
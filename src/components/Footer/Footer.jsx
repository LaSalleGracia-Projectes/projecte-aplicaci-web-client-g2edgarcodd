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
          <p>Tu destino para descubrir películas y series que te inspirarán, emocionarán y entretendrán.</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3>Navegación</h3>
            <ul>
              <li><Link to="/"><i className="fas fa-home"></i> Inicio</Link></li>
              <li><Link to="/explore"><i className="fas fa-compass"></i> Explorar</Link></li>
              <li><Link to="/blog"><i className="fas fa-rss"></i> Blog</Link></li>
              <li><Link to="/forum"><i className="fas fa-comments"></i> Foro</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Categorías</h3>
            <ul>
              <li><Link to="/movies"><i className="fas fa-film"></i> Películas</Link></li>
              <li><Link to="/series"><i className="fas fa-tv"></i> Series</Link></li>
              <li><Link to="/documentaries"><i className="fas fa-photo-video"></i> Documentales</Link></li>
              <li><Link to="/new-releases"><i className="fas fa-calendar-alt"></i> Novedades</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms"><i className="fas fa-file-contract"></i> Términos de servicio</Link></li>
              <li><Link to="/privacy"><i className="fas fa-user-shield"></i> Política de privacidad</Link></li>
              <li><Link to="/cookies"><i className="fas fa-cookie-bite"></i> Cookies</Link></li>
              <li><Link to="/legal"><i className="fas fa-balance-scale"></i> Información legal</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li><Link to="/contact"><i className="fas fa-envelope"></i> contacto@streamhub.com</Link></li>
              <li><Link to="/support"><i className="fas fa-headset"></i> Soporte</Link></li>
              <li><Link to="/advertising"><i className="fas fa-bullhorn"></i> Publicidad</Link></li>
              <li><Link to="/faq"><i className="fas fa-question-circle"></i> FAQ</Link></li>
            </ul>
            <div className="social-media">
              <a href="https://facebook.com" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://youtube.com" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="https://discord.com" aria-label="Discord"><i className="fab fa-discord"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Streamhub</p>
        <div className="payment-options">
          <i className="fab fa-cc-visa" data-name="Visa"></i>
          <i className="fab fa-cc-mastercard" data-name="Mastercard"></i>
          <i className="fab fa-cc-paypal" data-name="PayPal"></i>
          <i className="fab fa-cc-apple-pay" data-name="Apple Pay"></i>
          <i className="fab fa-cc-amazon-pay" data-name="Amazon Pay"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
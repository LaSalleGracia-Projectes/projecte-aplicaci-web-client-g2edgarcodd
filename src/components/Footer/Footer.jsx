import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../styles/components/footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/">{t("common.appName")}</Link>
          <p>{t("footer.description")}</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h3>{t("navbar.home")}</h3>
            <ul>
              <li>
                <Link to="/">
                  <i className="fas fa-home"></i> {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link to="/explore">
                  <i className="fas fa-compass"></i> {t("navbar.explore")}
                </Link>
              </li>
              <li>
                <Link to="/blog">
                  <i className="fas fa-rss"></i> {t("navbar.blog")}
                </Link>
              </li>
              <li>
                <Link to="/forum">
                  <i className="fas fa-comments"></i> {t("navbar.forum")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t("footer.legal")}</h3>
            <ul>
              <li>
                <Link to="/terms">
                  <i className="fas fa-file-contract"></i>{" "}
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link to="/privacy">
                  <i className="fas fa-user-shield"></i>{" "}
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link to="/cookies">
                  <i className="fas fa-cookie-bite"></i> {t("footer.cookies")}
                </Link>
              </li>
              <li>
                <Link to="/legal">
                  <i className="fas fa-balance-scale"></i> {t("footer.legal")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t("footer.contact")}</h3>
            <ul>
              <li>
                <Link to="/advertising">
                  <i className="fas fa-bullhorn"></i> {t("advertising.title")}
                </Link>
              </li>
              <li>
                <Link to="/faq">
                  <i className="fas fa-question-circle"></i> {t("footer.faq")}
                </Link>
              </li>
            </ul>
            <div className="social-media">
              <a
                href="https://facebook.com"
                aria-label={`Facebook ${t("footer.followUs")}`}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                aria-label={`Twitter ${t("footer.followUs")}`}
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                aria-label={`Instagram ${t("footer.followUs")}`}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://youtube.com"
                aria-label={`YouTube ${t("footer.followUs")}`}
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://discord.com"
                aria-label={`Discord ${t("footer.followUs")}`}
              >
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t("footer.copyright")}</p>
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

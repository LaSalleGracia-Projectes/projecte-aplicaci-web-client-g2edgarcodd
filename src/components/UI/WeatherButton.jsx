import React, { useState, useEffect } from "react";
import WeatherWidget from "./WeatherWidget";
import { useLanguage } from "../../contexts/LanguageContext";
import "../../styles/components/weatherButton.css";

function WeatherButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDayTime, setIsDayTime] = useState(true);
  const { t } = useLanguage();

  // Función para detectar scroll
  const toggleVisibility = () => {
    const scrolled = window.scrollY;
    if (scrolled > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Abrir/cerrar el widget
  const toggleWeatherWidget = () => {
    setIsOpen((prev) => !prev);
  };

  // Detectar si es día o noche para cambiar el icono
  useEffect(() => {
    const checkDayTime = () => {
      // Método 1: Verificar la hora actual
      const currentHour = new Date().getHours();
      // Consideramos que es de día entre las 6am y las 8pm
      setIsDayTime(currentHour >= 6 && currentHour < 20);
    };

    checkDayTime();
    // Actualizar cada hora
    const interval = setInterval(checkDayTime, 3600000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Comprobar posición inicial
    toggleVisibility();

    // Usar tanto scroll como touchmove para mejor detección
    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("touchmove", toggleVisibility);

    // Forzar una comprobación después de que la página se cargue completamente
    const timer = setTimeout(() => {
      toggleVisibility();
    }, 500);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("touchmove", toggleVisibility);
      clearTimeout(timer);
    };
  }, []);

  // Recibir información del clima desde el widget
  const handleWeatherData = (weatherData) => {
    if (weatherData && weatherData.weather) {
      setIsDayTime(weatherData.weather.isDayTime);
    }
  };

  return (
    <div className={`weather-chatbot-container ${isVisible ? "visible" : ""}`}>
      {isOpen && (
        <div className="weather-widget-container chatbot-style">
          <WeatherWidget onWeatherDataReceived={handleWeatherData} />
        </div>
      )}
      <button
        className={`weather-button ${isOpen ? "active" : ""}`}
        onClick={toggleWeatherWidget}
        aria-label={t("weather.viewWeather")}
      >
        <i
          className={`fas ${
            isOpen ? "fa-times" : isDayTime ? "fa-cloud-sun" : "fa-cloud-moon"
          }`}
        ></i>
      </button>
    </div>
  );
}

export default WeatherButton;

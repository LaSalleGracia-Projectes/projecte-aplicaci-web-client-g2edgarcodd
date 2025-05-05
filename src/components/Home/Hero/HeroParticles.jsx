import React, { useEffect, useRef, useState } from "react";

const HeroParticles = ({ activeSlide }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [previousSlide, setPreviousSlide] = useState(activeSlide);
  const [showingParticles, setShowingParticles] = useState(false);

  // Configuración personalizada por slide
  const themeBySlide = [
    {
      // Dune - Partículas doradas/arena
      count: 150,
      colors: ["#FFD700", "#FFC107", "#FFB300", "#FFA000"],
      size: { min: 1, max: 4 },
      speed: { min: 1, max: 3 },
      opacity: { min: 0.3, max: 0.9 },
    },
    {
      // 3 Body Problem - Partículas azules/tecnológicas
      count: 180,
      colors: ["#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5"],
      size: { min: 1, max: 3 },
      speed: { min: 1, max: 3.5 },
      opacity: { min: 0.3, max: 0.9 },
    },
    {
      // Oppenheimer - Partículas rojas/naranjas como chispas
      count: 170,
      colors: ["#FF5722", "#F4511E", "#E64A19", "#D84315"],
      size: { min: 1, max: 4 },
      speed: { min: 1, max: 3.2 },
      opacity: { min: 0.3, max: 0.9 },
    },
  ];

  // Función para crear partículas de explosión
  const createExplosionParticles = () => {
    const { width, height } = dimensions;
    const theme = themeBySlide[activeSlide] || themeBySlide[0];
    const explosionParticles = [];

    // Generar partículas desde el centro
    const centerX = width / 2;
    const centerY = height / 2;

    // Crear partículas de explosión
    for (let i = 0; i < theme.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * width * 0.5;
      const size = Math.random() * (theme.size.max * 1.5) + theme.size.min;
      const color =
        theme.colors[Math.floor(Math.random() * theme.colors.length)];

      explosionParticles.push({
        x: centerX + Math.cos(angle) * (Math.random() * 30),
        y: centerY + Math.sin(angle) * (Math.random() * 30),
        size,
        color,
        opacity:
          Math.random() * (theme.opacity.max - theme.opacity.min) +
          theme.opacity.min,
        speedX:
          Math.cos(angle) * (Math.random() * theme.speed.max + theme.speed.min),
        speedY:
          Math.sin(angle) * (Math.random() * theme.speed.max + theme.speed.min),
        initialSize: size,
        pulse: Math.random() > 0.7,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        life: 100, // Tiempo de vida
        initialLife: 100,
        fadeSpeed: Math.random() * 0.8 + 0.2, // Velocidad de desvanecimiento variable
      });
    }

    return explosionParticles;
  };

  // Maneja la animación de las partículas
  const animate = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = dimensions;

    ctx.clearRect(0, 0, width, height);

    // Filtrar partículas expiradas
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    // Si no hay partículas, detener la animación
    if (particlesRef.current.length === 0) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      setShowingParticles(false);
      return;
    }

    // Animación de las partículas
    particlesRef.current.forEach((particle) => {
      // Reducir vida
      particle.life -= particle.fadeSpeed;

      // Ajustar opacidad basada en vida
      const lifeRatio = particle.life / particle.initialLife;
      const currentOpacity = lifeRatio * particle.opacity;

      // Actualizar posición
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Reducir velocidad gradualmente
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;

      // Efecto de pulso (algunas partículas)
      if (particle.pulse) {
        if (particle.size > particle.initialSize * 1.5) {
          particle.pulseDirection = -1;
        } else if (particle.size < particle.initialSize * 0.5) {
          particle.pulseDirection = 1;
        }
        particle.size += particle.pulseDirection * 0.05;
      }

      // Dibujar partículas
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(currentOpacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.fill();
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  // Detectar cambio de slide para crear la explosión
  useEffect(() => {
    if (previousSlide !== activeSlide && dimensions.width > 0) {
      // Crear nueva explosión de partículas
      const explosionParticles = createExplosionParticles();
      particlesRef.current = explosionParticles;

      // Activar la animación si no está activa
      if (!showingParticles) {
        setShowingParticles(true);
        if (!requestRef.current) {
          requestRef.current = requestAnimationFrame(animate);
        }
      }

      setPreviousSlide(activeSlide);
    }
  }, [activeSlide, dimensions]);

  // Actualiza el tamaño del canvas cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const { offsetWidth, offsetHeight } =
        canvas.parentElement || document.body;

      // Ajustar para dispositivos de alta densidad de píxeles (HiDPI/Retina)
      const dpr = window.devicePixelRatio || 1;
      canvas.width = offsetWidth * dpr;
      canvas.height = offsetHeight * dpr;
      canvas.style.width = `${offsetWidth}px`;
      canvas.style.height = `${offsetHeight}px`;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      setDimensions({
        width: offsetWidth,
        height: offsetHeight,
      });
    };

    // Llamar al resize inicial
    if (canvasRef.current) {
      setTimeout(handleResize, 100);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Limpiar animación cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" />;
};

export default HeroParticles;

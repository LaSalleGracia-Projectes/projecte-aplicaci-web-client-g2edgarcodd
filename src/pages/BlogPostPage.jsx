import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BlogPost from "../components/Blog/BlogPost";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/blogPost.css";

function BlogPostPage({ initialPageLoad, globalLoading }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Evitar iniciar la carga si hay una transición global en curso
    if (globalLoading) return;

    // Simular carga de datos del blog
    setIsLoading(true);

    // Timeout para simular carga de red
    setTimeout(() => {
      // Aquí normalmente harías una llamada a la API
      try {
        // Post de muestra
        const blogPost = {
          id: postId,
          title:
            "El impacto del cine de ciencia ficción en la cultura contemporánea",
          coverImage:
            "https://source.unsplash.com/random/1200x600/?scifi,movie",
          publishDate: "2024-04-15",
          readTime: "12 min",
          author: {
            id: "auth1",
            name: "Laura Martínez",
            avatar: null,
            bio: "Crítica de cine y escritora especializada en ciencia ficción y fantasía. Ha publicado artículos en revistas especializadas como 'Film Quarterly' y 'Sight & Sound'.",
            role: "Editora de Contenidos",
            socialLinks: {
              twitter: "https://twitter.com/lauramartinez",
              instagram: "https://instagram.com/laura_martinez_cine",
            },
          },
          excerpt:
            "Un análisis profundo sobre cómo las películas de ciencia ficción han moldeado nuestra visión del futuro y reflexionado sobre el presente.",
          content: `
            <h2 id="introduccion">Introducción: El género que imaginó nuestro futuro</h2>
            <p>Desde sus inicios con "Viaje a la Luna" de Georges Méliès en 1902, la ciencia ficción cinematográfica ha sido mucho más que un simple entretenimiento. Este género ha funcionado como un espejo especulativo de nuestras sociedades, anticipándose a cambios tecnológicos y cuestionando constantemente nuestra relación con la ciencia y el progreso.</p>
            <p>En este artículo exploraremos cómo las narrativas de ciencia ficción han evolucionado a lo largo de las décadas, desde las utopías tecnológicas de los años 50 hasta las distopías corporativas de principios del siglo XXI, pasando por las obras revolucionarias de la Nueva Ola de los 70.</p>
            
            <h2 id="obrasSeminales">Las obras seminales que definieron el género</h2>
            <figure class="blog-figure">
              <img src="https://source.unsplash.com/random/800x450/?2001spaceodyssey" alt="2001: Odisea del Espacio" />
              <figcaption>2001: Odisea del Espacio (1968) revolucionó la forma de representar el espacio en el cine.</figcaption>
            </figure>
            <p>Películas como "Metrópolis" (1927) de Fritz Lang sentaron las bases visuales del género, mientras que "2001: Una Odisea del Espacio" (1968) de Stanley Kubrick elevó la ciencia ficción a la categoría de arte cinematográfico. Estas obras no solo innovaron en términos visuales y narrativos, sino que plantearon cuestiones fundamentales sobre la naturaleza humana y nuestro lugar en el universo.</p>
            <p>Es imposible hablar de ciencia ficción sin mencionar la influencia de "Blade Runner" (1982) de Ridley Scott, que fusionó el noir con elementos futuristas para crear una estética cyberpunk que sigue siendo referencia obligada hasta hoy.</p>
            
            <h2 id="tematicasRecurrentes">Temáticas recurrentes: El espejo de nuestros miedos</h2>
            <p>Si algo caracteriza a la ciencia ficción es su capacidad para procesar las ansiedades colectivas de cada época. Durante la Guerra Fría, el cine reflejó el miedo a la aniquilación nuclear y la paranoia hacia "el otro" en películas como "La invasión de los ladrones de cuerpos" (1956).</p>
            <p>En los años 70 y 80, con el auge del neoliberalismo, emergieron narrativas sobre corporaciones todopoderosas y la deshumanización del individuo. Películas como "Soylent Green" (1973) exploraron los peligros del capitalismo descontrolado y la sobrepoblación.</p>
            <p>Más recientemente, obras como "Her" (2013) o "Ex Machina" (2014) han abordado nuestra relación con la inteligencia artificial y el aislamiento social en la era digital, mientras que "Arrival" (2016) reflexiona sobre la comunicación y nuestra percepción del tiempo.</p>
            
            <h2 id="representacionTecnologica">La representación de la tecnología</h2>
            <figure class="blog-figure">
              <img src="https://source.unsplash.com/random/800x450/?technology,robot" alt="Representación de tecnología futurista" />
              <figcaption>Las visiones sobre la tecnología han oscilado entre el optimismo utópico y el pesimismo distópico.</figcaption>
            </figure>
            <p>La forma en que el cine de ciencia ficción ha representado la tecnología resulta fascinante. Desde las máquinas omnipotentes y amenazantes de "Terminator" (1984) hasta los dispositivos que amplían nuestras capacidades en "Minority Report" (2002), estas narrativas han influido incluso en el desarrollo tecnológico real.</p>
            <p>No es casualidad que ingenieros de empresas como Apple o Microsoft citen películas de ciencia ficción como inspiración para sus invenciones. La pantalla táctil de "Minority Report" inspiró desarrollos en interfaces de usuario, mientras que el comunicador de "Star Trek" fue precursor conceptual de los teléfonos móviles plegables.</p>
            
            <h2 id="conclusiones">Conclusiones: Más allá del entretenimiento</h2>
            <p>El cine de ciencia ficción ha trascendido su condición de género de entretenimiento para convertirse en una herramienta de pensamiento crítico. A través de sus mundos especulativos, nos permite explorar posibilidades, advertir sobre peligros potenciales y, en última instancia, comprender mejor nuestra propia realidad.</p>
            <p>En un momento histórico donde la tecnología avanza a un ritmo vertiginoso y enfrentamos desafíos globales sin precedentes, estas narrativas resultan más relevantes que nunca. Nos recuerdan que la ficción no solo nos habla de mundos imaginarios, sino también de las posibilidades y responsabilidades del nuestro.</p>
            
            <h2 id="recomendaciones">Filmografía esencial para entender la evolución del género</h2>
            <ul class="blog-list">
              <li><strong>Metrópolis</strong> (1927) - Fritz Lang</li>
              <li><strong>2001: Una Odisea del Espacio</strong> (1968) - Stanley Kubrick</li>
              <li><strong>Solaris</strong> (1972) - Andrei Tarkovsky</li>
              <li><strong>Blade Runner</strong> (1982) - Ridley Scott</li>
              <li><strong>Matrix</strong> (1999) - Lana y Lilly Wachowski</li>
              <li><strong>Arrival</strong> (2016) - Denis Villeneuve</li>
            </ul>
          `,
          categories: ["Cine", "Sci-Fi", "Análisis"],
          tags: [
            "ciencia ficción",
            "cultura pop",
            "cine",
            "análisis",
            "tecnología",
          ],
          relatedPosts: [
            {
              id: "post2",
              title:
                "La evolución de los efectos especiales en el cine de fantasía",
              excerpt:
                "Desde los trucos de cámara hasta la CGI: un recorrido por la magia visual del cine.",
              coverImage:
                "https://source.unsplash.com/random/400x300/?fantasy,movie",
              publishDate: "2024-03-28",
              readTime: "9 min",
            },
            {
              id: "post3",
              title:
                "El renacimiento del cine de autor en la era de las plataformas",
              excerpt:
                "Cómo los servicios de streaming han creado un nuevo espacio para el cine independiente.",
              coverImage:
                "https://source.unsplash.com/random/400x300/?cinema,director",
              publishDate: "2024-04-05",
              readTime: "7 min",
            },
            {
              id: "post4",
              title:
                "Narrativas no lineales: cuando el cine juega con el tiempo",
              excerpt:
                "Un análisis de las estructuras temporales complejas en el cine contemporáneo.",
              coverImage:
                "https://source.unsplash.com/random/400x300/?time,clock",
              publishDate: "2024-04-10",
              readTime: "11 min",
            },
          ],
          comments: [
            {
              id: "comment1",
              authorName: "Carlos Vega",
              authorAvatar: null,
              date: "2024-04-16",
              content:
                "Excelente análisis sobre la evolución del género. Especialmente interesante la parte sobre cómo la tecnología mostrada en estas películas ha influido en desarrollos reales. Me pregunto si hay algún estudio académico que haya medido este impacto de manera más sistemática.",
              likes: 8,
            },
            {
              id: "comment2",
              authorName: "Marina Sánchez",
              authorAvatar: null,
              date: "2024-04-16",
              content:
                "Me gustaría que profundizaras más en el tema de la representación de género en la ciencia ficción. Ha habido una evolución interesante en los últimos años con películas como Arrival o Annihilation, que presentan protagonistas femeninas con una profundidad que antes era rara en el género.",
              likes: 12,
            },
            {
              id: "comment3",
              authorName: "David Mora",
              authorAvatar: null,
              date: "2024-04-17",
              content:
                "Blade Runner sigue siendo insuperable. La atmósfera, la música de Vangelis, la fotografía... Una obra maestra que definió la estética cyberpunk para siempre. La secuela también es extraordinaria en términos visuales.",
              likes: 5,
            },
          ],
        };

        setPost(blogPost);
        setIsLoading(false);
      } catch (err) {
        setError(t("errors.articleLoadFailed"));
        setIsLoading(false);
      }
    }, 1200);
  }, [postId, globalLoading, t]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <div className={`article-page ${!isLoading ? "content-loaded" : ""}`}>
        {!globalLoading && isLoading ? (
          <div className="article-loading">
            <p>{t("common.loading")}</p>
          </div>
        ) : error ? (
          <div className="article-error">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <h2>{t("errors.somethingWentWrong")}</h2>
            <p>{error}</p>
            <button className="back-button" onClick={handleBackClick}>
              <i className="fas fa-arrow-left"></i> {t("common.goBack")}
            </button>
          </div>
        ) : (
          !isLoading &&
          post && <BlogPost post={post} globalLoading={globalLoading} />
        )}
      </div>
    </MainLayout>
  );
}

export default BlogPostPage;

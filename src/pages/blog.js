import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Las 10 mejores películas de 2025 hasta ahora",
      excerpt: "Una mirada a las películas más impactantes que se han estrenado este año...",
      imageUrl: "/api/placeholder/400/200",
      date: "15 febrero, 2025",
      author: "María García"
    },
    {
      id: 2,
      title: "Entrevista exclusiva con el director de 'La Obra Maestra'",
      excerpt: "Hablamos con el aclamado director sobre su último proyecto y su visión del cine...",
      imageUrl: "/api/placeholder/400/200",
      date: "8 febrero, 2025",
      author: "Carlos Rodríguez"
    },
    {
      id: 3,
      title: "Análisis: El auge del cine independiente en la era del streaming",
      excerpt: "Cómo las plataformas de streaming están cambiando el panorama para los cineastas independientes...",
      imageUrl: "/api/placeholder/400/200",
      date: "5 febrero, 2025",
      author: "Ana Martínez"
    },
    {
      id: 4,
      title: "Reseña: 'El Camino del Héroe' - Una aventura épica moderna",
      excerpt: "Analizamos la última superproducción que está batiendo récords de taquilla...",
      imageUrl: "/api/placeholder/400/200",
      date: "1 febrero, 2025",
      author: "Luis Sánchez"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Blog de Cine y Series</h1>
        
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-background-light rounded-lg overflow-hidden shadow-lg transition duration-300 hover:shadow-xl hover:scale-102"
              >
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex justify-between items-center text-sm text-text-secondary mb-3">
                    <span>{post.date}</span>
                    <span>Por: {post.author}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3">
                    <a href={`/blog/${post.id}`} className="text-white hover:text-primary transition duration-200">
                      {post.title}
                    </a>
                  </h2>
                  
                  <p className="text-text-secondary mb-4">{post.excerpt}</p>
                  
                  <a 
                    href={`/blog/${post.id}`}
                    className="inline-block px-4 py-2 bg-primary text-background font-semibold rounded transition duration-200 hover:bg-primary-dark"
                  >
                    Leer más
                  </a>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-background-light text-primary font-semibold rounded transition duration-200 hover:bg-gray-700">
              Cargar más artículos
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaComments, FaHeart, FaRegComment, FaEye } from 'react-icons/fa';

export default function Foro() {
  const forumCategories = [
    { id: 1, name: "Discusión General", topics: 324, posts: 1872 },
    { id: 2, name: "Recomendaciones", topics: 156, posts: 983 },
    { id: 3, name: "Análisis y Críticas", topics: 201, posts: 1432 },
    { id: 4, name: "Noticias y Rumores", topics: 89, posts: 567 }
  ];
  
  const recentTopics = [
    {
      id: 1,
      title: "¿Cuál es la mejor película de ciencia ficción del año?",
      author: "CineFan42",
      date: "22 febrero, 2025",
      replies: 34,
      views: 256,
      likes: 18
    },
    {
      id: 2,
      title: "Teorías sobre el final de 'Mundos Paralelos'",
      author: "FilmAnalyst",
      date: "20 febrero, 2025",
      replies: 56,
      views: 412,
      likes: 42
    },
    {
      id: 3,
      title: "Recomendaciones de series similares a 'El Último Reino'",
      author: "SeriesMania",
      date: "18 febrero, 2025",
      replies: 28,
      views: 197,
      likes: 15
    },
    {
      id: 4,
      title: "Debate: ¿Adaptaciones literarias o guiones originales?",
      author: "Bookworm99",
      date: "15 febrero, 2025",
      replies: 47,
      views: 321,
      likes: 29
    }
  ];
  
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Foro de Cine y Series</h1>
            
            <button className="px-4 py-2 bg-primary text-background font-semibold rounded transition duration-200 hover:bg-primary-dark flex items-center gap-2">
              <FaComments />
              Nuevo Tema
            </button>
          </div>
          
          {/* Categorías del foro */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b border-background-light pb-2">
              Categorías
            </h2>
            
            <div className="overflow-hidden rounded-lg bg-background-light">
              {forumCategories.map((category, index) => (
                <div 
                  key={category.id}
                  className={`p-4 flex items-center justify-between ${
                    index < forumCategories.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-700 rounded-full p-3">
                      <FaComments className="text-primary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        <a href={`/foro/categorias/${category.id}`} className="hover:text-primary">
                          {category.name}
                        </a>
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {category.topics} temas · {category.posts} respuestas
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    href={`/foro/categorias/${category.id}`}
                    className="px-3 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-background transition duration-200"
                  >
                    Ver temas
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Temas recientes */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-background-light pb-2">
              Temas recientes
            </h2>
            
            <div className="overflow-hidden rounded-lg bg-background-light">
              {recentTopics.map((topic, index) => (
                <div 
                  key={topic.id}
                  className={`p-4 ${
                    index < recentTopics.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">
                      <a href={`/foro/temas/${topic.id}`} className="hover:text-primary">
                        {topic.title}
                      </a>
                    </h3>
                    <span className="text-sm text-text-secondary">{topic.date}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-text-secondary text-sm">
                      Por: <a href={`/perfil/${topic.author}`} className="text-primary hover:underline">{topic.author}</a>
                    </div>
                    
                    <div className="flex gap-4 text-text-secondary text-sm">
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {topic.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaRegComment />
                        {topic.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart />
                        {topic.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button className="px-4 py-2 bg-background-light text-text-secondary font-semibold rounded transition duration-200 hover:bg-gray-700">
                Ver más temas
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
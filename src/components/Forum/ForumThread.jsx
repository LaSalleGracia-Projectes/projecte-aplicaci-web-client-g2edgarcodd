import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/components/ForumThread.css';

function ForumThread() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    setIsLoading(true);
    // Simulamos una llamada a la API para obtener los detalles del tema
    setTimeout(() => {
      // Encontrar el tema con el ID correspondiente
      const threadId = parseInt(id);
      setThread(exampleThread);
      
      // Filtrar respuestas para este tema
      setReplies(exampleReplies);
      
      // Calcular páginas totales (5 respuestas por página)
      setTotalPages(Math.ceil(exampleReplies.length / 5));
      
      setIsLoading(false);
    }, 800);
  }, [id]);

  // Manejar cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar acciones en publicaciones (likes, dislikes, etc)
  const handleAction = (type, postId, isReply = false) => {
    if (isReply) {
      // Si es una respuesta
      setReplies(replies.map(reply => {
        if (reply.id === postId) {
          if (type === 'like') {
            if (reply.liked) {
              return { ...reply, likes: reply.likes - 1, liked: false };
            } else {
              // Si ya tenía dislike, lo quitamos
              const updatedDislikes = reply.disliked ? reply.dislikes - 1 : reply.dislikes;
              return { 
                ...reply, 
                likes: reply.likes + 1, 
                dislikes: updatedDislikes,
                liked: true, 
                disliked: false 
              };
            }
          } else if (type === 'dislike') {
            if (reply.disliked) {
              return { ...reply, dislikes: reply.dislikes - 1, disliked: false };
            } else {
              // Si ya tenía like, lo quitamos
              const updatedLikes = reply.liked ? reply.likes - 1 : reply.likes;
              return { 
                ...reply, 
                dislikes: reply.dislikes + 1, 
                likes: updatedLikes,
                disliked: true, 
                liked: false 
              };
            }
          }
        }
        return reply;
      }));
    } else {
      // Si es el post principal
      setThread(prevThread => {
        if (type === 'like') {
          if (prevThread.liked) {
            return { ...prevThread, likes: prevThread.likes - 1, liked: false };
          } else {
            // Si ya tenía dislike, lo quitamos
            const updatedDislikes = prevThread.disliked ? prevThread.dislikes - 1 : prevThread.dislikes;
            return { 
              ...prevThread, 
              likes: prevThread.likes + 1, 
              dislikes: updatedDislikes,
              liked: true, 
              disliked: false 
            };
          }
        } else if (type === 'dislike') {
          if (prevThread.disliked) {
            return { ...prevThread, dislikes: prevThread.dislikes - 1, disliked: false };
          } else {
            // Si ya tenía like, lo quitamos
            const updatedLikes = prevThread.liked ? prevThread.likes - 1 : prevThread.likes;
            return { 
              ...prevThread, 
              dislikes: prevThread.dislikes + 1, 
              likes: updatedLikes,
              disliked: true, 
              liked: false 
            };
          }
        }
        return prevThread;
      });
    }
  };

  // Manejar envío de respuestas
  const handleSubmitReply = (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;
    
    // Crear una nueva respuesta
    const newReply = {
      id: Date.now(),
      author: "Usuario Actual",
      authorRole: "Miembro",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      content: replyContent,
      timestamp: "Justo ahora",
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      level: 1
    };
    
    // Añadir la respuesta a la lista
    setReplies([newReply, ...replies]);
    
    // Actualizar el contador de respuestas del thread
    setThread(prevThread => ({
      ...prevThread,
      replies: prevThread.replies + 1
    }));
    
    // Resetear el formulario
    setReplyContent('');
    setShowReplyForm(false);
    
    // Asegurarse de que el usuario ve su respuesta
    setCurrentPage(1);
  };

  // Manejar compartir (simulado)
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Manejar reporte (simulado)
  const handleReport = () => {
    alert("Se ha enviado un reporte a los moderadores. Gracias por ayudar a mantener la comunidad.");
  };

  // Renderizar componente de carga
  if (isLoading) {
    return (
      <MainLayout>
        <div className="forum-thread-container">
          <div className="forum-thread-loading">
            <div className="forum-thread-spinner"></div>
            <p>Cargando tema...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si no se encontró el tema
  if (!thread) {
    return (
      <MainLayout>
        <div className="forum-thread-container">
          <div className="forum-thread-not-found">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Tema no encontrado</h2>
            <p>El tema que buscas no existe o ha sido eliminado.</p>
            <Link to="/forum" className="forum-thread-btn back">
              <i className="fas fa-arrow-left"></i> Volver al foro
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Filtrar respuestas para la página actual
  const repliesPerPage = 5;
  const paginatedReplies = replies.slice((currentPage - 1) * repliesPerPage, currentPage * repliesPerPage);

  return (
    <MainLayout>
      <div className="forum-thread-container">
        {/* Breadcrumbs */}
        <div className="forum-thread-breadcrumbs">
          <Link to="/forum"><i className="fas fa-home"></i> Foro</Link>
          <i className="fas fa-chevron-right"></i>
          <Link to={`/forum?category=${thread.category}`}>{thread.categoryName}</Link>
          <i className="fas fa-chevron-right"></i>
          <span>{thread.title}</span>
        </div>
        
        {/* Publicación principal */}
        <div className="forum-thread-main-post">
          <div className="forum-thread-post-header">
            <h1>{thread.title}</h1>
            <div className="forum-thread-post-meta">
              <span className="forum-thread-category">{thread.categoryName}</span>
              <span className="forum-thread-views"><i className="fas fa-eye"></i> {thread.views} vistas</span>
              <span className="forum-thread-replies"><i className="fas fa-comment"></i> {thread.replies} respuestas</span>
              <span className="forum-thread-date"><i className="fas fa-hourglass-half"></i> {thread.timestamp}</span>
            </div>
          </div>
          
          <div className="forum-thread-post-content">
            <div className="forum-thread-post-author">
              <img src={thread.avatarUrl} alt={thread.author} />
              <div className="forum-thread-author-info">
                <span className="forum-thread-author-name">{thread.author}</span>
                <span className="forum-thread-author-role">{thread.authorRole}</span>
                <span className="forum-thread-author-posts">
                  <i className="fas fa-pen-nib"></i> {thread.authorPosts} posts
                </span>
              </div>
            </div>
            
            <div className="forum-thread-post-body">
              <div className="forum-thread-post-text">
                {thread.content}
              </div>
              
              <div className="forum-thread-post-actions">
                <div className="forum-thread-voting">
                  <button 
                    className={`forum-thread-vote-btn like ${thread.liked ? 'active' : ''}`}
                    onClick={() => handleAction('like', thread.id)}
                  >
                    <i className="fas fa-thumbs-up"></i> {thread.likes}
                  </button>
                  <button 
                    className={`forum-thread-vote-btn dislike ${thread.disliked ? 'active' : ''}`}
                    onClick={() => handleAction('dislike', thread.id)}
                  >
                    <i className="fas fa-thumbs-down"></i> {thread.dislikes}
                  </button>
                </div>
                
                <div className="forum-thread-buttons">
                  <button 
                    className="forum-thread-action-btn reply"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <i className="fas fa-reply"></i> <span>Responder</span>
                  </button>
                  <button 
                    className="forum-thread-action-btn share"
                    onClick={handleShare}
                  >
                    <i className="fas fa-share-alt"></i> <span>Compartir</span>
                  </button>
                  <button 
                    className="forum-thread-action-btn report"
                    onClick={handleReport}
                  >
                    <i className="fas fa-flag"></i> <span>Reportar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Paginación de respuestas */}
        {totalPages > 1 && (
          <div className="forum-thread-pagination">
            <button 
              className="forum-thread-pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i> Anterior
            </button>
            
            <div className="forum-thread-pagination-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <span 
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            
            <button 
              className="forum-thread-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
        
        {/* Formulario de respuesta */}
        {showReplyForm && (
          <div className="forum-thread-reply-form">
            <h3>Escribe tu respuesta</h3>
            <form onSubmit={handleSubmitReply}>
              <textarea 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                required
              ></textarea>
              
              <div className="forum-thread-form-actions">
                <button 
                  type="button" 
                  className="forum-thread-btn cancel"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="forum-thread-btn submit"
                >
                  <i className="fas fa-paper-plane"></i> Publicar respuesta
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Respuestas */}
        <div className="forum-thread-replies">
          <h2>{thread.replies} respuestas</h2>
          
          {replies.length === 0 ? (
            <div className="forum-thread-no-replies">
              <i className="fas fa-comment-slash"></i>
              <p>Aún no hay respuestas en este tema.</p>
              <button 
                className="forum-thread-btn submit large"
                onClick={() => setShowReplyForm(true)}
              >
                <i className="fas fa-reply"></i> Sé el primero en responder
              </button>
            </div>
          ) : (
            <div className="forum-thread-replies-list">
              {paginatedReplies.map(reply => (
                <div key={reply.id} className={`forum-thread-reply ${reply.id === replies[0].id && currentPage === 1 ? 'new' : ''}`}>
                  <div className="forum-thread-post-author">
                    <img src={reply.avatarUrl} alt={reply.author} />
                    <div className="forum-thread-author-info">
                      <span className="forum-thread-author-name">{reply.author}</span>
                      <span className="forum-thread-author-role">{reply.authorRole}</span>
                    </div>
                  </div>
                  
                  <div className="forum-thread-reply-content">
                    <div className="forum-thread-reply-header">
                      <span className="forum-thread-date">
                        <i className="fas fa-hourglass-half"></i> {reply.timestamp}
                      </span>
                      
                      {reply.id === replies[0].id && currentPage === 1 && (
                        <span className="forum-thread-new-tag">Nueva</span>
                      )}
                    </div>
                    
                    <div className="forum-thread-post-text">
                      {reply.content}
                    </div>
                    
                    <div className="forum-thread-post-actions">
                      <div className="forum-thread-voting">
                        <button 
                          className={`forum-thread-vote-btn like ${reply.liked ? 'active' : ''}`}
                          onClick={() => handleAction('like', reply.id, true)}
                        >
                          <i className="fas fa-thumbs-up"></i> {reply.likes}
                        </button>
                        <button 
                          className={`forum-thread-vote-btn dislike ${reply.disliked ? 'active' : ''}`}
                          onClick={() => handleAction('dislike', reply.id, true)}
                        >
                          <i className="fas fa-thumbs-down"></i> {reply.dislikes}
                        </button>
                      </div>
                      
                      <div className="forum-thread-buttons">
                        <button 
                          className="forum-thread-action-btn reply"
                          onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                          <i className="fas fa-reply"></i> <span>Responder</span>
                        </button>
                        <button 
                          className="forum-thread-action-btn report"
                          onClick={handleReport}
                        >
                          <i className="fas fa-flag"></i> <span>Reportar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Paginación inferior */}
        {totalPages > 1 && (
          <div className="forum-thread-pagination bottom">
            <button 
              className="forum-thread-pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i> Anterior
            </button>
            
            <div className="forum-thread-pagination-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <span 
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            
            <button 
              className="forum-thread-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
        
        {/* Botón para volver */}
        <div className="forum-thread-final-actions">
          <Link to="/forum" className="forum-thread-btn back">
            <i className="fas fa-arrow-left"></i> Volver al foro
          </Link>
        </div>
      </div>
      
      {/* Modal para compartir */}
      {showShareModal && (
        <div className="forum-thread-modal" onClick={() => setShowShareModal(false)}>
          <div className="forum-thread-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="forum-thread-modal-header">
              <h3>Compartir este tema</h3>
              <button 
                className="forum-thread-modal-close"
                onClick={() => setShowShareModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="forum-thread-share-options">
              <div className="forum-thread-share-option facebook">
                <i className="fab fa-facebook"></i>
                <span>Facebook</span>
              </div>
              <div className="forum-thread-share-option twitter">
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </div>
              <div className="forum-thread-share-option whatsapp">
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </div>
              <div className="forum-thread-share-option telegram">
                <i className="fab fa-telegram"></i>
                <span>Telegram</span>
              </div>
              <div className="forum-thread-share-option reddit">
                <i className="fab fa-reddit"></i>
                <span>Reddit</span>
              </div>
              <div className="forum-thread-share-option mail">
                <i className="fas fa-envelope"></i>
                <span>Email</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

// Datos de ejemplo
const exampleThread = {
  id: 1,
  title: "¿Cuál es la mejor serie de ciencia ficción de todos los tiempos?",
  content: `Estoy buscando una buena serie de ciencia ficción para maratonear este fin de semana. ¿Cuáles me recomendarían como las mejores de todos los tiempos?

Ya he visto Battlestar Galactica y The Expanse, ambas me encantaron por diferentes razones. BSG tiene personajes increíbles y una trama filosófica fascinante, mientras que The Expanse tiene una construcción de mundo impresionante y efectos visuales de primera.

Busco algo que realmente valga la pena, con buena construcción de mundo, personajes interesantes y quizás un poco de política galáctica. No me importa si es algo antiguo o nuevo, solo que sea de calidad.

¿Alguna recomendación? ¿Y por qué creen que es la mejor?`,
  category: "series",
  categoryName: "Series",
  author: "CineExpert",
  authorRole: "Cinéfilo experto",
  authorPosts: 126,
  avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
  date: "5 Mar 2025",
  views: 452,
  replies: 28,
  likes: 67,
  dislikes: 3,
  liked: false,
  disliked: false,
  timestamp: "Hace 3 días"
};

const exampleReplies = [
  {
    id: 101,
    author: "SciFiFan42",
    authorRole: "Moderador",
    avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
    content: "Sin duda, mi recomendación sería Foundation basada en las novelas de Asimov. El worldbuilding es espectacular, con una escala épica que abarca milenios. La serie hace un trabajo increíble adaptando un material que muchos consideraban inadaptable.\n\nLo que me encanta es cómo explora conceptos de matemáticas predictivas sociales, el destino vs. libre albedrío y la caída de los imperios. Visualmente también es impresionante.",
    timestamp: "Hace 2 días",
    date: "6 Mar 2025",
    likes: 28,
    dislikes: 2,
    liked: false,
    disliked: false,
    level: 1
  },
  {
    id: 102,
    author: "StarTrekker",
    authorRole: "Miembro",
    avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    content: "Star Trek: Deep Space Nine sigue siendo insuperable en mi opinión. A diferencia de otras series de Star Trek que son más episódicas, DS9 tiene un arco narrativo que se desarrolla a lo largo de varias temporadas.\n\nExplora temas profundos como la guerra, la religión, la identidad y la política interestelar. Los personajes son complejos y evolucionan de forma notable. Y el Capitán Sisko es posiblemente el mejor capitán de Star Trek.",
    timestamp: "Hace 2 días",
    date: "6 Mar 2025",
    likes: 42,
    dislikes: 8,
    liked: false,
    disliked: false,
    level: 1
  },
  {
    id: 103,
    author: "CineExpert",
    authorRole: "Cinéfilo experto",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "¡Gracias por las sugerencias! Foundation está en mi lista pero no la he empezado aún. ¿Crees que la adaptación hace justicia a los libros?",
    timestamp: "Hace 1 día",
    date: "7 Mar 2025",
    likes: 5,
    dislikes: 0,
    liked: false,
    disliked: false,
    level: 2
  },
  {
    id: 104,
    author: "SciFiFan42",
    authorRole: "Moderador",
    avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
    content: "Es una adaptación bastante libre, añade nuevos personajes y tramas, pero mantiene la esencia de las ideas de Asimov. Creo que era necesario para adaptar algo tan conceptual al medio visual. Te la recomiendo mucho, especialmente si te gustó The Expanse.",
    timestamp: "Hace 20 horas",
    date: "7 Mar 2025",
    likes: 7,
    dislikes: 1,
    liked: false,
    disliked: false,
    level: 3
  },
  {
    id: 105,
    author: "WhoFan",
    authorRole: "Miembro",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "No puedo creer que nadie haya mencionado Doctor Who. Con más de 50 años de historia, ha sentado muchas bases del género. Lo que más me gusta es cómo puede ser tan diversa: un episodio puede ser de terror, el siguiente comedia, luego ciencia dura, etc.\n\nAdemás, el concepto de regeneración permite que la serie se reinvente constantemente. Si no la has visto, te recomiendo empezar con la era de David Tennant.",
    timestamp: "Hace 22 horas",
    date: "7 Mar 2025",
    likes: 19,
    dislikes: 4,
    liked: false,
    disliked: false,
    level: 1
  },
  {
    id: 106,
    author: "FarscapeLover",
    authorRole: "Miembro",
    avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
    content: "Farscape es una joya infravalorada. Un astronauta moderno catapultado a través de un agujero de gusano a una parte lejana de la galaxia, rodeado de criaturas alienígenas creadas por Jim Henson's Creature Shop.\n\nLo que la hace especial es lo rara que es: toma riesgos narrativos y visuales que otras series no se atreverían. Los personajes son profundamente imperfectos pero entrañables. Si buscas algo único, esta es tu serie.",
    timestamp: "Hace 18 horas",
    date: "7 Mar 2025",
    likes: 15,
    dislikes: 1,
    liked: false,
    disliked: false,
    level: 1
  },
  {
    id: 107,
    author: "SolarisFan",
    authorRole: "Nuevo miembro",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    content: "Aunque es más reciente, Dark merece un lugar entre las mejores. Esta serie alemana de Netflix es una obra maestra del sci-fi con viajes en el tiempo. \n\nTiene una narrativa increíblemente compleja pero coherente, personajes con profundidad y un ambiente visual oscuro y cautivador. Es de esas series que te hace pensar y conectar puntos constantemente.",
    timestamp: "Hace 12 horas",
    date: "8 Mar 2025",
    likes: 23,
    dislikes: 2,
    liked: false,
    disliked: false,
    level: 1
  }
];

export default ForumThread;
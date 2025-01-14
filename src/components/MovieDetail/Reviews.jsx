import React, { useState } from 'react';

// Datos simulados para reseñas
const reviewsData = [
  {
    id: 1,
    userName: "CineFan87",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.5,
    date: "2023-11-15",
    content: "Una película impresionante con efectos visuales de primer nivel. La trama es cautivadora y los personajes tienen un desarrollo profundo. Definitivamente una de las mejores del año."
  },
  {
    id: 2,
    userName: "MovieLover23",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    date: "2023-11-10",
    content: "Obra maestra del cine contemporáneo. La dirección es impecable y la banda sonora complementa perfectamente cada escena. No puedo esperar a verla de nuevo."
  },
  {
    id: 3,
    userName: "CriticoProfesional",
    userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4,
    date: "2023-11-05",
    content: "A pesar de algunos problemas menores con el ritmo en el segundo acto, la película ofrece una experiencia cinematográfica excepcional con actuaciones memorables."
  }
];

function Reviews({ movieId }) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState(reviewsData);
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (userRating === 0) {
      alert('Por favor, selecciona una calificación');
      return;
    }
    
    if (reviewText.trim() === '') {
      alert('Por favor, escribe una reseña');
      return;
    }
    
    const newReview = {
      id: Date.now(),
      userName: "Usuario",
      userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      content: reviewText
    };
    
    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setReviewText('');
  };
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`${i <= rating ? 'fas' : 'far'} fa-star`}
        ></i>
      );
    }
    return stars;
  };
  
  return (
    <div className="movie-reviews">
      <div className="write-review">
        <h3>Escribe una reseña</h3>
        <div className="rating-selector">
          <p>Tu calificación:</p>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <i 
                key={star} 
                className={`${star <= (hoverRating || userRating) ? 'fas' : 'far'} fa-star`}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              ></i>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmitReview}>
          <textarea 
            placeholder="Comparte tus pensamientos sobre esta película..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
          ></textarea>
          <button type="submit" className="submit-review-btn">
            Publicar reseña
          </button>
        </form>
      </div>
      
      <div className="reviews-list">
        <h3>Reseñas de usuarios</h3>
        
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <img 
                  src={review.userAvatar} 
                  alt={review.userName} 
                  className="reviewer-avatar" 
                />
                <div>
                  <h4 className="reviewer-name">{review.userName}</h4>
                  <p className="review-date">{review.date}</p>
                </div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="review-content">{review.content}</p>
            <div className="review-actions">
              <button className="review-action-btn">
                <i className="far fa-thumbs-up"></i> Útil
              </button>
              <button className="review-action-btn">
                <i className="far fa-comment"></i> Comentar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
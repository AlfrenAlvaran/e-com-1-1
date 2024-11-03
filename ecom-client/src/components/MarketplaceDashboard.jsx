import React, { useState, useEffect } from 'react';
import { getUserType } from '../utils/auth'; // Assume this utility retrieves the user type from local storage or API
import '../style/dashboard.css';

const MarketplaceDashboard = () => {
  const [userType, setUserType] = useState('');
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [sellerName, setSellerName] = useState('');
  const [chatVisible, setChatVisible] = useState({});
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState({});
  const [comments, setComments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');

  const url = 'http://localhost:3000/'
  const token = localStorage.getItem('token')

  const fetchMessage = async (id) => {
    try {
      const res = await fetch(`${url}api/messages/${id}`);
      if (res.ok) {
        const message = await res.json()
        setChatMessages(prev => ({
          ...prev,
          [id]: message || []
        }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const fetchComments = async (id) => {
    try {
      const response = await fetch(`api/comments/${id}`)
      if (response.ok) {
        const comments = await response.json()
        setComments(prev => ({
          ...prev,
          [id]: comments
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }



  const toggleChat = (id) => {
    setChatVisible(visible => (
      {
        ...visible,
        [id]: !visible[id]
      }
    ))
    if (!chatMessages[id]) {
      fetchMessage(id);
    }
  }

  useEffect(() => {
    const type = getUserType();
    setUserType(type);

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        console.log("Fetched products:", data)
        setPosts(data);
        data.forEach((post) => {
          fetchMessage(post._id)

        })
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        try {
          const response = await fetch(`http://localhost:3000/api/products/search?query=${searchQuery}`);
          const data = await response.json();
          setFilteredPosts(data);
        } catch (error) {
          console.error('Error searching products:', error);
        }
      } else {
        setFilteredPosts(posts);
      }
    };

    fetchSearchResults();
  }, [searchQuery, posts]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      console.log("no file")
    }
    try {
      const uploadResponse = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }
      const uploadResult = await uploadResponse.json();
      const productData = {
        title,
        description,
        file: uploadResult?.filename,
        sellerName,
      };

      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts(prevPosts => [...prevPosts, savedPost]);
        setFilteredPosts(prevFilteredPosts => [...prevFilteredPosts, savedPost]);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
    setTitle('');
    setDescription('');
    setFile(null);
    setSellerName('');
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const commentText = e.target.elements.comment.value;
    if (!postId || !commentText) {
      console.error("postId or message is undefined");
      return;
    }
    if (!token) {
      console.error("No token provided");
      return;
    }
    try {
      const response = await fetch(`${url}api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText })
      })

      if (response.ok) {
        const comments = await response.json();
        setComments(prev => {
          if (!prev || typeof prev !== 'object') return {};
          return {
            ...prev,
            [postId]: [...(prev[postId] || []), comments]
          }
        })
      } else {
        const errorResponse = await response.json();
        console.error("Error details:", errorResponse.message);
      }
      e.target.reset();
    } catch (error) {
      console.log(error)
    }
  };

  const handleChatSubmit = async (postId, e) => {
    e.preventDefault();
    const message = chatInput[postId];
    if (!postId || !message) {
      console.error("postId or message is undefined");
      return;
    }
    if (!token) {
      console.error("No token provided");
      return;
    }
    try {
      const response = await fetch(`${url}api/messages/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: message }),
      })
      if (response.ok) {
        const newMessage = await response.json()
        setChatMessages(prev => {
          if (!prev || typeof prev !== "object") return {};
          return {
            ...prev,
            [postId]: [...(prev[postId] || []), newMessage]
          };
        });
        setChatInput({ ...chatInput, [postId]: '' })
      } else {
        console.log("Error Send message")
        const errorResponse = await response.json();
        console.error("Error details:", errorResponse.message);
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleReviewSubmit = async (postId, e) => {
    e.preventDefault();
    const reviewText = e.target.elements.review.value;
    const rating = e.target.elements.rating.value;
    // setReviews(prevReviews => ({
    //   ...prevReviews,
    //   [postId]: [...(prevReviews[postId] || []), reviewText],
    // }));
    // setRatings(prevRatings => ({
    //   ...prevRatings,
    //   [postId]: [...(prevRatings[postId] || []), rating],
    // }));
    try {
      const response = await fetch(`${url}api/reviews/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: reviewText, rating: rating })
      })

      if (response.ok) {
        const newRatings = await response.json()
        setRatings(prev => {
          if (!prev || typeof prev !== "object") return {}
          return {
            ...prev,
            [postId]: [...(prev[postId] || []), rating]
          }
        })

        setReviews(prev => {
          if (!prev || typeof prev !== "object") return {}
          return {
            ...prev,
            [postId]: [...(prev[postId] || []), rating]
          }
        })
      }
      e.target.reset();
    } catch (error) {

    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUserType('');
    window.location.href = '/login';
  };

  const handleBuyNow = (postId) => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    } else {
      setSelectedPost(postId);
      setShowPurchaseModal(true);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleShippingMethodChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handlePurchase = async () => {
    setShowPurchaseModal(false);
  };
  // filteredPosts.map((pos, i) => {
  //   console.log(pos)
  //   if (!pos) {
  //     console.log(i)
  //     return null
  //   }
  // })

  return (
    <div>

      <header>
        <h5>Second-Hand Marketplace</h5>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for items"
        />

        {userType === 'seller' && (
          <section>
            <h6>Post an Item</h6>
            <form onSubmit={handlePostSubmit}>
              <input
                type="text"
                placeholder="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              /><br /><br />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              /><br /><br />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                }}
                required
              /><br /><br />
              <input
                type="text"
                placeholder="Your Name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                required
              /><br /><br />
              <button type="submit">Post Item</button>
            </form>
          </section>
        )}

        <section>
          <h1>Available Items</h1>
          <div id="posts">
            {filteredPosts.map((post, index) => (

              <div className="post" key={index}>
                <h1>{post.title}</h1>
                <p>{post.description}</p>
                {post.file && <img src={`http://localhost:3000/uploads/${post.file}`} alt="Product" style={{ width: '50%', height: 'auto', borderRadius: '5px' }} />}
                <p>Sold by: {post.sellerName}</p>

                <h6>Comments</h6>
                <ul>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <li key={comment._id}>
                        <span>{comment.text}</span>
                      </li>
                    ))
                  ) : (
                    <li><span>No Comment</span></li>
                  )}
                </ul>

                <h5>Chat</h5>

                <ul>
                  {chatMessages[post._id]?.length > 0 ? (
                    chatMessages[post._id].map((msg) => (
                      <p key={msg._id}>
                        {msg.sender}:  {msg.text}
                      </p>
                    ))
                  ) : (
                    <li>No Message Yet</li>
                  )}
                </ul>

                <form onSubmit={(e) => handleChatSubmit(post._id, e)}>
                  <input
                    type="text"
                    value={chatInput[post._id]}
                    onChange={(e) => setChatInput({ ...chatInput, [post._id]: e.target.value })}
                  />
                  <button type="submit">Send</button>
                </form>



                {userType === 'buyer' && (
                  <form onSubmit={(e) => handleCommentSubmit(post._id, e)}>
                    <input type="text" name="comment" placeholder="Add a comment" />
                    <button type="submit">Comment</button>
                  </form>
                )}

                {/* Chat interface for messaging the seller */}
                {userType === 'buyer' && (
                  <div>
                    <button onClick={() => toggleChat(post._id)}>Chat</button>

                    {chatVisible[post._id] && (
                      <div>
                        <h6>Chat with {post.sellerName}</h6>

                        <form onSubmit={(e) => handleChatSubmit(post._id, e)}>
                          <input
                            type="text"
                            value={chatInput[post._id]}
                            onChange={(e) => setChatInput({ ...chatInput, [post._id]: e.target.value })}
                          />
                          <button type="submit">Send</button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Review and Rating section */}

                {userType === 'buyer' && (
                  <div>
                    <h6>Reviews and Ratings</h6>
                    <ul>
                      {/* {(reviews[post._id] || []).map((review, i) => (
                        <li key={i}>{review}</li>
                      ))} */}

                      {
                        post.reviews && post.reviews.length > 0 ? (
                          post.reviews.map(textReview => (
                            <li key={textReview._id}>
                              <span>{textReview.text}</span>
                            </li>
                          ))
                        ) : (
                          <li><span>No Rating</span></li>
                        )
                      }

                    </ul>

                    <p>Average Rating: {getAverageRating(post.reviews)}</p>

                    <form onSubmit={(e) => handleReviewSubmit(post._id, e)}>
                      <input type="text" name="review" placeholder="Add a review" />
                      <select name="rating">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button type="submit">Submit Review</button>
                    </form>
                  </div>
                )}
                {/* Buy Now button */}
                {userType === 'buyer' && (
                  <button onClick={() => handleBuyNow(post._id)}>Buy Now</button>
                )}

              </div>
            ))}
          </div>
        </section>

        {showPurchaseModal && (
          <div className="purchase-modal">
            <h12>Purchase Details</h12>
            <p>Product: {selectedPost && filteredPosts.find(post => post._id === selectedPost).title}</p>
            <p>Seller: {selectedPost && filteredPosts.find(post => post._id === selectedPost).sellerName}</p>
            <form>
              <label>Payment Method:</label>
              <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                <option value="gcash">GCash</option>
                <option value="paymaya">PayMaya</option>
                <option value="cod">Cash on Delivery</option>
              </select>
              <br />
              <label>Shipping Method:</label>
              <select value={shippingMethod} onChange={handleShippingMethodChange}>
                <option value="jt">J&T</option>
                <option value="flash">Flash Express</option>
              </select>
              <br />
              <button type="button" onClick={handlePurchase}>Purchase</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

// const getAverageRating = (postId, ratings) => {
//   const ratingsForPost = ratings[postId] || [];
//   if (ratingsForPost.length === 0) {
//     return 0;
//   }
//   const sum = ratingsForPost.reduce((acc, current) => acc + parseInt(current), 0);
//   return sum / ratingsForPost.length;
// };

// const getAverageRating = (postId, ratings) => {
//   const ratingsForPost = ratings[postId] || [];
//   if (ratingsForPost.length === 0) {
//     return 0;
//   }
//   const sum = ratingsForPost.reduce((acc, current) => {
//     const rating = Number(current);
//     return acc + (isNaN(rating) ? 0 : rating);
//   }, 0);
//   return sum / ratingsForPost.length;
// };

const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => {
    const rating = Number(review.rating);
    return acc + (isNaN(rating) ? 0 : rating);
  }, 0);

  return (sum / reviews.length).toFixed(1);
};

export default MarketplaceDashboard;
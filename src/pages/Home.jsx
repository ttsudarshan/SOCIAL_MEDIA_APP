import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PostCard from '../components/PostCard';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');

  useEffect(() => {
    fetchPosts();
  }, [orderBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(orderBy, { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>💪 Welcome to GymHub</h1>
        <p className="subtitle">Share your fitness journey, workout tips, and gym progress!</p>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="sort-select"
          >
            <option value="created_at">Newest First</option>
            <option value="upvotes">Most Upvotes</option>
          </select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found. Be the first to share your fitness journey!</p>
          <a href="/create" className="btn-primary">Create First Post</a>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
            upvotes: 0
          }
        ])
        .select();

      if (error) throw error;

      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <h1>Create a New Post</h1>
      <p className="subtitle">Share your fitness tips, progress, or ask the community!</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Post Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., My 6-month transformation, Best exercises for abs, etc."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content (Optional)</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your story, tips, or ask questions..."
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Image URL (Optional)</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <small>Paste a link to an image (progress pics, workout form, etc.)</small>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;

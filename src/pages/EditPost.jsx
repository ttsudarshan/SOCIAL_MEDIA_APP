import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        content: data.content || '',
        image_url: data.image_url || ''
      });
    } catch (error) {
      setError(error.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

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

    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url
        })
        .eq('id', id);

      if (error) throw error;

      alert('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      setError(error.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  return (
    <div className="edit-page">
      <h1>Edit Post</h1>
      <p className="subtitle">Update your post details below.</p>

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
            placeholder="Post title"
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
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
          <Link to={`/post/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditPost;

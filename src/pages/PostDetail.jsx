import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDistanceToNow } from 'date-fns';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
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
      setPost(data);
    } catch (error) {
      setError(error.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpvote = async () => {
    try {
      const newUpvotes = (post.upvotes || 0) + 1;
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: newUpvotes })
        .eq('id', id);

      if (error) throw error;

      setPost({ ...post, upvotes: newUpvotes });
    } catch (error) {
      alert('Failed to upvote: ' + error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: id,
            content: newComment
          }
        ])
        .select();

      if (error) throw error;

      setComments([...comments, data[0]]);
      setNewComment('');
    } catch (error) {
      alert('Failed to post comment: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      // Delete comments first
      await supabase.from('comments').delete().eq('post_id', id);
      
      // Delete post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Post deleted successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to delete post: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Post not found'}</div>
        <Link to="/" className="btn-secondary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-card">
        <div className="post-header">
          <h1>{post.title}</h1>
          <span className="post-timestamp">
            Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>

        {post.image_url && (
          <div className="post-image-container">
            <img src={post.image_url} alt={post.title} className="post-image" />
          </div>
        )}

        {post.content && (
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        )}

        <div className="post-actions">
          <button onClick={handleUpvote} className="btn-upvote">
            ⬆️ Upvote ({post.upvotes || 0})
          </button>
          <Link to={`/edit/${post.id}`} className="btn-edit">
            ✏️ Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            🗑️ Delete
          </button>
        </div>

        <div className="comments-section">
          <h2>💬 Comments ({comments.length})</h2>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              rows="3"
              className="comment-input"
            />
            <button type="submit" className="btn-primary">
              Post Comment
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <p className="comment-content">{comment.content}</p>
                  <span className="comment-time">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Link to="/" className="back-link">← Back to Home Feed</Link>
    </div>
  );
}

export default PostDetail;

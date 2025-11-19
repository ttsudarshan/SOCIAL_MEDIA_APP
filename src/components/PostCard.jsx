import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="post-card-header">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-time">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </span>
      </div>
      <div className="post-card-footer">
        <div className="upvote-count">
          <span className="upvote-icon">⬆️</span>
          <span>{post.upvotes || 0} upvotes</span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;

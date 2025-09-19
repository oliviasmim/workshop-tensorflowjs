import { useState } from 'react';
import { Comment } from '../types/product';
import { useToxicityDetection } from '../hooks/useToxicityDetection';

interface CommentSectionProps {
  productId: number;
}

export const CommentSection = ({ productId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      text: 'Great product! Really love the quality.',
      author: 'John D.',
      timestamp: new Date('2024-01-15'),
    },
    {
      id: '2',
      text: 'Fast delivery and exactly as described.',
      author: 'Sarah M.',
      timestamp: new Date('2024-01-12'),
    },
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [warning, setWarning] = useState('');
  const { checkToxicity, isLoading, error } = useToxicityDetection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setWarning('');
    
    try {
      const isToxic = await checkToxicity(newComment);
      
      if (isToxic) {
        setWarning('Comment contains inappropriate content. Please revise your message.');
        return;
      }
      
      // Add comment if not toxic
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: 'You',
        timestamp: new Date(),
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
      
    } catch (err) {
      setWarning('Failed to process comment. Please try again.');
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Comments</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          disabled={isLoading}
        />
        
        {warning && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            ⚠️ {warning}
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            ❌ {error}
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {isLoading ? '🤖 Loading TensorFlow.js model...' : '✅ ML toxicity detection ready'}
          </span>
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            )}
            {isLoading ? 'Analyzing with AI...' : 'Post Comment'}
          </button>
        </div>
      </form>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-muted-foreground">
                  {comment.timestamp.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

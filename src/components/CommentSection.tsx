import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Reply } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // TODO: Implement comment submission
    console.log("Submitting comment:", newComment);
    setNewComment("");
    setReplyTo(null);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 mt-4" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src="" />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Heart className="w-3 h-3" />
              {comment.likes}
            </button>
            {!isReply && (
              <button 
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Reply className="w-3 h-3" />
                답글
              </button>
            )}
          </div>
          
          {replyTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="답글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitComment}>
                  답글 작성
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글 {comments.length}개
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="space-y-3">
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              댓글 작성
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              첫 번째 댓글을 작성해보세요!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
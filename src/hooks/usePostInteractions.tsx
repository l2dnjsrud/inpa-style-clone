import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PostInteraction {
  id: string;
  views: number;
  likes: number;
  isLiked?: boolean;
}

export function usePostInteractions() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<Record<string, PostInteraction>>({});

  // Initialize all posts with 0 views and likes
  const resetAllCounters = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          views: 0, 
          likes: 0 
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all posts

      if (error) throw error;
      
      console.log('All view and like counters reset to 0');
      return true;
    } catch (error) {
      console.error('Error resetting counters:', error);
      return false;
    }
  };

  // Increment view count for a specific post
  const incrementViews = async (postId: string) => {
    try {
      // First get current views
      const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('views')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      const currentViews = currentPost?.views || 0;
      const newViews = currentViews + 1;

      // Update the database
      const { error } = await supabase
        .from('posts')
        .update({ views: newViews })
        .eq('id', postId);

      if (error) throw error;

      // Update local state
      setInteractions(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          id: postId,
          views: newViews,
          likes: prev[postId]?.likes || 0
        }
      }));

      return newViews;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return null;
    }
  };

  // Toggle like for a specific post
  const toggleLike = async (postId: string) => {
    if (!user) return null;

    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      // Get current post data
      const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      const currentLikes = currentPost?.likes || 0;
      let newLikes = currentLikes;
      let isLiked = false;

      if (existingLike) {
        // Unlike: remove like record and decrement counter
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;

        newLikes = Math.max(0, currentLikes - 1);
        isLiked = false;
      } else {
        // Like: create like record and increment counter
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (insertError) throw insertError;

        newLikes = currentLikes + 1;
        isLiked = true;
      }

      // Update post likes count
      const { error: updateError } = await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', postId);

      if (updateError) throw updateError;

      // Update local state
      setInteractions(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          id: postId,
          views: prev[postId]?.views || 0,
          likes: newLikes,
          isLiked
        }
      }));

      return { likes: newLikes, isLiked };
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    }
  };

  // Get interaction data for a specific post
  const getPostInteraction = async (postId: string) => {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select('views, likes')
        .eq('id', postId)
        .single();

      if (error) throw error;

      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        isLiked = !!likeData;
      }

      const interaction = {
        id: postId,
        views: post?.views || 0,
        likes: post?.likes || 0,
        isLiked
      };

      setInteractions(prev => ({
        ...prev,
        [postId]: interaction
      }));

      return interaction;
    } catch (error) {
      console.error('Error getting post interaction:', error);
      return null;
    }
  };

  // Get multiple posts interaction data
  const getMultiplePostInteractions = async (postIds: string[]) => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, views, likes')
        .in('id', postIds);

      if (error) throw error;

      let likedPosts: string[] = [];
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        
        likedPosts = likes?.map(like => like.post_id) || [];
      }

      const newInteractions: Record<string, PostInteraction> = {};
      posts?.forEach(post => {
        newInteractions[post.id] = {
          id: post.id,
          views: post.views || 0,
          likes: post.likes || 0,
          isLiked: likedPosts.includes(post.id)
        };
      });

      setInteractions(prev => ({
        ...prev,
        ...newInteractions
      }));

      return newInteractions;
    } catch (error) {
      console.error('Error getting multiple post interactions:', error);
      return null;
    }
  };

  return {
    interactions,
    resetAllCounters,
    incrementViews,
    toggleLike,
    getPostInteraction,
    getMultiplePostInteractions
  };
}
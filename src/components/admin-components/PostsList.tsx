import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/types/types';
import useCreateClerkSupabaseClient from '@/hooks/useCreateClerkSupabaseClient';


const POSTS_PER_PAGE = 10;

const fetchPosts = async (page: number): Promise<Post[]> => {
  const from = page * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;
  const supabase=useCreateClerkSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data as Post[];
};

const PostsList = () => {
  const [page, setPage] = useState(0);

  const { data: posts = [], isLoading, isError, error } = useQuery<Post[], Error>({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    keepPreviousData: true,
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(POSTS_PER_PAGE)].map((_, idx) => (
                <Skeleton key={idx} className="h-60 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="bg-muted/50">
                  <img
                    src={post.image_url}
                    alt={post.title || 'Post image'}
                    className="rounded-t-xl w-full max-h-60 object-cover"
                  />
                  <CardContent className="p-4">
                    {post.title && (
                      <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                    )}
                    {post.description && (
                      <p className="text-muted-foreground mb-2">{post.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Posted on {new Date(post.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          Previous
        </Button>

        <span className="text-muted-foreground">Page {page + 1}</span>

        <Button
          variant="outline"
          disabled={posts.length < POSTS_PER_PAGE}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <Separator />
    </div>
  );
};

export default PostsList;

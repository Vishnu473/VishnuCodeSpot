import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../utils/supabaseClient';
import { Calendar, Tag, ArrowLeft, Loader } from 'lucide-react';
import { Post } from '../types/BlogPosts';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        setError('Failed to load the blog post. It may have been removed or does not exist.');
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const formatDate = (dateString:string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex justify-center">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded dark:bg-red-900/20 dark:text-red-300 mb-6">
          {error}
        </div>
        <Link 
          to="/" 
          className="flex flex-row items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <p>Back to Home</p>
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded dark:bg-yellow-900/20 dark:text-yellow-300 mb-6">
          Post not found.
        </div>
        <Link 
          to="/" 
          className="flex flex-row items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-2 md:p-0">
      <Link 
        to="/" 
        className="flex flex-row items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-2 md:my-3"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <time>{formatDate(post.created_at || '')}</time>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose dark:prose-invert prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
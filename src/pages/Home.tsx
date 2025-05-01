import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Calendar, Tag, ChevronRight, Loader } from 'lucide-react';
import { Post } from '../types/BlogPosts';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-5xl font-bold mb-4">
          Welcome to DevBlog
        </h1>
        <p className="text-md md:text-lg text-gray-600 dark:text-gray-400">
          Insights and tutorials on web development and programming
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No blog posts found. Check back later!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="p-6">
                <Link to={`/post/${post.id}`} className="block">
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time>{formatDate(post.created_at || '')}</time>
                </div>

                <div className="prose dark:prose-invert prose-lg max-w-none mb-4 line-clamp-2">
                  <ReactMarkdown>{`${post.content.substring(0, 250)}${post.content.length > 250 ? '...' : ''}`}</ReactMarkdown>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={`/post/${post.id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition"
                >
                  Read more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
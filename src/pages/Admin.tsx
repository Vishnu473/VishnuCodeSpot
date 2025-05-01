import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Trash2, Edit, Check, X, Loader, Eye } from 'lucide-react';
import { Post } from '../types/BlogPosts';
import ReactMarkdown from 'react-markdown';
import MarkdownPreview from '../components/MarkDownPreview';

const AdminPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', content: '', tags: '' });
    setEditMode(false);
    setCurrentPostId(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const tagsArray = formData.tags 
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
      : [];

    try {
      if (editMode && currentPostId) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title.trim(),
            content: formData.content.trim(),
            tags: tagsArray,
          })
          .eq('id', currentPostId)
          .select();

        if (error) throw error;
        
        if (data) {
          setPosts(posts.map(post => post.id === currentPostId ? data[0] : post));
          resetForm();
        }
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: formData.title.trim(),
            content: formData.content.trim(),
            tags: tagsArray,
          }])
          .select();

        if (error) throw error;
        
        if (data) {
          setPosts([data[0], ...posts]);
          resetForm();
        }
      }
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'add'} post. Please try again.`);
      console.error(`Error ${editMode ? 'updating' : 'adding'} post:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.join(', ') : '',
    });
    setCurrentPostId(post.id);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const deletePost = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter(post => post.id !== id));
      
      if (currentPostId === id) {
        resetForm();
      }
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };

  const parsedTags = formData.tags
    ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold my-4 text-center">Blog Admin Dashboard</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center">
            <X className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          {editMode ? 'Edit Post' : 'Add New Post'}
        </h2>
        {previewMode ? (
        <div className="mb-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Preview</h3>
            <button
              onClick={togglePreview}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                      flex items-center space-x-1 text-sm"
            >
              <X className="h-4 w-4" />
              <span>Exit Preview</span>
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold mb-4">{formData.title || 'Untitled Post'}</h1>
            
            <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none mb-4">
              <MarkdownPreview content={formData.content || 'No content to preview'} />
            </div>
            
            {parsedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {parsedTags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) :
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent outline-none transition"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content (Markdown supported)
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here (Markdown supported)"
              rows={6}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent outline-none transition"
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. react, javascript, webdev (comma separated)"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={togglePreview}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                      flex items-center space-x-1"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 
                      rounded-md transition flex justify-center items-center space-x-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>{editMode ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{editMode ? 'Update Post' : 'Add Post'}</span>
                </>
              )}
            </button>
            
            {editMode && (
              <button 
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 
                        text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition
                        flex justify-center items-center space-x-2 focus:outline-none focus:ring-2 
                        focus:ring-gray-400 focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          Manage Existing Posts
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-10 text-gray-500 dark:text-gray-400">
            No blog posts found. Add your first post above!
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map((post) => (
              <li key={post.id} className="py-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-grow mb-3 sm:mb-0">
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <div className="prose dark:prose-invert prose-sm max-w-none mb-2 line-clamp-2">
                      <ReactMarkdown>{`${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}`}</ReactMarkdown>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEdit(post)}
                      className="p-2 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                      title="Edit post"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete post"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
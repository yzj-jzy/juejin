import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, getArticles } from '../fake-api'; // Assuming getCategories and getArticles are functions from fake-api

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [primaryCategoryId, setPrimaryCategoryId] = useState(null); // Primary category ID
  const [secondaryCategoryId, setSecondaryCategoryId] = useState(null); // Secondary category ID
  const [sortBy, setSortBy] = useState('hot'); // Default sort by hot
  const [categoriesData, setCategoriesData] = useState([]); // State to store categories data
  const [childCategories, setChildCategories] = useState([]); // State to store child categories
  const [page, setPage] = useState(1); // State to store current page
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [hasMore, setHasMore] = useState(true); // State to check if there are more articles to load
  const navigate = useNavigate();
  const { primaryCategoryId: primaryCategoryIdParam, secondaryCategoryId: secondaryCategoryIdParam } = useParams(); // Get primary and secondary category IDs from route params

  useEffect(() => {
    // Fetch categories data
    const fetchCategories = async () => {
      try {
        const result = await getCategories(); // Replace with actual API call
        if (result.code === 0) {
          setCategoriesData(result.data.categories);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch articles based on primary and secondary category IDs
    const fetchArticles = async () => {
      if (loading || !hasMore) return; // Prevent multiple requests if already loading or no more articles
      setLoading(true);
      
      try {
        let categoryId = primaryCategoryId; // Default to primary category ID
        if (secondaryCategoryId) {
          categoryId = secondaryCategoryId; // If secondary category ID is present, use it
        }

        // Call API to get articles based on category ID, sort order, and page
        const result = await getArticles(categoryId, sortBy, page); // Assuming getArticles supports pagination
        if (result.code === 0) {
          setArticles(prevArticles => [...prevArticles, ...result.data.articles]);
          if (result.data.articles.length === 0) {
            setHasMore(false); // No more articles to load
          }
        } else {
          throw new Error('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [primaryCategoryId, secondaryCategoryId, sortBy, page]);

  useEffect(() => {
    // Set primary and secondary category IDs based on route params
    if (primaryCategoryIdParam) {
      setPrimaryCategoryId(parseInt(primaryCategoryIdParam, 10));
      setSecondaryCategoryId(null); // Reset secondary category ID when primary changes
      const parentCategory = categoriesData.find(category => category.category_id === parseInt(primaryCategoryIdParam, 10));
      if (parentCategory) {
        setChildCategories(parentCategory.children || []);
      } else {
        setChildCategories([]);
      }
    }
    if (secondaryCategoryIdParam) {
      setSecondaryCategoryId(parseInt(secondaryCategoryIdParam, 10));
    }
  }, [primaryCategoryIdParam, secondaryCategoryIdParam, categoriesData]);

  const handlePrimaryCategoryClick = (newPrimaryCategoryId) => {
    setPrimaryCategoryId(newPrimaryCategoryId);
    const parentCategory = categoriesData.find(category => category.category_id === newPrimaryCategoryId);
    if (parentCategory) {
      setChildCategories(parentCategory.children || []);
    } else {
      setChildCategories([]);
    }
    setPage(1); // Reset page to 1 when category changes
    setArticles([]); // Clear articles when category changes
    setHasMore(true); // Reset hasMore when category changes
    navigate(`/juejin/${newPrimaryCategoryId}`); // Navigate to new primary category route
  };

  const handleSecondaryCategoryClick = (newSecondaryCategoryId) => {
    setSecondaryCategoryId(newSecondaryCategoryId);
    setPage(1); // Reset page to 1 when category changes
    setArticles([]); // Clear articles when category changes
    setHasMore(true); // Reset hasMore when category changes
    navigate(`/juejin/${primaryCategoryId}/${newSecondaryCategoryId}`); // Navigate to new secondary category route
  };

  const handleSortByClick = (newSortBy) => {
    setSortBy(newSortBy);
    setPage(1); // Reset page to 1 when sort order changes
    setArticles([]); // Clear articles when sort order changes
    setHasMore(true); // Reset hasMore when sort order changes
    if (secondaryCategoryId) {
      navigate(`/juejin/${primaryCategoryId}/${secondaryCategoryId}?sort=${newSortBy}`); // Navigate to new sort route with secondary category ID
    } else {
      navigate(`/juejin/${primaryCategoryId}?sort=${newSortBy}`); // Navigate to new sort route with primary category ID
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) { // Adjust the threshold as needed
        console.log('滚动到底部了');
        setPage(prevPage => prevPage + 1); // Load the next page
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading]);

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="flex mt-4 mb-2 bg-gray-50 p-2 border-t-4 border-b-4 border-gray-50">
        {categoriesData.map(category => (
          <button
            key={category.category_id}
            onClick={() => handlePrimaryCategoryClick(category.category_id)}
            className={`text-sm px-4 py-2 rounded ${primaryCategoryId === category.category_id ? 'text-blue-500' : 'text-gray-500'}`}
          >
            {category.category_name}
          </button>
        ))}
      </div>

      {childCategories.length > 0 && (
        <div className="flex space-x-2 mb-2">
          {childCategories.map(child => (
            <button
              key={child.category_id}
              onClick={() => handleSecondaryCategoryClick(child.category_id)}
              className={`text-xs rounded-3xl px-4 py-2 rounded ${secondaryCategoryId === child.category_id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {child.category_name}
            </button>
          ))}
        </div>
      )}

      <div className="article-page bg-white">
        <div className="flex space-x-2 mb-4 border-b border-gray-100">
          <button
            onClick={() => handleSortByClick('new')}
            className={`px-4 py-2 rounded ${sortBy === 'new' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            最新
          </button>
          <div className='mt-2 text-gray-100'>
            |
          </div>
          <button
            onClick={() => handleSortByClick('hot')}
            className={`px-4 py-2 rounded ${sortBy === 'hot' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            最热
          </button>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.article_info.id}
              className="flex border-b p-4 border-b rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => handleArticleClick(article.article_id)}
            >
              <div>
                <h2 className="text-md font-bold mb-2">{article.article_info.title}</h2>
                <h2 className="text-sm mb-2 text-gray-500">{article.article_info.brief_content}</h2>
                <div className="text-xs text-gray-500">
                  {article.author_user_info.user_name} | {article.article_info.view_count} views · {article.article_info.comment_count} comments
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && <div>加载中...</div>}
      </div>

    </div>
  );
};

export default Home;

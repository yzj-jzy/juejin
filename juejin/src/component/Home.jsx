import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getArticles } from '../fake-api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [sortBy, setSortBy] = useState('hot');
  const [categories, setCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles(categoryId, sortBy);
        if (result.code === 0) {
          setArticles(result.data.articles);
        } else {
          throw new Error('Failed to fetch articles');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticles();
  }, [categoryId, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.code === 0) {
          setCategories(result.data.categories);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (newCategoryId) => {
    setCategoryId(newCategoryId);
    if (newCategoryId < categories.length) {
      const selectedCategory = categories.find(category => category.category_id === newCategoryId);
      setChildCategories(selectedCategory ? selectedCategory.children || [] : []);
    }
  };

  const handleSortByClick = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="App">
      <div className="categoryTab">
        {categories.map(category => (
          <button
            key={category.category_id}
            onClick={() => handleCategoryClick(category.category_id)}
            className={categoryId === category.category_id ? 'active' : ''}
          >
            {category.category_name}
          </button>
        ))}
      </div>

      {childCategories.length > 0 && (
        <div className="childCategoryTab">
          {childCategories.map(child => (
            <button
              key={child.category_id}
              onClick={() => handleCategoryClick(child.category_id)}
              className={categoryId === child.category_id ? 'active' : ''}
            >
              {child.category_name}
            </button>
          ))}
        </div>
      )}

      <div className="sortByTab">
        <button onClick={() => handleSortByClick('new')} className={sortBy === 'new' ? 'active' : ''}> 最新 </button>
        <button onClick={() => handleSortByClick('hot')} className={sortBy === 'hot' ? 'active' : ''}> 最热 </button>
      </div>

      <div className="articles">
        {articles.map((article) => (
          <div key={article.article_info.id} className="article" onClick={() => handleArticleClick(article.article_id)}>
            <h2>{article.article_info.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

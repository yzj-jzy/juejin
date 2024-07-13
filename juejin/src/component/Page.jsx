import React, { useEffect, useState } from 'react';
import { getArticleById } from '../fake-api';
import { useParams } from 'react-router-dom';

const Home = () => {
  const param = useParams();
  const article_id = param.article_id;
  const [articleId, setArticleId] = useState(article_id);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticleById(articleId);
        if (result.code === 0) {
          setArticles(result.data.article);
        } else {
          throw new Error('Failed to fetch articles');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticles();
  }, []);


  return (
    <div className="App">
        
      <div dangerouslySetInnerHTML={{ __html: articles.article_content }} />
    </div>
  );
};

export default Home;

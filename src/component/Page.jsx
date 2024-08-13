import React, { useEffect, useState } from 'react';
import { getArticleById, getCommentsByArticleId } from '../fake-api';
import { useParams } from 'react-router-dom';

const Home = () => {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const result = await getArticleById(article_id);
        if (result.code === 0) {
          setArticle(result.data.article);
        } else {
          throw new Error('Failed to fetch article');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
  }, [article_id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await getCommentsByArticleId(article_id);
        if (result.code === 0) {
          setComments(result.data.comments);
        } else {
          throw new Error('Failed to fetch comments');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [article_id]);



  return (
    <div className="p-12 bg-gray-100">
      {article && comments && (
        <div>
          <h2 className="text-2xl font-bold mb-2 ">{article.article_info.title}</h2>
          <div className="mt-4 text-xs text-gray-500 ">
              {article.author_user_info.user_name}  - {article.author_user_info.description}
          </div>
        <div className='' dangerouslySetInnerHTML={{ __html: article.article_content }} />

        <div className='round-lg bg-white p-4 rounded-lg'> 
          <div className='text-2xl mb-4'>全部评论 {article.article_info.comment_count}</div>
            <div className='round-lg bg-white'>
              {comments.map((comment) => (
                <div className='mb-2'>
                  <div className='font-bold text-ls'>{comment.user_info.user_name} </div>
                  <div className='text-md' key={comment.comment_info.comment_id}>{comment.comment_info.comment_content}</div>
                  
                  { comment.reply_infos && comment.reply_infos.map((reply)=>(
                    <div className='ml-8 mb-2'> 
                    <div className='font-bold'>  {reply.user_info.user_name}</div>
                    <div>  {reply.reply_info.reply_content}</div>
                    </div>
                  ))}

                </div>
              ))}
            </div>
        </div> 

        </div>
      )}
      
    </div>
  );
};

export default Home;

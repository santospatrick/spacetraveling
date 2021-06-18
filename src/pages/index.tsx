import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextURL, setNextURL] = useState(postsPagination.next_page);

  const handleLoadMore = async (): Promise<void> => {
    window
      .fetch(nextURL)
      .then(response => response.json())
      .then(data => {
        setNextURL(data.next_page);
        setPosts(prevState => [...prevState, ...data.results]);
      });
  };

  return (
    <div className={commonStyles.container}>
      {posts.map(post => (
        <div key={post.uid} className={styles.post}>
          <Link href={`/post/${post.uid}`}>
            <a className={styles.postTitle}>{post.data.title}</a>
          </Link>
          <div className={styles.postSubtitle}>{post.data.subtitle}</div>
          <div className={styles.postFooter}>
            <div className={styles.postFooterItem}>
              <FiCalendar />
              <span>
                {format(parseISO(post.first_publication_date), 'd MMM Y', {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div className={styles.postFooterItem}>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
          </div>
        </div>
      ))}

      {nextURL && (
        <button
          type="button"
          onClick={handleLoadMore}
          className={styles.loadMore}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};

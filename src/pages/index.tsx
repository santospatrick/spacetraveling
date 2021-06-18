import { GetStaticProps } from 'next';
import Head from 'next/head';

import { FiCalendar, FiUser } from 'react-icons/fi';
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

export default function Home(): JSX.Element {
  const arr = [1, 2, 3];
  return (
    <div className={commonStyles.container}>
      {arr.map(() => (
        <div className={styles.post}>
          <div className={styles.postTitle}>Como utilizar Hooks</div>
          <div className={styles.postSubtitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </div>
          <div className={styles.postFooter}>
            <div className={styles.postFooterItem}>
              <FiCalendar />
              <span>15 Mar 2021</span>
            </div>
            <div className={styles.postFooterItem}>
              <FiUser />
              <span>Joseph Oliveira</span>
            </div>
          </div>
        </div>
      ))}

      <button type="button" className={styles.loadMore}>
        Carregar mais posts
      </button>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

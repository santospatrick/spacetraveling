import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import PrismicDOM from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const readTime = `${post.data.content.reduce((acc, next) => {
    return Math.ceil(
      acc +
        ((next.heading?.split(/\s+/)?.length || 0) +
          PrismicDOM.RichText.asText(next.body).split(/\s+/).length) /
          200
    );
  }, 0)} min`;
  const router = useRouter();

  if (router.isFallback) return <div>Carregando...</div>;

  return (
    <>
      <section className={styles.postBanner}>
        <img src={post.data.banner.url} alt="post banner" />
      </section>
      <main className={commonStyles.container}>
        <h1 className={styles.postTitle}>{post.data.title}</h1>
        <div className={commonStyles.postInfo}>
          <div className={commonStyles.postInfoItem}>
            <FiCalendar />
            <span>
              {format(parseISO(post.first_publication_date), 'd MMM Y', {
                locale: ptBR,
              })}
            </span>
          </div>
          <div className={commonStyles.postInfoItem}>
            <FiUser />
            <span>{post.data.author}</span>
          </div>
          <div className={commonStyles.postInfoItem}>
            <FiClock />
            <span>{readTime}</span>
          </div>
        </div>
        <div className={styles.postContent}>
          {post.data.content.map(content => (
            <div key={content.heading} className={styles.postRow}>
              <h2 className={styles.postHeading}>{content.heading}</h2>
              {parse(PrismicDOM.RichText.asHtml(content.body))}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );
  const paths = posts.results.map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'posts',
    context.params.slug as string,
    { lang: 'pt-BR' }
  );

  if (!response) return { notFound: true };

  return {
    props: {
      post: response,
    },
  };
};

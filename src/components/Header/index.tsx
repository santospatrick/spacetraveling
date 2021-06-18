import Link from 'next/link';
import headerStyles from './header.module.scss';
import styles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={headerStyles.container}>
      <div className={styles.container}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}

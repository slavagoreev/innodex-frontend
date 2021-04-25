import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from './Layout.module.scss';

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'InnoDEX App' }: Props) => (
  <div className={styles.layout}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav className={styles.layout__nav}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>

    </footer>
  </div>
)

export default Layout

import Head from 'next/head';
import React from 'react';

type MetaProps = {
  title: string;
  description: string;
  imageUrl?: string;
  timestamp?: string;
};

export function Meta({ title, description, imageUrl, timestamp }: MetaProps) {
  return (
    <Head>
      <title>Tall | {title}</title>
      <meta name="description" content={description} key="description" />
      <meta property="og:title" content={`TallSwap - ${title}`} key="title" />
      <meta property="og:description" content={description} key="ogdescription" />

      <meta name="twitter:site" content="@TallSwap" key="twittersite" />
      <meta
        property="twitter:card"
        content={imageUrl ? 'summary_large_image' : 'summary'}
        key="twittercard"
      />
      <meta name="twitter:title" content={title} key="twittertitle" />
      <meta name="twitter:description" content={description} key="twitterdescription" />
      {timestamp && <meta name="revised" content={timestamp} key="timestamp" />}
      <meta
        name="keywords"
        key="keywords"
        content="Decentralized Finance, DeFi, lending, borrowing, stablecoins, Ethereum, assets, erc-20, smart contracts, open finance, trustless"
      />
      <meta name="apple-mobile-web-app-title" content={`TallSwap`} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Head>
  );
}

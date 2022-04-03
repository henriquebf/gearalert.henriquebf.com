import type { NextPage } from 'next';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Container: NextPage<Props> = ({ children }) => {
  return (
    <div className="container">
      {children}
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Container;

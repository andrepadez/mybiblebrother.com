import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Body, Html, Head, Container, Tailwind } from '@react-email/components';
import { Text, Button, Img, Heading } from '@react-email/components';

const MainLayout = ({ children }) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-12 font-sans bg-white">
          <Container className="p-8 bg-white rounded-lg shadow-lg">
            <Img
              className="block mx-auto"
              src="https://app.pertento.ai/pertento_light.png"
              width="256"
              alt="Logo"
            />
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MainLayout;

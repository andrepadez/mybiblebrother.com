import React from 'react';
import Layout from './layouts/MainLayout.js';
import { Body, Html, Head, Container, Tailwind } from '@react-email/components';
import { Text, Button, Img, Heading } from '@react-email/components';

const Email = ({ email }) => {
  return (
    <Layout>
      <Container>
        <Text className="pt-4 text-2xl">We have finished processing your request.</Text>
        <Text>
          the Google Analytics data from {email || '<example@gmail.com>'} is now up to date on our
          platform
        </Text>
      </Container>
    </Layout>
  );
};

export default Email;

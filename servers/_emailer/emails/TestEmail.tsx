import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Container } from '@react-email/components';
import { Text, Button } from '@react-email/components';

const Email = ({ label }) => {
  return (
    <Layout>
      <Container>
        <Text className="pt-4 text-2xl">Hello Obi Wan here 🔥</Text>
        <Text>Here you go</Text>
        <Button href="https://developedbyed.com">{label || 'Check out the courses'}</Button>
      </Container>
    </Layout>
  );
};

export default Email;

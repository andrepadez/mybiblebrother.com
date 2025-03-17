import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Container } from '@react-email/components';
import { Text, Button } from '@react-email/components';

const Email = ({ firstName, lastName, email, url }) => {
  return (
    <Layout>
      <Container>
        <Text className="pt-4 text-2xl">
          Welcome, {firstName || '<firstName>'} {lastName || '<lastName>'}
        </Text>
        <Text className="text-xs">You can ignore this email if you didn't signup for our site.</Text>
        <Button href={url || 'https://example.com'}>Click here to Confirm your Registration</Button>
      </Container>
    </Layout>
  );
};

export default Email;

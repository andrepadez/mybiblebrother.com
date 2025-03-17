import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Container } from '@react-email/components';
import { Text, Button } from '@react-email/components';

const Email = ({ email, url }) => {
  return (
    <Layout>
      <Container>
        <Text className="pt-4 text-2xl">Password Reset</Text>
        <Text>A password reset was requested for your account {email || '<email>'}</Text>
        <Text>You can ignore this email if you didn't request a password reset.</Text>
        <Button href={url}>Click here to Reset your password</Button>
      </Container>
    </Layout>
  );
};

export default Email;

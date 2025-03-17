import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Container } from '@react-email/components';
import { Text, Button } from '@react-email/components';

const Email = ({ invitedBy, companyName, url }) => {
  return (
    <Layout>
      <Container>
        <Text className="pt-4 text-2xl">Invitation to our platform</Text>
        <Text>You have been invited by {invitedBy || '<invitedBy>'} to join Pertento.ai</Text>
        <Text>as a member of {companyName || '<companyName>'}</Text>
        <Button href={url || 'https://example.com'}>Click here to accept our invitation</Button>
      </Container>
    </Layout>
  );
};

export default Email;

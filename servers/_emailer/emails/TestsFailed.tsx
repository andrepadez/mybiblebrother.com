import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Container } from '@react-email/components';
import { Text, Button, Tailwind } from '@react-email/components';
import { CodeBlock, dracula } from '@react-email/code-block';

const Email = ({ stderr }) => {
  return (
    <Tailwind>
      <Container>
        <Text className="pt-4 text-5xl text-center">Tests have failed</Text>
        <CodeBlock code={stderr || sampleCode} theme={dracula} language="javascript" />
      </Container>
    </Tailwind>
  );
};

export default Email;

const sampleCode = `Failed with code 1
bun test v1.1.8 (89d25807)

src/index.test.ts:
(pass) Auth Server > should signin [99.65ms]
(pass) Auth Server > should return 200 [0.39ms]
27 |     const data = await response.json();
28 |     expect(data.pertentoAuthenticationServer).toBeTruthy();
29 |   });
30 | 
31 |   test('should return 401', async () => {
32 |     expect(true).toBeFalsy();
         ^
error: expect(received).toBeFalsy()

Received: true

      at /Users/andrepadez/develop/pertento/testing/auth-server/src/index.test.ts:32:5
      at /Users/andrepadez/develop/pertento/testing/auth-server/src/index.test.ts:31:29
(fail) Auth Server > should return 401 [0.25ms]

 2 pass
 1 fail
 5 expect() calls
Ran 3 tests across 1 files. [108.00ms]`;

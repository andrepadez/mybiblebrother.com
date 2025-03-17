import React from 'react';
import Layout from './layouts/MainLayout.jsx';
import { Container } from '@react-email/components';
import { Text, Section, Button, Tailwind } from '@react-email/components';
import { CodeBlock, dracula, coyWithoutShadows } from '@react-email/code-block';
import * as themes from '@react-email/code-block';

const Email = ({ serverName, timestamp, url, method, stack, body, message, headers, user }) => {
  return (
    <Tailwind>
      <Container className="max-w-[80%]">
        <Text className="pt-4 text-center text-5xl">Unexpected Error in Server</Text>
        <Text className="pt-4 text-center text-2xl">{serverName || 'Auth Server'}</Text>
        <CustomCodeBlock code={timestamp} />
        <CustomCodeBlock code={`${method || 'GET'}: ${url || 'http://auth.pertento.ai/'}`} />
        <CustomCodeBlock code={message || messageSample} />
        <CustomCodeBlock code={stack || stackSample} />
        {headers && <CustomCodeBlock code={`req.headers: ${JSON.stringify(headers, null, 2)}`} />}
        {user && <CustomCodeBlock code={`req.user = ${JSON.stringify(user, null, 2)}`} />}
        {body && <CustomCodeBlock code={`req.body =${JSON.stringify(body, null, 2)}`} />}
      </Container>
    </Tailwind>
  );
};

const CustomCodeBlock = ({ code }) => {
  return <CodeBlock code={` \n${code}\n\ `} theme={coyTheme} language="js" />;
};

export default Email;

const coyTheme = {
  base: {
    color: 'black',
    background: 'none',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    position: 'relative',
    borderLeft: '10px solid #358ccb',
    boxShadow: '-1px 0 0 0 #358ccb, 0 0 0 1px #dfdfdf',
    backgroundColor: '#fdfdfd',
    backgroundImage: 'linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%)',
    backgroundSize: '3em 3em',
    backgroundOrigin: 'content-box',
    backgroundAttachment: 'local',
    margin: '.5em 0',
    padding: '0 1em',
  },
  comment: {
    color: '#7D8B99',
  },
  'block-comment': {
    color: '#7D8B99',
  },
  prolog: {
    color: '#7D8B99',
  },
  doctype: {
    color: '#7D8B99',
  },
  cdata: {
    color: '#7D8B99',
  },
  punctuation: {
    color: '#5F6364',
  },
  property: {
    color: '#c92c2c',
  },
  tag: {
    color: '#c92c2c',
  },
  boolean: {
    color: '#c92c2c',
  },
  number: {
    color: '#c92c2c',
  },
  'function-name': {
    color: '#c92c2c',
  },
  constant: {
    color: '#c92c2c',
  },
  symbol: {
    color: '#c92c2c',
  },
  deleted: {
    color: '#c92c2c',
  },
  selector: {
    color: '#2f9c0a',
  },
  'attr-name': {
    color: '#2f9c0a',
  },
  string: {
    color: '#2f9c0a',
  },
  char: {
    color: '#2f9c0a',
  },
  function: {
    color: '#2f9c0a',
  },
  builtin: {
    color: '#2f9c0a',
  },
  inserted: {
    color: '#2f9c0a',
  },
  operator: {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
  },
  entity: {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
    cursor: 'help',
  },
  url: {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
  },
  variable: {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
  },
  atrule: {
    color: '#1990b8',
  },
  'attr-value': {
    color: '#1990b8',
  },
  keyword: {
    color: '#1990b8',
  },
  'class-name': {
    color: '#1990b8',
  },
  regex: {
    color: '#e90',
  },
  important: {
    color: '#e90',
    fontWeight: 'normal',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  namespace: {
    opacity: '.7',
  },
};

const stackSample = `Error: Something went wrong
at <anonymous> (/Users/andrepadez/develop/pertento/workspaces/servers/api-server/src/index.ts:9:1)
at <anonymous> (/Users/andrepadez/develop/pertento/node_modules/hono/dist/compose.js:29:28)
at dispatch (/Users/andrepadez/develop/pertento/node_modules/hono/dist/compose.js:7:15)
at <anonymous> (/Users/andrepadez/develop/pertento/workspaces/servers/_hono_server/src/middlewares/body-parser.ts:1:32)
at <anonymous> (/Users/andrepadez/develop/pertento/node_modules/hono/dist/compose.js:29:28)
at dispatch (/Users/andrepadez/develop/pertento/node_modules/hono/dist/compose.js:7:15)
at <anonymous> (/Users/andrepadez/develop/pertento/node_modules/hono/dist/middleware/cors/index.js:64:15)
at cors2 (/Users/andrepadez/develop/pertento/node_modules/hono/dist/middleware/cors/index.js:22:29)
at <anonymous> (/Users/andrepadez/develop/pertento/node_modules/hono/dist/compose.js:29:28)
at dispatch (/Users/andrepadez/develop/pertento/node_modules/hono/dist/compose.js:7:15)`;

const messageSample = `Error: Something went wrong`;

const bodySample = `{
  email: 'test.user@pertento.ai',
  password: 'some-long-ass-password',
  firstName: 'John',
  lastName: 'Wick Mock',
  companyName: 'Wick Industries',
  companyType: 'Agency',
}`;

const userSample = bodySample;

const headersSample = `{
  accept: "*/*",
  "accept-encoding": "gzip, deflate, br",
  connection: "keep-alive",
  host: "localhost:8001",
  "user-agent": "Bun/1.1.8",
}`;

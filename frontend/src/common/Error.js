import React from 'react';
import { Message } from 'semantic-ui-react'
import './styles/Error.scss';

const Error = ({ children, ...rest }) => (
  <Message negative {...rest}>
    <Message.Header>Error header</Message.Header>
    <p>{children}</p>
  </Message>
);

export default Error;
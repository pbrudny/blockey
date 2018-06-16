import React from 'react';
import Error from './Error';

/**
 * Axios when self-failures will return Object like
 action: {
      error: {
          data: "...",
          status: 0,
      }
  }
 * when request fails with server -
 action: {
      error: {
          response: {
              data: {},
              status: 404,
              ...
          }
      }
  }
 */

const ErrorMessage = ({ error: { response } }) => {
  if (!response) {
    return null;
  }

  function getError() {

    if (response.status === 400 && typeof response.data === 'object') {
      return (
        Object.keys(response.data).map((key) => {
          if(key === 'non_field_errors') {
            return response.data[key].map((item) => <p className="error-block">{item}</p> )
          }else {
            return <p className="error-block">{`${key} - ${response.data[key]}`}</p>
          }
        })
      )
    }
    if (response.status === 404 && typeof response.data === 'string') {
      return <p className="error-block">404 - could not find the element</p>;
    }

    if (response.status >= 500) {
      return <p className="error-block">{response.status} - internal server error, try again</p>;
    }

    if (typeof response.data === 'string') { // if string it's most likely django html
      return <p className="error-block">{response.status}: Something went wrong</p>
    }

    return flatten(mapToStringArray(response.data)).map(
      ([key, value], i) => <p className="error-block" key={i}>{key}: {value}</p>
    );
  }

  const errors = getError();
  return errors.length ? <Error>{errors}</Error> : null;
};

ErrorMessage.defaultProps = {
  error: {
    response: {
      data: {},
    },
  },
};

export default ErrorMessage;

function mapToStringArray(errorData) {
  return Object.entries(errorData).map(([key, value]) => {
    if (Array.isArray(value)) {
      value = value[0];
    }

    if (value.constructor === Object) {
      return mapToStringArray(value);
    }

    return [key, value];
  });
}

function flatten(arr) {
  let flatArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array && typeof arr[i][1] !== 'string') {
      flatArr = flatArr.concat(flatten(arr[i]));
    } else {
      flatArr.push(arr[i]);
    }
  }
  return flatArr;
}
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('framer-motion', () => {
  const React = require('react');
  
  const motion = new Proxy({}, {
    get: (target, element) => {
      return React.forwardRef(({ children, ...props }, ref) => {
        const cleanProps = {};
        Object.keys(props).forEach((key) => {
          if (!['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'viewport', 'whileInView'].includes(key)) {
            cleanProps[key] = props[key];
          }
        });
        return React.createElement(element, { ref, ...cleanProps }, children);
      });
    }
  });

  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

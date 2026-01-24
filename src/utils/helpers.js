// src/utils/helpers.js
import { ORDER_TEMPLATES } from '../data/constants';

export const generateOrder = () => {
  const template = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...template,
    deadline: Date.now() + 600000, 
  };
};
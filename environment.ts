const dev = {
  production: false,
  apiBaseUrl: 'http://localhost/app',
};
const prod = {
  production: true,
  apiBaseUrl: 'http://localhost/app',
};

const environment = process.env.NODE_ENV === 'development' ? dev : prod;

export { environment as default };

const getAllowedOrigins = () => {
  const allowedOrigins = process.env.ALLOWED_URLS ?? '';
  const origins = allowedOrigins.split(',');
  return origins;
};

export default getAllowedOrigins;

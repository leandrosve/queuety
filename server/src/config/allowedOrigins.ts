const getAllowedOrigins = () => {
  const allowedOrigins = process.env.ALLOWED_URLS ?? '';
  const origins = allowedOrigins.split(',');
  console.log("ORIGINSSSS", {origins})
  return origins;
};

export default getAllowedOrigins;

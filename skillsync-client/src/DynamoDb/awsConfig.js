import AWS from 'aws-sdk';

console.log(import.meta.env)
AWS.config.update({
  region: import.meta.env.VITE_AWS_REGION, 
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
});

export default AWS;

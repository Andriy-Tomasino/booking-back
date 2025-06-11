export const configuration = () => ({
  ewelink: {
    email: process.env.EWELINK_EMAIL,
    password: process.env.EWELINK_PASSWORD,
    region: process.env.EWELINK_REGION,
  },
});
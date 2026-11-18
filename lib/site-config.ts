export const getSiteUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envUrl) {
    return "https://aashishjaini.me";
  }

  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
};

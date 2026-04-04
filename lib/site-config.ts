export const getSiteUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envUrl) {
    return "https://aashishjaini.dev-aashish.tech";
  }

  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
};

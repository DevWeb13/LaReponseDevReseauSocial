const config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || '',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE || '',
};

export function getConfig() {
  const audience =
    config.audience && config.audience !== process.env.REACT_APP_AUTH0_AUDIENCE
      ? config.audience
      : null;

  return {
    domain: config.domain,
    clientId: config.clientId,
    ...(audience ? { audience } : null),
  };
}

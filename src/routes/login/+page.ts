import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  // Get the error query parameter from the URL
  const error = url.searchParams.get('error');

  // Pass it to the page as a prop
  return {
    error: error
  };
};
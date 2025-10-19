// src/routes/admin/+page.ts (New File)
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return {
    title: 'Dashboard' // Title for the main admin page
  };
};
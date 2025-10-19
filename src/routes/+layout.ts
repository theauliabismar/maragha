import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const layoutData = await event.parent();
	
	// This will include data from child routes
  console.log('Layout data layout.ts:', layoutData);
	return {
		...layoutData,
		title: (layoutData as any)?.title || 'Back Office'
	};
};
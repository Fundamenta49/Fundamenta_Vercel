// Simple mock for the toast component (for testing purposes)
export const toast = ({ title, description, variant }: any) => {
  console.log(`Toast: ${variant || 'default'} - ${title}: ${description}`);
  return { id: Date.now() };
};
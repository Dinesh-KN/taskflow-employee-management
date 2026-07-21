import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router/router';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;

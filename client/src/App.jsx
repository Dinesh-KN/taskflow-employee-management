import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router/router';
import { Toaster } from '@/components/ui/sonner';
import AuthBootstrap from '@/features/auth/components/AuthBootstrap';

const App = () => {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
      <Toaster />
    </AuthBootstrap>
  );
};

export default App;

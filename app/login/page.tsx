// 'use client'

// import type { AppProps } from 'next/app';
// import { Authenticator } from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
// import outputs from '@/amplify_outputs.json';
// import '@aws-amplify/ui-react/styles.css';

// Amplify.configure(outputs);

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <Authenticator>
//       {({ signOut, user }) => (
//         <main>
//           <h1>Hello {user?.username}</h1>
//           <button onClick={signOut}>Sign out</button>
//           <Component {...pageProps} />
//         </main>
//       )}
//     </Authenticator>
//   );
// };

// app/login/page.tsx
'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

Amplify.configure(outputs);

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(() => router.replace('/')) // Redirect to homepage if already signed in
      .catch(() => {}); // Stay on login if not signed in
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Authenticator />
    </div>
  );
}

import { Redirect } from '@docusaurus/router';
import type { ReactNode } from 'react';

export default function Home(): ReactNode {
  return <Redirect to="/setup " />;
}

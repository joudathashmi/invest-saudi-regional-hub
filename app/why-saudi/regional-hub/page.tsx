import type { Metadata } from 'next';
import { RegionalHubPage } from '@/components/regional-hub/RegionalHubPage';

export const metadata: Metadata = {
  title: 'Saudi as Your Regional Hub | Invest Saudi',
  description:
    'Serve the Middle East, Africa and the corridors to Asia and Europe from Saudi Arabia: reach, connectivity, market access, platforms and the five ways to operate from here.',
};

export default function Page() {
  return <RegionalHubPage />;
}

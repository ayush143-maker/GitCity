'use client';

import dynamic from 'next/dynamic';

const CityScene = dynamic(() => import('@/components/CityScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 grid place-items-center bg-[#020409]">
      <div className="font-display text-sm text-cyan-300 animate-pulse">
        BOOTING CITY GRID...
      </div>
    </div>
  ),
});

export default function Home() {
  return <CityScene />;
}

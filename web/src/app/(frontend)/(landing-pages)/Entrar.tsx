'use client';

import Link from 'next/link';

function Entrar() {
  return (
      <div className="flex justify-center mt-10">
      <Link
        href="/layoutbasico/aprender"
        className="text-orange-50 text-4xl button-lg border-orange-200 bg-orange-500 px-6 py-3 rounded-lg"
      >
        Entrar na loja
      </Link>
    </div>
  );
}

export default Entrar;

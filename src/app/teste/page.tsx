'use client';

export default function TestPage() {
  return (
    <div className="flex w-full">  {/* Contêiner flex para alinhar as divs na horizontal */}
      {/* Primeiro item: Largura fixa (14) */}
      <div className="w-14 flex-none bg-gray-300 p-4">01</div>

      {/* Segundo item: Largura flexível (64) */}
      <div className="w-64 flex-auto bg-gray-400 p-4">02</div>

      {/* Terceiro item: Largura flexível (32) */}
      <div className="w-32 flex-auto bg-gray-500 p-4">03</div>
    </div>
  );
}

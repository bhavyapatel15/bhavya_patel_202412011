import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <section className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Shop <span className="text-blue-600">Smarter</span>, <br /> Live{" "}
            <span className="text-amber-500">Better</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            Your one stop online store for fashion, gadgets, and lifestyle
            essentials built with security, speed, and style in mind.
          </p>

         <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <div className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow cursor-default">
            🛍️ Shop Fast
          </div>
          <div className="px-6 py-3 border border-gray-300 rounded-xl font-medium cursor-default">
            🌍 Global Shipping
          </div>
        </div>
        </div>

        <div className="flex-1">
          <Image
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80"
            alt="Online Shopping"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
            priority
          />
        </div>
      </section>

    </main>
  );
}

import Image from "next/image";

export default function SourceNotListed() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-2xl text-center">
        {/* Hero Image */}
        <Image
          height={150}
          width={150}
          src="/images/error.gif"
          alt="Error Illustration"
          className="mx-auto mb-8 rounded-lg grayscale-50"
        />

        {/* Error Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700 mb-4">
          Source Not Listed
        </h1>

        {/* Error Description */}
        <p className="text-[16px] md:text-lg text-gray-500 mb-6">
          We couldn&apos;t verify the source you are trying to access. This
          might be due to an incorrect URL or missing permissions.
        </p>

        {/* Footer */}
        <p className="mt-10 text-sm text-gray-500">
          If you need help, feel free to{" "}
          <a href="mailto:hello@dotix.io" className="text-blue-600 underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export function VerificationPending() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 text-center mb-4">
          Application Submitted Successfully
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 text-center mb-8">
          Thank you for your submission. Our team will review your application
          within 3 business days.
        </p>
        <div className="animate-pulse bg-green-800 text-white text-lg font-semibold py-2 px-4 rounded-full">
          Verification Pending
        </div>
      </div>
    </>
  );
}

const logos = ['Stripe', 'OpenAI', 'Linear', 'Datadog', 'Figma', 'Ramp'];

export default function LogoCloud() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-6 opacity-70 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((name) => (
            <div key={name} className="flex items-center justify-center rounded-md border px-3 py-2 text-sm text-gray-600">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



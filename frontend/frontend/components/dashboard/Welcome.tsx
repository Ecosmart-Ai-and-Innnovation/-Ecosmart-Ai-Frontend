type WelcomeSectionProps = {
  name: string;
};

export default function WelcomeSection({ name }: WelcomeSectionProps) {
  return (
    <section>
      <h1 className="text-[1.8rem] font-bold leading-tight text-slate-900 sm:text-[2rem]">
        Hi {name} <span className="inline-block">👋</span>
      </h1>
      <p className="mt-1 text-base text-slate-500 sm:text-lg">
        Let&apos;s make smarter eco decisions
      </p>
    </section>
  );
}
export const metadata = {
  title: "Privacy",
  description:
    "How RaidGuild Forge handles privacy-friendly analytics, email subscriptions, and future marketplace interactions.",
};

const privacySections = [
  {
    title: "Analytics",
    body: "We use Vercel Web Analytics to understand anonymous site interaction patterns, such as page views and button clicks. Analytics events must not include email addresses, wallet addresses, names, or freeform personal text.",
  },
  {
    title: "Email updates",
    body: "If you subscribe for updates, we store your email address, the update categories you selected, and confirmation status so we can send the messages you asked for. Subscriptions use double opt-in, and unsubscribe links remove you from future emails.",
  },
  {
    title: "Marketplace activity",
    body: "Marketplace checkout uses wallet connection and x402 payments. These flows keep wallet addresses and payment details out of analytics and use the minimum information needed to complete the transaction.",
  },
  {
    title: "Contact",
    body: "For privacy questions, contact RaidGuild through the public RaidGuild channels linked from raidguild.org.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-moloch-800/15 bg-scroll-100 py-12 md:py-16">
        <div className="container-custom max-w-4xl">
          <p className="type-label-sm mb-3 text-moloch-500">Privacy</p>
          <h1 className="font-display text-[clamp(2.4rem,6.2vw,4.25rem)] font-bold leading-[1.05] tracking-[0] text-moloch-800">
            Privacy-friendly by default.
          </h1>
          <p className="type-body-lg mt-5 max-w-2xl text-moloch-800/76">
            RaidGuild Forge uses lightweight analytics and explicit email
            preferences to learn what visitors care about without sending
            personal information into analytics.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom grid max-w-4xl gap-4">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="border border-moloch-800/15 bg-scroll-100 p-5"
            >
              <h2 className="type-heading-md mb-3">{section.title}</h2>
              <p className="type-body-lg text-moloch-800/74">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

// src/pages/About.jsx

import Topnav from "../components/Topnav";
import Footer from "../components/Footer";

const categories = [
  {
    name: "Mugs & Drinkware",
    detail: "Ceramic, printed and engraved",
    image:
      "https://images.pexels.com/photos/7507581/pexels-photo-7507581.jpeg",
  },
  {
    name: "Wooden Plaques & Signs",
    detail: "Laser-engraved, made to order",
    image:
      "https://images.pexels.com/photos/6931444/pexels-photo-6931444.jpeg",
  },
  {
    name: "LED Night Lights",
    detail: "Custom photo and name designs",
    image:
      "https://images.pexels.com/photos/6037170/pexels-photo-6037170.jpeg",
  },
  {
    name: "Leather & Metal Keychains",
    detail: "Hand-finished and personalized",
    image:
      "https://images.pexels.com/photos/5491764/pexels-photo-5491764.jpeg",
  },
  {
    name: "Notebooks & Stationery",
    detail: "Embossed covers, custom text",
    image:
      "https://images.pexels.com/photos/5717474/pexels-photo-5717474.jpeg",
  },
  {
    name: "Photo Frames & Gift Sets",
    detail: "Built around your story",
    image:
      "https://images.pexels.com/photos/5137775/pexels-photo-5137775.jpeg",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us your story",
    detail:
      "A name, a photo, a message — whatever makes the gift theirs.",
  },
  {
    number: "02",
    title: "We personalize it",
    detail:
      "Engraved, printed, or finished carefully according to your idea.",
  },
  {
    number: "03",
    title: "Every piece is checked",
    detail:
      "We check spelling, images, finish and details before it leaves us.",
  },
  {
    number: "04",
    title: "Delivered to you",
    detail:
      "Your personalized gift is carefully packed and delivered to your door.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .about-serif {
          font-family: 'Fraunces', serif;
        }

        .about-sans {
          font-family: 'Inter', sans-serif;
        }

        @keyframes about-rise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .about-rise {
          animation: about-rise 0.7s ease-out both;
        }

        .about-delay {
          animation-delay: 0.15s;
        }

        @media (prefers-reduced-motion: reduce) {
          .about-rise {
            animation: none;
          }
        }
      `}</style>

      <Topnav />

      {/* HERO */}
      <section className="w-full px-6 md:px-12 lg:px-16 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="about-rise">
            <p className="about-sans uppercase tracking-[0.18em] text-xs font-medium text-purple-600 mb-6">
              Personalized gifts • Made in Kenya
            </p>

            <h1 className="about-serif text-[2.8rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[1.03] text-[#2A211C]">
              Every gift starts
              <br />
              with a story.
            </h1>

            <p className="about-sans text-[#665E56] text-base md:text-lg leading-relaxed max-w-xl mt-7">
              We turn names, photographs, memories and messages into
              personalized gifts that feel like they were made for one
              person — because they were.
            </p>

            <div className="flex flex-wrap gap-3 mt-9">
              <a
                href="/"
                className="about-sans inline-flex items-center justify-center px-6 py-3.5 bg-[#813ea0] text-white rounded-md font-medium hover:bg-[#9138a3] transition-colors"
              >
                Shop personalized gifts
              </a>

              <a
                href="/contact"
                className="about-sans inline-flex items-center justify-center px-6 py-3.5 border border-[#2A211C]/20 text-[#813ea0] rounded-md font-medium hover:border-[#2A211C]/50 transition-colors"
              >
                Get a custom quote
              </a>
            </div>

            <div className="about-sans flex flex-wrap gap-x-7 gap-y-3 mt-10 text-sm text-[#813ea0">
              <span>✓ Made to order</span>
              <span>✓ Personalized</span>
              <span>✓ Delivery across Kenya</span>
            </div>
          </div>

          <div className="about-rise about-delay">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#E7DDD1]">
              <img
                src="https://images.pexels.com/photos/34459670/pexels-photo-34459670.jpeg"
                alt="Personalized gifts"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#2A211C]/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                <p className="about-serif italic text-[#FBF8F4] text-2xl md:text-3xl leading-snug">
                  Made for one person —
                  <br />
                  not everyone.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="w-full border-y border-[#E4DCD1] bg-[#F6F0E9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">

            <div>
              <p className="about-sans text-xs uppercase tracking-[0.18em] text-purple-600 font-medium">
                Why we exist
              </p>
            </div>

            <div className="md:col-span-2">
              <h2 className="about-serif text-2xl md:text-4xl leading-snug text-[#2A211C]">
                Because the best gifts don't just say{" "}
                <span className="italic">"I bought you something."</span>
                <br />
                They say{" "}
                <span className="italic">"I know you."</span>
              </h2>

              <p className="about-sans text-[#665E56] leading-relaxed mt-6 max-w-2xl">
                That's why personalization is at the heart of everything we
                make. A name, a date, a favourite photograph or a few words
                can turn an ordinary object into something worth keeping.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHAT WE CRAFT */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="about-sans text-xs uppercase tracking-[0.18em] text-purple-600 font-medium mb-4">
                The collection
              </p>

              <h2 className="about-serif text-3xl md:text-4xl text-[#2A211C]">
                Things made more personal.
              </h2>
            </div>

            <p className="about-sans text-sm text-[#81776D] max-w-md leading-relaxed">
              From everyday keepsakes to special occasion gifts, we create
              pieces that carry a little more meaning.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8DED2]">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-4 pb-3">
                  <h3 className="about-sans font-medium text-[#2A211C]">
                    {category.name}
                  </h3>

                  <p className="about-sans text-sm text-[#81776D] mt-1">
                    {category.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="w-full bg-[#7b5799] text-[#FBF8F4] px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">

            <div>
              <p className="about-sans text-xs uppercase tracking-[0.18em] text-black font-medium mb-5">
                Our approach
              </p>

              <h2 className="about-serif text-3xl md:text-4xl leading-tight">
                Small details.
                <br />
                Big meaning.
              </h2>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-3 gap-10">

              <div>
                <div className="w-8 h-px bg-[#C09A5A] mb-6" />

                <h3 className="about-sans text-lg font-medium">
                  Made personal
                </h3>

                <p className="about-sans text-sm text-[#B8AFA5] leading-relaxed mt-3">
                  Your story comes first. We create gifts that feel personal,
                  thoughtful and unique.
                </p>
              </div>

              <div>
                <div className="w-8 h-px bg-[#C09A5A] mb-6" />

                <h3 className="about-sans text-lg font-medium">
                  Made with care
                </h3>

                <p className="about-sans text-sm text-[#B8AFA5] leading-relaxed mt-3">
                  Every name, photograph and message matters. We take time
                  to get the details right.
                </p>
              </div>

              <div>
                <div className="w-8 h-px bg-[#C09A5A] mb-6" />

                <h3 className="about-sans text-lg font-medium">
                  Made for moments
                </h3>

                <p className="about-sans text-sm text-[#B8AFA5] leading-relaxed mt-3">
                  Birthdays, weddings, anniversaries, graduations or simply
                  saying, "I thought of you."
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PROCESS */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-2xl mb-14">
            <p className="about-sans text-xs uppercase tracking-[0.18em] text-purple-600 font-medium mb-4">
              How it works
            </p>

            <h2 className="about-serif text-3xl md:text-4xl text-[#2A211C]">
              From your idea to their hands.
            </h2>

            <p className="about-sans text-[#665E56] leading-relaxed mt-5">
              Personalizing a gift shouldn't be complicated. You bring the
              idea. We take care of the making.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-[#E4DCD1]">

            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`py-8 lg:pr-8 ${
                  index !== 0
                    ? "lg:border-l lg:border-[#E4DCD1] lg:pl-8"
                    : ""
                }`}
              >
                <span className="about-sans text-sm text-[#A0783E] font-medium">
                  {step.number}
                </span>

                <h3 className="about-sans text-lg font-medium text-[#2A211C] mt-5">
                  {step.title}
                </h3>

                <p className="about-sans text-sm text-[#81776D] leading-relaxed mt-3">
                  {step.detail}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="w-full px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden bg-[#7b5799]">

            <div className="min-h-[350px] lg:min-h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&q=90"
                alt="Beautifully packaged gift"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-9 md:p-14 lg:p-16 flex items-center">
              <div>

                <p className="about-sans text-xs uppercase tracking-[0.18em] text-white font-medium mb-5">
                  More than a product
                </p>

                <h2 className="about-serif text-3xl md:text-4xl leading-tight text-[#2A211C]">
                  Give them something they didn't know they needed.
                </h2>

                <p className="about-sans text-white leading-relaxed mt-6">
                  The best personalized gifts often become part of someone's
                  everyday life. A mug on their desk. A name on their keys.
                  A photograph beside their bed. A message they see every
                  morning.
                </p>

                <a
                  href="/"
                  className="about-sans inline-flex mt-8 px-6 py-3.5 bg-[#2A211C] text-white rounded-md font-medium hover:bg-[#44372F] transition-colors"
                >
                  Explore the collection
                </a>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full border-t border-[#E4DCD1] px-6 md:px-12 lg:px-16 py-20 md:py-24">
        <div className="max-w-7xl mx-auto text-center">

          <p className="about-sans text-xs uppercase tracking-[0.18em] text-purple-600 font-medium mb-5">
            Your story, your gift
          </p>

          <h2 className="about-serif text-3xl md:text-5xl leading-tight max-w-3xl mx-auto text-[#2A211C]">
            Ready to make something personal?
          </h2>

          <p className="about-sans text-[#665E56] max-w-xl mx-auto mt-5 leading-relaxed">
            Find something you love, add your personal touch, and we'll take
            care of the rest.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <a
              href="/"
              className="about-sans px-7 py-3.5 bg-[#7b5799] text-white rounded-md font-medium hover:bg-[#4b2a8a] transition-colors"
            >
              Browse the catalog
            </a>

            <a
              href="/contact"
              className="about-sans px-7 py-3.5 border border-[#2A211C]/20 text-[#2A211C] rounded-md font-medium hover:border-[#2A211C]/50 transition-colors"
            >
              Talk to us
            </a>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
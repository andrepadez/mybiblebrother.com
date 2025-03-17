
import React from 'react'
import BentoGrid from '../BentoGrid'

interface FeaturesSectionProps {
  scrollToWaitlist: () => void
  scrollToBibleVerse: (ev: React.MouseEvent) => void
  scrollToTop: () => void
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  scrollToWaitlist,
  scrollToBibleVerse,
  scrollToTop,
}) => {
  return (
    <section
      id="features-section"
      className="relative bg-cover bg-center bg-no-repeat z-0 opacity-95"
      style={{
        backgroundImage: "url('/enlightenment.webp')",
      }}
    >
      <div className="pt-16 pb-24">
        <BentoGrid scrollToWaitlist={scrollToWaitlist} />
      </div>

      <div className="pb-20 z-10 w-full flex flex-col md:flex-row gap-3 justyfy-between md:justify-around">
        <div className="relative z-10 w-full text-center">
          <button
            onClick={scrollToWaitlist}
            className="text-white cursor-pointer hover:opacity-90 text-sm md:text-base font-medium underline 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
          >
            Join our mailing list
          </button>
        </div>
        <div className="relative z-10 w-full text-center">
          <button
            onClick={scrollToBibleVerse}
            className="text-white cursor-pointer hover:opacity-90 text-sm md:text-base font-medium underline 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
          >
            Bible Verse of the day
          </button>
        </div>
        <div className="relative z-10 w-full text-center">
          <button
            onClick={scrollToTop}
            className="text-white cursor-pointer hover:opacity-90 text-sm md:text-base font-medium underline 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
          >
            Back to top
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

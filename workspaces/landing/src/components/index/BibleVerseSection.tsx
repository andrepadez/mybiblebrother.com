
import React from 'react'
import { Button } from '../ui/button'

interface BibleVerseSectionProps {
  scrollToTop: () => void
  scrollToFeatures: () => void
  scrollToWaitlist: () => void
}

const BibleVerseSection: React.FC<BibleVerseSectionProps> = ({
  scrollToTop,
  scrollToFeatures,
  scrollToWaitlist,
}) => {
  return (
    <section
      id="bible-verse-of-the-day"
      className="relative bg-bible-wood/5 min-h-[100vh] flex flex-col justify-center py-12 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-36"
    >
      {/* Soil in hands background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-95"
        style={{
          backgroundImage: "url('/hands_dirt.jpg')",
        }}
      />

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-bible-wood/30 z-1"></div>

      <blockquote className="max-w-2xl -mt-48 mx-auto text-center italic font-serif text-white text-xl md:text-2xl leading-relaxed z-10 p-8 bg-bible-wood/30 backdrop-blur-sm rounded-lg shadow-lg">
        "And God saw that the light was good;
        <span className="hidden lg:inline">
          <br />
        </span>{' '}
        and God separated the light from the darkness."
        <footer className="text-base font-sans font-medium mt-3 text-white/90">
          — Genesis 1:4
        </footer>
      </blockquote>

      {/* Added Learn More button below the quote */}
      <div className="relative z-10 w-full mt-6 md:mt-12 text-center">
        <div className="relative mb-4 z-10 w-full text-center">
          <button
            onClick={scrollToTop}
            className="text-white cursor-pointer hover:opacity-90 text-sm md:text-base font-medium underline 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
          >
            Back to top
          </button>
        </div>
        <Button
          onClick={scrollToFeatures}
          className="bg-bible-scripture text-white hover:bg-bible-scripture/90 transition-all duration-300 
                   py-2 px-5 rounded-full font-medium tracking-wide text-sm shadow-lg
                   transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Learn More
        </Button>
        <div className="relative mt-4 z-10 -mb-32 w-full text-center">
          <button
            onClick={scrollToWaitlist}
            className="text-white hover:text-white/90 text-sm md:text-base font-medium underline 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
          >
            Join our mailing list
          </button>
        </div>
      </div>
    </section>
  )
}

export default BibleVerseSection

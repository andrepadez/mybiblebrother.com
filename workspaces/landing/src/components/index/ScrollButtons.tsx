
import React from 'react'
import { Button } from '../ui/button'

interface ScrollButtonsProps {
  scrollToTop: () => void
  scrollToFeatures: () => void
  scrollToBibleVerse: (ev: React.MouseEvent) => void
  scrollToWaitlist: () => void
}

const ScrollButtons: React.FC<ScrollButtonsProps> = ({
  scrollToTop,
  scrollToFeatures,
  scrollToBibleVerse,
  scrollToWaitlist,
}) => {
  return (
    <>
      <div className="relative my-2 md:my-6 z-10 w-full text-center">
        <button
          onClick={scrollToTop}
          className="text-white cursor-pointer hover:opacity-90 text-sm md:text-base font-medium underline 
                transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
        >
          Back to top
        </button>
      </div>
      <div className="flex flex-col items-center">
        <Button
          onClick={scrollToFeatures}
          className="bg-bible-scripture text-white hover:bg-bible-scripture/90 transition-all duration-300 
                    py-2 px-5 rounded-full font-medium tracking-wide text-sm shadow-lg
                    transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Learn More
        </Button>
      </div>
      <div className="text-center my-2 md:my-6">
        <a
          href="#bible-verse-of-the-day"
          onClick={scrollToBibleVerse}
          className="text-white text-center hover:text-white/90 text-sm md:text-base font-medium underline 
                   transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
        >
          Bible verse of the day
        </a>
      </div>
    </>
  )
}

export default ScrollButtons

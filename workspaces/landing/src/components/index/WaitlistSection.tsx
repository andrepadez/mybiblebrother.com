
import React from 'react'
import WaitlistForm from '../WaitlistForm'
import ScrollButtons from './ScrollButtons'

interface WaitlistSectionProps {
  scrollToTop: () => void
  scrollToFeatures: () => void
  scrollToBibleVerse: (ev: React.MouseEvent) => void
}

const WaitlistSection: React.FC<WaitlistSectionProps> = ({
  scrollToTop,
  scrollToFeatures,
  scrollToBibleVerse,
}) => {
  return (
    <section
      id="waitlist-section"
      className="relative min-h-[100vh] flex py-12 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      {/* Mountain Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')",
          backgroundPosition: 'center',
        }}
      />

      {/* Content - Positioned near the top */}
      <div className="relative z-10 w-full mt-[10%]">
        <WaitlistForm />

        <ScrollButtons 
          scrollToTop={scrollToTop}
          scrollToFeatures={scrollToFeatures}
          scrollToBibleVerse={scrollToBibleVerse}
          scrollToWaitlist={() => {}}
        />
      </div>
    </section>
  )
}

export default WaitlistSection

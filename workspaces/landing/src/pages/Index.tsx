import React from 'react'
import Hero from '../components/Hero'
import AudioPlayer from '../components/AudioPlayer'
import WaitlistSection from '../components/index/WaitlistSection'
import BibleVerseSection from '../components/index/BibleVerseSection'
import FeaturesSection from '../components/index/FeaturesSection'
import Footer from '../components/index/Footer'

const Index = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToBibleVerse = (ev) => {
    ev.preventDefault()
    const bibleVerseSection = document.getElementById('bible-verse-of-the-day')
    if (bibleVerseSection) {
      bibleVerseSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Focus the email input after scrolling
      setTimeout(() => {
        const emailInput = document.querySelector(
          '#waitlist-section input[type="email"]'
        ) as HTMLInputElement
        if (emailInput) emailInput.focus()
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen w-full bg-bible-light overflow-x-hidden">
      {/* Fixed Audio Player Header */}
      <header className="fixed top-0 left-0 right-0 bg-bible-skyblue/40 shadow-md z-50">
        <div className="max-w-4xl mx-auto px-4">
          <AudioPlayer />
        </div>
      </header>

      {/* Hero Section - Full height with sky background */}
      <section className="min-h-[100vh] w-full">
        <Hero
          title="My Bible Brother"
          subtitle="Experience the Word through guided meditation, daily scripture, and personal reflection. Your digital companion for a deeper spiritual journey."
        />
      </section>

      {/* Waitlist Form Section */}
      <WaitlistSection 
        scrollToTop={scrollToTop} 
        scrollToFeatures={scrollToFeatures} 
        scrollToBibleVerse={scrollToBibleVerse} 
      />

      {/* Bible Verse Section */}
      <BibleVerseSection 
        scrollToTop={scrollToTop} 
        scrollToFeatures={scrollToFeatures} 
        scrollToWaitlist={scrollToWaitlist} 
      />

      {/* Features Section */}
      <FeaturesSection 
        scrollToWaitlist={scrollToWaitlist} 
        scrollToBibleVerse={scrollToBibleVerse} 
        scrollToTop={scrollToTop} 
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Index

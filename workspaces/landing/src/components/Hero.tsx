
import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

interface HeroProps {
  title: string
  subtitle: string
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section')
    if (waitlistSection) {
      // Using a more gentle scroll behavior
      waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Focus the email input after scrolling with a slightly longer delay
      setTimeout(() => {
        const emailInput = document.querySelector(
          '#waitlist-section input[type="email"]'
        ) as HTMLInputElement
        if (emailInput) emailInput.focus()
      }, 1000)
    }
  }

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Background Image with overlay - Changed to sky background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL3doeS1pcy1za3ktYmx1ZS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjgyOH0sInRvRm9ybWF0IjoiYXZpZiJ9fQ==')",
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay for better text contrast - reduced blur from 2px to 1px */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative h-full min-h-screen flex flex-col items-center -mt-20 justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-16">
        <div className="animate-fade-in text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight text-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto font-light leading-relaxed text-shadow-sm">
            {subtitle}
          </p>
          <div className="animate-fade-up animation-delay-200 flex flex-col items-center gap-4">
            <Button
              asChild
              className="bg-bible-scripture text-white hover:bg-bible-scripture/90 transition-all duration-300 
                        py-2 px-5 rounded-full font-medium tracking-wide text-sm shadow-lg
                        transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link to="/scripture">Learn More</Link>
            </Button>

            <button
              onClick={scrollToWaitlist}
              className="text-white/90 hover:text-white text-sm md:text-base font-medium underline 
                        transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-bible-scripture/50 rounded-md"
            >
              Join our mailing list
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

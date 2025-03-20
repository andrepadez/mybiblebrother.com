import React from 'react'

const Footer: React.FC = () => {
  return null
  return (
    <>
      {/* Footer - Fixed at bottom with padding to prevent content overlap */}
      <div className="pb-16">
        {/* This padding ensures content isn't hidden behind the fixed footer */}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-bible-skyblue/70 text-white py-6 px-4 shadow-md z-50 backdrop-blur-sm">
        <div className="px-0 md:px-20 mx-auto flex flex-wrap items-center justify-between">
          <div className="font-serif text-xl">My Bible Brother</div>
          <p className="text-sm opacity-90">
            Your companion for spiritual growth and biblical meditation.
          </p>
          <div className="text-xs opacity-80">
            &copy; {new Date().getFullYear()} My Bible Brother. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer

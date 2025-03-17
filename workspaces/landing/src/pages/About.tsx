
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-bible-light pt-16 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-bible-wood mb-6">About My Bible Brother</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="text-lg mb-4">
              My Bible Brother is your digital companion for a deeper spiritual journey. We provide guided
              meditation, daily scripture readings, and tools for personal reflection.
            </p>
            
            <p className="text-lg mb-4">
              Our mission is to help you connect with the Word in meaningful ways throughout your day,
              bringing scripture to life through audio meditations and spiritual guidance.
            </p>
            
            <h2 className="font-serif text-2xl font-bold text-bible-wood mt-8 mb-4">Our Vision</h2>
            <p className="text-lg mb-4">
              We envision a world where everyone can access spiritual guidance and biblical wisdom
              through modern technology, making the Word accessible anytime, anywhere.
            </p>
            
            <h2 className="font-serif text-2xl font-bold text-bible-wood mt-8 mb-4">Join Our Community</h2>
            <p className="text-lg mb-6">
              We're building a community of believers who support each other in their spiritual journey.
              Join our mailing list to receive updates, daily verses, and special content.
            </p>
            
            <div className="flex justify-center mt-8">
              <Button asChild className="bg-bible-scripture text-white hover:bg-bible-scripture/90">
                <Link to="/#waitlist-section">Join Our Mailing List</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

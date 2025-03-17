
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Mock function to simulate fetching a verse of the day
const fetchVerseOfTheDay = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sample verses - in a real app, these would come from an API
  const verses = [
    {
      text: "And God saw that the light was good; and God separated the light from the darkness.",
      reference: "Genesis 1:4"
    },
    {
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16"
    },
    {
      text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6"
    }
  ];
  
  // Return a random verse
  return verses[Math.floor(Math.random() * verses.length)];
};

const Scripture = () => {
  const { data: verse, isLoading, isError, refetch } = useQuery({
    queryKey: ['verseOfTheDay'],
    queryFn: fetchVerseOfTheDay
  });
  
  return (
    <div className="min-h-screen bg-bible-light pt-16 pb-24">
      <div 
        className="min-h-[60vh] relative bg-cover bg-center flex flex-col justify-center items-center px-4"
        style={{
          backgroundImage: "url('/hands_dirt.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Daily Scripture
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Reflect on God's word with our verse of the day
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-bible-wood mb-8">
              Verse of the Day
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-bible-scripture" />
              </div>
            ) : isError ? (
              <div className="text-destructive py-6">
                <p>Unable to load verse. Please try again.</p>
                <Button 
                  onClick={() => refetch()}
                  variant="outline" 
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <blockquote className="italic text-2xl font-serif text-bible-wood mb-4 leading-relaxed">
                  "{verse?.text}"
                </blockquote>
                <p className="text-bible-wood/80 text-lg font-medium">
                  — {verse?.reference}
                </p>
                
                <Button
                  onClick={() => refetch()} 
                  className="mt-8 bg-bible-scripture text-white hover:bg-bible-scripture/90"
                >
                  Get New Verse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scripture;

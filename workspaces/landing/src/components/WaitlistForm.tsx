
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Reset states
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-bold text-white mb-3 text-shadow-sm">
          Join Our Waiting List
        </h2>
        <p className="text-white max-w-xl mx-auto font-medium">
          Be among the first to experience My Bible Brother. Enter your email to receive updates and early access.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-bible-scripture/70" />
            </div>
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="block w-full pl-10 px-4 py-3 bg-bible-light border border-bible-light rounded-lg
                        text-bible-wood placeholder:text-bible-wood/50 focus:outline-none focus:ring-2
                        focus:ring-bible-scripture/50 transition-all duration-200"
              disabled={isSubmitting || isSuccess}
            />
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-3 px-4 flex items-center justify-center rounded-lg font-medium text-white
                      transition-all duration-300 shadow-md hover:shadow-lg
                      ${isSuccess 
                        ? 'bg-green-600' 
                        : 'bg-bible-scripture hover:bg-bible-scripture/90 transform hover:scale-[1.01] active:scale-[0.99]'
                      }`}
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : isSuccess ? (
              'Thanks for joining!'
            ) : (
              'Join the Waiting List'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WaitlistForm;

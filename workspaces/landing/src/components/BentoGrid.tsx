import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import {
  BookOpen,
  BookText,
  Headphones,
  Heart,
  Lightbulb,
  MailQuestion,
  Star,
  Zap,
  MessageSquare,
  Bell,
  Flag,
  Key,
} from 'lucide-react'

const BentoGrid = ({ scrollToWaitlist }) => {
  const [displayedItems, setDisplayedItems] = useState<Array<any>>([])

  const allBentoItems = [
    {
      title: 'Daily Scripture',
      description: 'Start your day with carefully selected Bible verses to inspire and guide you.',
      icon: <BookText className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Guided Meditation',
      description: "Experience peaceful meditations centered around God's word.",
      icon: <Headphones className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Prayer Prompts',
      description: 'Never be lost for words with our thoughtful prayer starters.',
      icon: <Heart className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Bible Study',
      description: 'Dive deeper into Scripture with our guided study sessions.',
      icon: <BookOpen className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Reflection Questions',
      description: 'Thought-provoking questions to deepen your understanding.',
      icon: <MailQuestion className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Spiritual Insights',
      description: 'Gain new perspectives on familiar passages and teachings.',
      icon: <Lightbulb className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Verse Memorization',
      description: 'Tools and techniques to help you commit Scripture to memory.',
      icon: <Star className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Quick Devotionals',
      description: 'Brief but powerful devotionals for your busy schedule.',
      icon: <Zap className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Community Discussions',
      description: 'Connect with others on their spiritual journey.',
      icon: <MessageSquare className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Daily Reminders',
      description: 'Gentle nudges to keep your spiritual practice on track.',
      icon: <Bell className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Scripture Challenges',
      description: 'Weekly challenges to apply biblical principles in your life.',
      icon: <Flag className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
    {
      title: 'Wisdom Access',
      description: 'Unlock ancient biblical wisdom for modern challenges.',
      icon: <Key className="h-10 w-10 text-white" />,
      color: 'bg-bible-scripture/10 hover:bg-bible-scripture/20',
    },
  ]

  useEffect(() => {
    const shuffled = [...allBentoItems].sort(() => 0.5 - Math.random())
    setDisplayedItems(shuffled.slice(0, 6))
  }, [])

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative">
      <div className="max-w-6xl mx-auto h-full flex flex-col justify-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-4">
          Features
        </h2>
        <p className="text-center text-white mb-12 max-w-2xl mx-auto font-medium">
          Discover how My Bible Brother helps you grow closer to God through these powerful
          features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, index) => (
            <Card
              key={index}
              className={`overflow-hidden transition-all duration-300 ${item.color} border-bible-scripture/20 hover:border-bible-scripture/40 shadow-sm hover:shadow-md backdrop-blur-sm bg-white/30`}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-bible-scripture/20">{item.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-black/80 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BentoGrid

import React from 'react'
import { ChatWindow } from './ChatWindow'
import { useIsMobile } from '@/hooks/use-mobile'

export const TalkToBibleBuddy = () => {
  const isMobile = useIsMobile()

  // Expanded mock data with more messages
  const mockMessages = []

  return (
    <div className="h-screen overflow-hidden bg-bible-light pt-16">
      <div className={`mx-auto ${isMobile ? 'w-full' : 'container px-4'}`}>
        <ChatWindow messages={mockMessages} />
      </div>
    </div>
  )
}

const mockMessages = [
  {
    text: "Hello! I'm your Bible Buddy. How can I help you explore scripture today?",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'Hi! Can you tell me about Genesis?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "Genesis is the first book of the Bible. It tells the story of creation, early human history, and God's covenant with Abraham and his descendants.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'What can you tell me about the creation story?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "The creation story is found in Genesis chapters 1-2. In Genesis 1, God creates the world in six days and rests on the seventh. In Genesis 2, there's a more detailed account of the creation of humans.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'Who were Adam and Eve?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "Adam and Eve were the first humans according to the Bible. God created Adam from dust and placed him in the Garden of Eden. Later, God created Eve from Adam's rib to be his companion.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'What happened with the forbidden fruit?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: 'God told Adam and Eve they could eat from any tree in the Garden except the tree of knowledge of good and evil. The serpent tempted Eve to eat the fruit, and she shared it with Adam. As a result, sin entered the world, and they were expelled from Eden.',
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'Tell me about Noah and the flood.',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "Noah's story is in Genesis 6-9. God saw that humanity had become wicked and decided to cleanse the earth with a flood. God instructed Noah to build an ark and bring his family and pairs of animals aboard. After the flood subsided, God made a covenant with Noah, symbolized by the rainbow.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'Who was Abraham?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "Abraham (initially called Abram) was a patriarch of Israel. God called him to leave his homeland and promised to make him into a great nation. He's known for his faith and willingness to sacrifice his son Isaac when God commanded it (though God stopped him). He's considered the father of the Jewish people.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'What about Moses?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "Moses was born to Hebrew slaves in Egypt. He was rescued by Pharaoh's daughter and raised in the palace. Later, God called him to lead the Israelites out of Egypt. He received the Ten Commandments on Mount Sinai and led the people through the wilderness for 40 years.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'Tell me about King David.',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "David was Israel's second king, known as 'a man after God's own heart.' As a youth, he defeated the giant Goliath. He united the kingdom of Israel and established Jerusalem as its capital. He was a skilled musician who wrote many of the Psalms. Despite his sins, God promised that the Messiah would come from his lineage.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'What can you tell me about Jesus?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "Jesus Christ is the central figure of Christianity. Born in Bethlehem, he was the Son of God who came to earth to save humanity from sin. He taught about God's kingdom, performed miracles, and gathered disciples. He was crucified but rose from the dead on the third day, offering salvation to all who believe in him.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'Who were the apostles?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: "The apostles were Jesus's closest disciples. The original twelve were Peter, Andrew, James (son of Zebedee), John, Philip, Bartholomew, Thomas, Matthew, James (son of Alphaeus), Thaddaeus, Simon the Zealot, and Judas Iscariot. After Jesus's resurrection, Matthias replaced Judas, and later Paul became an influential apostle.",
    timestamp: new Date().toISOString(),
    isUser: false,
  },
  {
    text: 'What is the Holy Spirit?',
    timestamp: new Date().toISOString(),
    isUser: true,
  },
  {
    text: 'The Holy Spirit is the third person of the Trinity in Christian theology. After Jesus ascended to heaven, the Holy Spirit came upon the disciples at Pentecost. The Spirit guides believers, provides spiritual gifts, helps in prayer, and works to transform believers to be more like Christ.',
    timestamp: new Date().toISOString(),
    isUser: false,
  },
]

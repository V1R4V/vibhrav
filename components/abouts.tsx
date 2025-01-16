'use client'
import { InteractiveBackground } from './interactive-background';
import { Nav }from '@/components/nav';
import { motion } from 'framer-motion'
import HyperText from "@/components/ui/hyper-text";
import { TypeAnimation } from 'react-type-animation'

const AnimatedText = () => {
  return (
    <TypeAnimation
      sequence={[
        "I'm Vibhrav Jha, from New Delhi, India🇮🇳.", 
        2000,
        "Currently based in Madison, WI🇺🇸.", 
        4000, 
        " I'm looking forward to making a career in the field of Software Development and engineering🛠️.", 
        4000, 
        "Hopefully we can connect after you know a bit more about me🤝!",
        4000,  
        "Keep Scrolling!🚀",
        8000,
        () => {
          console.log('Sequence completed');
        },
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      speed={65}
      style={{
        fontSize: '1.5em', 
        display: 'inline-block', 
        whiteSpace: 'pre-line', 
        fontFamily: '"Roboto", sans-serif', // Modern font
        fontWeight: '500', // Slightly bolder text
        color: 'white',
        lineHeight: '1.5',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Adds a shadow for better readability
      }}
    />
  );
};

export function About() {
  return (
    <div>
      <Nav />
      <InteractiveBackground />
    <div className="relative">
      {/* Cover Image */}
      <div
        className="relative h-[40vh] md:h-[60vh] w-full bg-center"
        style={{
          backgroundImage: 'url("/IMG_0950.jpg")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* "About Me" Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center"><HyperText>About Me✨</HyperText></h2>
        
        {/* Animated Text */}
        <div className="my-8 text-center">
          <AnimatedText />
        </div>

        {/* Hobbies Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">My Hobbies</h2>
          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Hobby Cards */}
            {[
              {
                title: '⚽️ Football',
                description: 'Once a pro footballer and forever a die-hard Real Madrid fan!',
                bgColor: 'bg-green-500',
              },
              {
                title: '🏋️ Gym',
                description: 'Passionate about fitness and hitting the gym to build strength and discipline.',
                bgColor: 'bg-blue-500',
              },
              {
                title: '👨‍🍳 Cooking',
                description: 'Mastering the art of Indian cuisine, from buttery curries to sizzling tandoori.',
                bgColor: 'bg-orange-500',
              },
              {
                title: '🛫 Travelling',
                description: 'Exploring unique and untouched destinations, like recently the serene A&N Islands in India.',
                bgColor: 'bg-red-500',
              },
              {
                title: '🎮 Gaming',
                description: 'From clutch plays in Valorant to scoring screamers in FIFA, gaming fuels adrenaline.',
                bgColor: 'bg-yellow-500',
              },
              { 
                title: '📚 Reading',
                description: 'Currently diving into Leaders Eat Last by Simon Sinek.',
                bgColor: 'bg-purple-500',
              },
            ].map((hobby, index) => (
              <motion.div
                key={index}
                className={`relative p-6 rounded-lg shadow-lg text-white ${hobby.bgColor}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="text-lg font-semibold">{hobby.title}</h3>
                <p className="text-sm mt-2">{hobby.description}</p>
                <motion.div
                  className="absolute bottom-4 right-4"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-xl">→</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

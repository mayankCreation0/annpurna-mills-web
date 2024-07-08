import React from 'react'
import "../Assets/loading.css"
import { motion } from 'framer-motion';

const Loading = () => {
    const text = "श्री ANNPURNA MILLS";
    const subtitle = "Since 1958";
    return (
        <div className="loading-container z-50">
        <div className="loading-content">
          <motion.h1
            className="title"
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            {text.split(' ').map((word, idx) => (
              <span key={idx} className="word">{word}</span>
            ))}
          </motion.h1>
          <motion.h2
            className="subtitle"
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
          >
            {subtitle.split(' ').map((word, idx) => (
              <span key={idx} className="word">{word}</span>
            ))}
          </motion.h2>
          <div className="loading-bar-container">
            <motion.div
              className="loading-bar"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            ></motion.div>
          </div>
        </div>
      </div>
    )
}

export default Loading

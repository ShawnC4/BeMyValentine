import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const frontDesign = [
    '000000000000000000000',
    '000111110000011111000',
    '001111111000111111100',
    '011111111101111111110',
    '011111111111111111110',
    '011111111111111111110',
    '011111111111111111110',
    '011111111111111111110',
    '001111111111111111100',
    '001111111111111111100',
    '000111111111111111000',
    '000111111111111111000',
    '000011111111111110000',
    '000011111111111110000',
    '000001111111111100000',
    '000000111111111000000',
    '000000011111110000000',
    '000000001111100000000',
    '000000001111100000000',
    '000000000111000000000',
    '000000000010000000000',
  ];

  const name = 'Trulli';

  const question = 'Will you be my valentine?';

  const congratulations = 'Congrats. You are now my valentine!';

  const [heartBeating, setHeartBeating] = useState(true);
  const [letterVisible, setLetterVisible] = useState(false);
  const [paperVisible, setPaperVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio('/music.mp3'));

  useEffect(() => {
    return () => {
      audio.pause(); // Pause the audio when component unmounts
    };
  }, [audio]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {

    let heartTimeline;
    if (heartBeating) {
      heartTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      heartTimeline
        .to('.pixel-heart', { scale: 1.3, duration: 0.2 }) // First beat (grow)
        .to('.pixel-heart', { scale: 1.1, duration: 0.3 }) // First beat (shrink)
        .to('.pixel-heart', { scale: 1.3, duration: 0.2 }) // Second beat (grow)
        .to('.pixel-heart', { scale: 1, duration: 0.3 }) // Second beat (shrink)
    }

    return () => {
      if (heartTimeline) heartTimeline.kill(); // Clean up the animation on unmount or state change
    };
  }, [heartBeating]);

  const handleHeartClick = () => {
    handlePlayPause();
    setHeartBeating(false);
    setLetterVisible(true);

    // Animate the heart to grow and fade
    gsap.to('.pixel-heart', { scale: 0, opacity: 0, duration: 1.5, ease: 'power2.out' });
    
    // Animate background color change
    gsap.to('body', { backgroundColor: '#FF69B4', duration: 2 });

    // After the animation, show the letter
    setTimeout(() => {
      setLetterVisible(true);
    }, 2000); // Adjust the delay for when the letter should appear
  };

  const handleLetterClick = () => {
    if (!imageChanged) {
      // Change the image when it's clicked once
      setImageChanged(true);
    } else {
      // Fade out the image and text, then show the paper
      gsap.to('.letter img, .letter p', { opacity: 0, duration: 1 }); // Fade out the image

      // Show the letter paper after the fade-out
      setTimeout(() => {
        setPaperVisible(true);
      }, 1000); // Adjust the delay as needed
    }
  };

  const handleAnswer = (response) => {
    if (response === 'No') {
      setFlipped(true); // Show the "misclicked" message
      setTimeout(() => setFlipped(false), 4000);
    } else {
      setConfetti(true); // Trigger confetti animation
      setPaperVisible(false); // Hide the paper
      setTimeout(() => {
        setAnswer(congratulations);
        setTimeout(() => {
          // Delay and animate "Forever... muahaha!"
          gsap.to('.forever-text', { opacity: 1, duration: 3 });
        }, 2000); // 1-second delay
      }, 1000);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const flipProps = flipped
    ? { rotateY: 180 }
    : { rotateY: 0 };

  return (
    <div className="App">
      {confetti && <Confetti />}
      
      <div className="pixel-heart" onClick={handleHeartClick}>
        {/* Pixelated heart grid (15x15) */}
        {frontDesign.map((row, rowIndex) =>
          row.split('').map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={cell === '1' ? '' : 'empty'}
            />
          ))
        )}
      </div>

      {letterVisible && (
        <motion.div
          className="letter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          onClick={handleLetterClick}
        >
          {!imageChanged ? (
            <img src="/env_close.png" alt="Pixelated Letter" />
          ) : (
            <img src="/env_open.png" alt="Changed Letter" />
          )}
          <p>For {name}</p>
        </motion.div>
      )}

      {paperVisible && (
        <motion.div
          className="paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="message">
          {flipped
            ? (
              <>
                <div>Mmm...looks like you misclicked!!<br />Let's try that one more time shall we.</div>
              </>
            )
            : question}
          </div>
          {!flipped && (
            <div>
              <button onClick={() => handleAnswer('Yes')}>Yes</button>
              <button onClick={() => handleAnswer('No')}>No</button>
            </div>
          )}
        </motion.div>
      )}

    {answer && (
      <div className="final-message">
        <p>{answer}</p>
        <p className="forever-text" style={{ opacity: 0 }}>
          FOREVERRR....<br /><br />
          MUAHAHAHAH!!
        </p>
        <button className="restart-btn" onClick={handleRestart}>Restart</button>
      </div>
    )}
    </div>
  );
}

export default App;
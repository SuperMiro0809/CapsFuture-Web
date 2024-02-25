'use client'

import { useEffect } from 'react';

import PropTypes from 'prop-types';

import { useSpring, animated } from '@react-spring/web';

export function RotatingBottleCap({ children, style, delay, rotationDuration }) {
  // Spring for vertical movement
  const [move, apiMove] = useSpring(() => ({
    // loop: true,
    from: { y: -50 },
    // to: { y: 110 },
    // config: { duration: rotationDuration || 2000 }, // Duration for the vertical movement,
    // delay
  }));

  // Spring for rotation
  const [rotate, apiRotate] = useSpring(() => ({
    // loop: true,
    from: { rotateZ: 0 },
    // to: { rotateZ: 360 },
    // config: { duration: 4000 }, // Adjust duration to control the rotation speed
  }));

  useEffect(() => {
    apiMove.start({
      loop: true,
      from: { y: -50 },
      to: { y: 110 },
      config: { duration: rotationDuration || 2000 }, // Duration for the vertical movement,
      delay
    });

    apiRotate.start({
      loop: true,
      from: { rotateZ: 0 },
      to: { rotateZ: 360 },
      config: { duration: 4000 },
    })
  }, [])

  return (
    <animated.svg
      style={{
        position: 'absolute',
        top: move.y.to(y => `${y}vh`),
        willChange: 'transform',
        transform: rotate.rotateZ.to(rotateZ => `rotate(${rotateZ}deg)`),
        zIndex: 0,
        ...style
      }}
    >
      {children}
    </animated.svg>
  );
}

RotatingBottleCap.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  delay: PropTypes.number,
  rotationDuration: PropTypes.number
}
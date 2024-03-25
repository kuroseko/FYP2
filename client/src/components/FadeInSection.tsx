import React from 'react';
import { useInView } from 'react-intersection-observer';
type Props = {
    children: React.ReactNode,
  
}

export default function FadeInSection ( {children}:Props ) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger animation once
    threshold: 0.25, // Trigger when 25% of the element is in view
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

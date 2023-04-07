import React, { useState, useEffect, useRef,useMemo } from 'react';

const PngSequence = ({ images, durationPerFrame, className, step }) => {
  const [loadedImages, setLoadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [countImages, setCount] = useState(0)
  const requestRef = useRef();
  const startTimeRef = useRef();
  const curentIndexRef = useRef(0)
  const loadedRef = useRef(0)

  const canvasRef = useRef(null);
  const devicePixelRatio = globalThis.devicePixelRatio || 1;
  const canvasWidth = globalThis.innerWidth * devicePixelRatio;
  const canvasHeight = globalThis.innerHeight * devicePixelRatio;
  
  useEffect(() => {
    const loadImages = async () => {
      const loadedImagesPromise = await Promise.all(
        images.map((image) => {
          return new Promise((resolve, reject) => {
            
            const img = new Image();
            img.onload = () => resolve(img)
            img.onerror = () => reject(`Failed to load ${image}`);
            img.src = image;
          });
        })
      );
      setLoadedImages(loadedImagesPromise);
      // setIsPlaying(true);
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const animationEndTime = (loadedImages.length - 1) * durationPerFrame;
      setAnimationDuration(animationEndTime);
      startTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [isPlaying]);



  useEffect(()=> {
    const canvas = canvasRef.current;
    if(canvas){
      let nextIndex = parseInt(loadedImages.length*step)
      
      setCurrentIndex(nextIndex);
      
      const ctx = canvas.getContext("2d");
      const currentImage = loadedImages[nextIndex];
      if(ctx && currentImage){
        ctx.drawImage(currentImage, 0, 0, canvasWidth, canvasHeight);
      }
    }

  }, [step])


  const animate = (timestamp) => {
    const speed = 0.5;
    
    const elapsedTime = timestamp - startTimeRef.current;
    const nextTimestamp = Math.abs(Math.floor(elapsedTime / (durationPerFrame / speed)))
    
    if(curentIndexRef.current===0){
        curentIndexRef.current = nextTimestamp
    }
   
    let  nextIndex = curentIndexRef.current - nextTimestamp
    
    setCurrentIndex(nextIndex);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const currentImage = loadedImages[nextIndex];
    ctx.drawImage(currentImage, 0, 0, canvasWidth, canvasHeight);

    if (nextIndex < loadedImages.length - 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if(canvasRef.current){
      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;
      const ctx = canvasRef.current.getContext("2d");
      const currentImage = loadedImages[0];
      console.log(ctx, currentImage)
      ctx.drawImage(currentImage, 0, 0, canvasWidth, canvasHeight);
      
    }
  }, [loadedImages])
  
  

  const startAnimation = () => {
    setIsPlaying(true);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
  };

  return (
     <>
     { loadedImages.length < images.length ? 
      <div className='absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]'>Loading images...</div> : 
      <canvas ref={canvasRef}  className={className} />
    }
     </> 
      
  );
};

export default PngSequence;

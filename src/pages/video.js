import PngSequence from "@/components/PngSequence";
import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState } from "react";

const images = [];

for (let i = 3; i <= 654; i++) {
  const fileName = `/video/VARA_Video_Anima_${i}.jpg`;
  images.push(fileName);
}

export default function Video() {
    const [animationStep, setAnimationStep] = useState(0)

    const StepCounter = () => {
        let scroll = useScroll()
        useFrame(() => {
            setAnimationStep(scroll.scroll.current)        
        })
        return null
    }
    return (
        <div>
        <PngSequence images={images} durationPerFrame={15}  className={`!w-screen fixed zIndex-0 !h-screen object-cover `} step={animationStep}/>
        <Canvas className="!w-screen !h-screen">
            <ScrollControls pages={4} damping={0.001}>
                <StepCounter/>
            </ScrollControls>
        </Canvas>
        </div>
    )
}
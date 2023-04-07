import Head from 'next/head'
import { Canvas } from '@react-three/fiber';
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, OrbitControls, ScrollControls, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import ParticleWrapper from '@/components/ParticleWrapper';
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas>
      <>
      <ambientLight intensity={1} />
      <directionalLight/>
      
      <ScrollControls pages={3}>
        <ParticleWrapper url={'/model1.glb'}/>
      </ScrollControls>
      </>
      </Canvas>
    </>
  )
}
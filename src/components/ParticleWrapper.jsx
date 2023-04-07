import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, GradientTexture, useScroll } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";


const Model = ({url}) => {
    const gltf = useGLTF(url);

    useEffect(()=> {
        console.log(url)
    }, [url])
  
    return <primitive scale={[3,3,3]} object={gltf.scene} />;
  };

const ParticleWrapper = ({ url }) => {
  const group = useRef();
  const loader = new GLTFLoader();
  const [model, setModel] = React.useState();
  const gltf = useGLTF(url);
  const scroll = useScroll()
  const rotationStart = new THREE.Vector3()
  const rotationEnd = new THREE.Vector3()
  const positionStart = new THREE.Vector3()
  const positionEnd = new THREE.Vector3(0,-110,0)
  

  React.useEffect(() => {
    if(gltf){
        var mesh = gltf.scene.getObjectByName('VARA_ALPHA')
        // console.log(mesh.children[2])
        mesh.position.y = 130
        // mesh.children[2].material.wireframe = true
  }
      setModel(gltf.scene);
      console.log(scroll)
      
    
  }, [gltf]);

  
  



  useFrame((state, delta) => {
    if (group.current) {
      const mesh = group.current;
    //   if(mesh.position.y > -110){
        //   mesh.rotation.z = scroll.scroll.current
          mesh.position.y = -110 * scroll.scroll.current
    //   }
      

      
    //   const particles = [];
    //   mesh.geometry.vertices.forEach((vertice) => {
    //     particles.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
    //   });
    //   mesh.geometry.dispose();
    //   mesh.geometry = new THREE.BufferGeometry().setFromPoints(particles);
    }
  });

  return model ? (
    <group ref={group}>
   <primitive scale={[0.5,0.5,0.5]} object={model}/>
        
    </group>
  ) : null;
};

export default ParticleWrapper;

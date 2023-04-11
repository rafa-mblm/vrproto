import React, { useEffect, useRef,useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, GradientTexture, useScroll, Points, Point, PointMaterial} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";


const Model = ({url}) => {
    const gltf = useGLTF(url);

    useEffect(()=> {
        console.log(url)
    }, [url])
  
    return <primitive scale={[3,3,3]} object={gltf.scene} />;
  };


function PointEvent(props) {
  
  return (
    <Point
      {...props}
      color={'orange'}
      
    />
  )
}

  const ParticleGeometry = ({geometry}) => {
      let positions = []
      var count = geometry.attributes.position.array.length / 3
      var colors = new Float32Array(geometry.attributes.position.array.length)
      geometry.attributes.position.array.forEach((p, i )=> {
        colors[i] = Math.random()
      })
      console.log(colors)
      console.log(geometry.attributes.position)
      geometry.setAttribute('color', new THREE.BufferAttribute(colors,3))

var material = new THREE.ShaderMaterial( {
    uniforms: {
      "color1": {
        type : "c",
        value: new THREE.Color(0x2753c9)
      },
      "color2": {
        type : "c",
        value: new THREE.Color(0x1dcdc0)
      }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec4 pos;

      void main() {
        vUv = uv;
        gl_PointSize = 4.0;
        pos = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        gl_Position = pos;
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec4 pos;

            void main() {
                if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                gl_FragColor = vec4(mix(color1, color2, smoothstep(-10.0, 10.0, pos.x)), 1.0);
            }
    `
  });

  
      useFrame(()=> {
        
      })
    return (
      <points >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometry.attributes.position.array.length / 3}
          array={geometry.attributes.position.array}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={geometry.attributes.position.array.length / 3}
          array={colors}
          itemSize={1}
        />
      </bufferGeometry>

      <shaderMaterial
      uniforms={{
        "color1": {
          type : "c",
          value: new THREE.Color(0xeba541)
        },
        "color2": {
          type : "c",
          value: new THREE.Color(0xaa4632)
        }
      }}
      vertexShader={`varying vec2 vUv;
      varying vec4 pos;

      void main() {
        vUv = uv;
        gl_PointSize = 10.0;
        pos = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        gl_Position = pos;
      }`}
      fragmentShader={`uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec4 pos;

            void main() {
                if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                gl_FragColor = vec4(mix(color1, color2, smoothstep(-10.0, 10.0, pos.y)), 0.8);
            }`}  />
      </points>
    )

    // return (
    //   <Points limit={positions.length} range={positions/2}>
    //     <PointMaterial transparent vertexColors size={1} sizeAttenuation={false} depthWrite={false} />
    //     {positions.map((position, i) => (
    //       <PointEvent key={i} position={position} />
    //     ))}
    //   </Points>
    // )
   
  }



const ParticleWrapper = ({ url }) => {
  const group = useRef();
  const loader = new GLTFLoader();
  const [model, setModel] = React.useState();
  const [vertices, setVertices] = React.useState();
  const gltf = useGLTF(url);
  const scroll = useScroll()
  const rotationStart = new THREE.Vector3()
  const rotationEnd = new THREE.Vector3()
  const positionStart = new THREE.Vector3()
  const positionEnd = new THREE.Vector3(0,-110,0)
  

  React.useEffect(() => {
    if(gltf){
        var mesh = gltf.scene.getObjectByName('VARA_METAL')
        mesh.traverse(i => {
          if(i.isMesh){
            i.material.metalness = 0.2
          }
        })
        // console.log(mesh.children[2])
        // mesh.position.y = 0.15
        // mesh.position.x = 0.005
        // mesh.children[2].material.wireframe = true
  }
      setModel(gltf.scene);  
    
  }, [gltf]);

  
  



  useFrame((state, delta) => {
    if (group.current) {
      const mesh = group.current;
      console.log(scroll.scroll.current)
      // if(mesh.position.y > -90){
          // mesh.rotation.z = scroll.scroll.current
          mesh.position.y = -90 * scroll.scroll.current
      // }
      

      
    //   const particles = [];
    //   mesh.geometry.vertices.forEach((vertice) => {
    //     particles.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
    //   });
    //   mesh.geometry.dispose();
    //   mesh.geometry = new THREE.BufferGeometry().setFromPoints(particles);
    }
  });
  const points = useRef();
  return model ? (
    <group scale={[500,500,500]}  ref={group}>
      <group position={[0,0.15,0]}>
      {model && model.children[0].children.map(i => {
        if(i.isMesh && i.name==="VARA_METAL_LIQUID002"){
          return <ParticleGeometry geometry={i.geometry}/>
        }
      })}
      </group>
    </group>
  ) : null;
};

export default ParticleWrapper;

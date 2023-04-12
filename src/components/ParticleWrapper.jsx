import React, { useEffect, useRef,useState, useMemo } from "react";
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
      
      const color1 = new THREE.Color("#eba541");
      const color2 = new THREE.Color("#aa4632");
      const color3 = new THREE.Color("#1e1e55");
      const color4 = new THREE.Color("#0a0a1e");
      
      const vertices = geometry.attributes.position.array;

    
      var colors = new Float32Array(vertices.length)
      var positions = new Float32Array(vertices.length)
      var positionsArr = []
      
      for (let i = 0; i < (vertices.length / 3); i++) {
        const i3 = i * 3
        positionsArr.push([vertices[i3 + 0],vertices[i3 + 1],vertices[i3 + 2]])
      }
      positionsArr.sort((a, b) => a[1] - b[1])
      const flatpos = positionsArr.flat()
      for (let i = 0; i < vertices.length; i++) {
        positions[i] = flatpos[i]
      }
      let t = THREE.MathUtils.smoothstep(positions[565],positionsArr[0][1],positionsArr[positionsArr.length-1][1])
      console.log(t, positions[925156], positionsArr[0][1], positionsArr[positionsArr.length-1][1], positionsArr.length-1)
      for (let i = 0; i < positions.length; i++) {
        // const t = (i * 3) / vertices.length;
        const t = ((100*i)/vertices.length)/100
        // Define the color stops for each color
        var stop1 = 0.0;
        var stop2 = 0.33;
        var stop3 = 0.66;
        var stop4 = 1.0;
        let color = new THREE.Color().lerpColors(color1, color4, 0);
        // Calculate the color for the current position
        if (t < stop2) {
          color = new THREE.Color().lerpColors(color1, color2, THREE.MathUtils.smoothstep(t,0,stop2));
        } else if (t < stop3) {
          color = new THREE.Color().lerpColors(color2, color3, THREE.MathUtils.smoothstep(t,stop2,stop3));
        } else {
          color = new THREE.Color().lerpColors(color3, color4, THREE.MathUtils.smoothstep(t,stop3,stop4));
        }
        // console.log(t)
        colors[i] = (color.r, color.g, color.b);
      }
      // console.log(positions)

      // Set the vertexColors property of the geometry to the colors array
      geometry.setAttribute("color", new THREE.BufferAttribute(colors,3));
      geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));

      // var count = geometry.attributes.position.array.length / 3
      // var colors = new Float32Array(geometry.attributes.position.array.length)
      // geometry.attributes.position.array.forEach((p, i )=> {
      //   colors[i] = Math.random()
      // })

      // const mouseRef = useRef(0)
      // // console.log(geometry.attributes.position)
      // geometry.setAttribute('color', new THREE.BufferAttribute(colors,3))
      
      const points = useRef();
      const radius = 2;
      const uniforms = useMemo(() => ({
        uTime: {
          value: 0.0
        },
        uRadius: {
          value: radius
        },
        uTexture: {
          value: new THREE.TextureLoader().load("/v.png")
        }
      }), [])
      useFrame((state, delta) => {
        const { clock } = state;
        
        // points.current.rotation.y += delta * 0.5
        // points.current.material.uniforms.uTime.value = clock.elapsedTime;

        

      });

      let showVertex = false
   
    return (
      <points ref={points} >
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
      {showVertex ? 
        <PointMaterial transparent vertexColors size={1} sizeAttenuation={false} depthWrite={false} /> :  // COLOR
        <PointMaterial transparent map={new THREE.TextureLoader().load("/v.png")} size={10} sizeAttenuation={false} depthWrite={false} /> // TEXTURE
      }
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
    <group scale={[700,500,200]}  ref={group}>
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

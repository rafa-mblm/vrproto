import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { Shape } from "three";
import parse from "svg-path-parser";
import { useEffect, useRef, useState } from "react";
import { Line, OrbitControls, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";

const LinePanel = ({points, ref}) => {
  const scroll = useScroll

  useFrame(() => {
    if(scroll.scroll){

      console.log(scroll.scroll.current)
    }
  })

return (
  <group>
  { true && points.length > 0 && points.map((path, index) => (
    <group ref={ref} visible={true} key={index}>
    <Line
    points={path}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
    color="black"                   // Default
    lineWidth={2}                   // In pixels (default)
    // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
    dashed={false}      
    // Default            // All THREE.LineMaterial props are valid
    />
    </group>
    ))}
    </group>
)
}

function SvgLines({ url }) {
    const [points, setPoints] = useState([])
    const [positions, setPositions] = useState()
    const lineRef = useRef(null)
  useEffect(()=> {
    console.log("foi")
    const svgLoader = new SVGLoader()
    svgLoader.load(url, function (svgData) {
      let pointsSVG = []
      var vertices2d = []
      svgData.paths.forEach((path, i) => {
        const shapes = path.toShapes(true);
        const geometry = new THREE.SphereGeometry( 0.01, 32, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        
        shapes.forEach((shape, j) => {
            const group = new THREE.Group();
            var vertices = []
            shape.extractPoints().shape.forEach(vec2 => {
                vertices.push(new THREE.Vector3(vec2.x/100, vec2.y/100, 0))
            })  
            // console.log(vertices)
            var curveTmp = new THREE.CatmullRomCurve3( vertices );

            const pointsTmp = curveTmp.getSpacedPoints(50);

            let curve = new THREE.CatmullRomCurve3( pointsTmp );
 
            const pointsCurve = curve.getSpacedPoints(100);

            pointsSVG.push(pointsCurve)


        });
        setPoints(pointsSVG)
    });

    })
  },[])

  useEffect(() => {
    console.log(points)
    setTimeout(()=> {
      console.log(lineRef.current)
      if(lineRef.current){
        setPositions(lineRef.current.children[0].geometry.attributes.instanceDistanceStart.array)
      }
    },10)
  },[points])
  
  useEffect(() => {
    // console.log(positions)
  },[positions])

  
  

  return (
    
    <Canvas gl={{antialias: true}}>
    

            <OrbitControls/>
            <ScrollControls pages={0}>
              <LinePanel ref={lineRef} points={points}/>
              </ScrollControls>
      </Canvas>
    
  );
}



export default function Svg() {

    return (
        <>
        <SvgLines url={`/curves.svg`}/>
        </>
    )
}
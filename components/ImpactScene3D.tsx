"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import type { Charity } from "@/lib/types";

const MAX_VISIBLE = 12;
const GRID_COLS = 4;
const OBJECT_SPACING = 0.55;
const PLOT_RADIUS = 5;

function HouseModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[0.26, 0.28, 0.26]} />
        <meshStandardMaterial color="#FBF6EE" />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.21, 0.18, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function MealModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.14, 0.05, 20]} />
        <meshStandardMaterial color="#FBF6EE" />
      </mesh>
      <mesh position={[0, 0.11, 0]} scale={[1, 0.6, 1]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function BottleModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.28, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 0.1, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

function TreeModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.18, 8]} />
        <meshStandardMaterial color="#6B4A34" />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <coneGeometry args={[0.14, 0.28, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function BookModel({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.03, 0]} rotation={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.24, 0.05, 0.18]} />
        <meshStandardMaterial color="#FBF6EE" />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

const MODELS: Record<string, (props: { color: string }) => React.ReactElement> = {
  "steady-ground": HouseModel,
  "baobab-relief": MealModel,
  "wellspring-water": BottleModel,
  "rootline-reforestation": TreeModel,
  "chalkline-education": BookModel,
};

function Plot({ charity, units, angle }: { charity: Charity; units: number; angle: number }) {
  const x = Math.cos(angle) * PLOT_RADIUS;
  const z = Math.sin(angle) * PLOT_RADIUS;
  const visibleCount = Math.min(units, MAX_VISIBLE);
  const overflow = units - visibleCount;
  const Model = MODELS[charity.id] ?? MealModel;

  const positions = useMemo(() => {
    const rows = Math.ceil(visibleCount / GRID_COLS) || 1;
    const list: [number, number][] = [];
    for (let i = 0; i < visibleCount; i++) {
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      list.push([(col - (GRID_COLS - 1) / 2) * OBJECT_SPACING, (row - (rows - 1) / 2) * OBJECT_SPACING]);
    }
    return list;
  }, [visibleCount]);

  const unitLabel = units === 1 ? charity.unitSingular : charity.unitPlural;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.08, 32]} />
        <meshStandardMaterial color={charity.tint} />
      </mesh>

      {positions.map(([px, pz], i) => (
        <group key={i} position={[px, 0.2, pz]} scale={1.15}>
          <Model color={charity.accent} />
        </group>
      ))}

      <Billboard position={[0, 2.1, 0]}>
        <Text
          fontSize={0.26}
          color="#3A2A21"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.012}
          outlineColor="#FFF8F0"
        >
          {charity.name}
        </Text>
        <Text position={[0, -0.32, 0]} fontSize={0.2} color={charity.accent} anchorX="center" anchorY="bottom">
          {units} {unitLabel}
          {overflow > 0 ? ` (+${overflow} more)` : ""}
        </Text>
      </Billboard>
    </group>
  );
}

interface ImpactScene3DProps {
  charities: Charity[];
  unitsByCharity: Record<string, number>;
}

export default function ImpactScene3D({ charities, unitsByCharity }: ImpactScene3DProps) {
  const angleStep = (Math.PI * 2) / charities.length;

  return (
    <Canvas shadows camera={{ position: [9, 7.5, 9], fov: 42 }} dpr={[1, 2]}>
      <color attach="background" args={["#F3E9DD"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />

      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.2, 0.3, 48]} />
        <meshStandardMaterial color="#DCC9A8" />
      </mesh>

      {charities.map((charity, i) => (
        <Plot
          key={charity.id}
          charity={charity}
          units={unitsByCharity[charity.id] ?? 0}
          angle={i * angleStep - Math.PI / 2}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={16}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 - 0.05}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}

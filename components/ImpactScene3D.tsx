"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Billboard, Clone, OrbitControls, Text, useGLTF } from "@react-three/drei";
import type { Object3D } from "three";
import type { Charity } from "@/lib/types";

const MAX_VISIBLE = 12;
const GRID_COLS = 4;
const OBJECT_SPACING = 1.15;
const DISTRICT_DISTANCE = 5.5;
const MODEL_BASE = "/models/town/";

const MODEL_FILES = [
  "wall.glb",
  "wall-door.glb",
  "wall-window-glass.glb",
  "roof-gable.glb",
  "roof-high-gable.glb",
  "stall.glb",
  "stall-green.glb",
  "stall-red.glb",
  "fountain-round.glb",
  "fountain-center.glb",
  "tree.glb",
  "tree-high.glb",
  "tree-crooked.glb",
  "tree-high-round.glb",
] as const;

for (const file of MODEL_FILES) useGLTF.preload(MODEL_BASE + file);

const MODEL_URLS = MODEL_FILES.map((file) => MODEL_BASE + file);

function useTownModels() {
  const gltfs = useGLTF(MODEL_URLS);
  const [
    wall,
    wallDoor,
    wallWindow,
    roofGable,
    roofHighGable,
    stall,
    stallGreen,
    stallRed,
    fountainRound,
    fountainCenter,
    tree,
    treeHigh,
    treeCrooked,
    treeHighRound,
  ] = gltfs.map((g) => g.scene);

  return {
    wall,
    wallDoor,
    wallWindow,
    roofGable,
    roofHighGable,
    stalls: [stall, stallGreen, stallRed],
    fountains: [fountainRound, fountainCenter],
    trees: [tree, treeHigh, treeCrooked, treeHighRound],
  };
}

type TownModels = ReturnType<typeof useTownModels>;

function House({ models, seed }: { models: TownModels; seed: number }) {
  const doorSide = seed % 4;
  return (
    <group>
      {[0, 1, 2, 3].map((side) => (
        <Clone
          key={side}
          object={side === doorSide ? models.wallDoor : models.wall}
          rotation={[0, (Math.PI / 2) * side, 0]}
        />
      ))}
      <Clone object={models.roofGable} position={[0, 1, 0]} />
    </group>
  );
}

function School({ models, seed }: { models: TownModels; seed: number }) {
  const doorSide = seed % 4;
  return (
    <group scale={0.85}>
      {[0, 1].map((level) =>
        [0, 1, 2, 3].map((side) => (
          <Clone
            key={`${level}-${side}`}
            object={level === 0 && side === doorSide ? models.wallDoor : models.wallWindow}
            position={[0, level, 0]}
            rotation={[0, (Math.PI / 2) * side, 0]}
          />
        )),
      )}
      <Clone object={models.roofHighGable} position={[0, 2, 0]} />
    </group>
  );
}

function FoodStand({ models, seed }: { models: TownModels; seed: number }) {
  const variant = models.stalls[seed % models.stalls.length];
  return <Clone object={variant} rotation={[0, (seed % 4) * (Math.PI / 2), 0]} />;
}

function Well({ models, seed }: { models: TownModels; seed: number }) {
  const variant = models.fountains[seed % models.fountains.length];
  return <Clone object={variant} scale={0.5} />;
}

function TreeInstance({ models, seed }: { models: TownModels; seed: number }) {
  const variant = models.trees[seed % models.trees.length];
  return <Clone object={variant} scale={0.65} rotation={[0, seed * 0.9, 0]} />;
}

const BUILDINGS: Record<string, (props: { models: TownModels; seed: number }) => React.ReactElement> = {
  "steady-ground": House,
  "baobab-relief": FoodStand,
  "wellspring-water": Well,
  "rootline-reforestation": TreeInstance,
  "chalkline-education": School,
};

function StonePath({ angle, distance }: { angle: number; distance: number }) {
  const steps = 6;
  const tiles = useMemo(
    () =>
      Array.from({ length: steps }, (_, i) => {
        const t = (i + 0.5) / steps;
        return [Math.cos(angle) * distance * t, Math.sin(angle) * distance * t] as const;
      }),
    [angle, distance],
  );

  return (
    <>
      {tiles.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.021, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.32, 8]} />
          <meshStandardMaterial color="#C9B08A" />
        </mesh>
      ))}
    </>
  );
}

function District({
  charity,
  units,
  angle,
  models,
}: {
  charity: Charity;
  units: number;
  angle: number;
  models: TownModels;
}) {
  const cx = Math.cos(angle) * DISTRICT_DISTANCE;
  const cz = Math.sin(angle) * DISTRICT_DISTANCE;
  const visibleCount = Math.min(units, MAX_VISIBLE);
  const overflow = units - visibleCount;
  const Building = BUILDINGS[charity.id] ?? FoodStand;

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
  const facing = angle + Math.PI;

  return (
    <>
      <StonePath angle={angle} distance={DISTRICT_DISTANCE} />
      <group position={[cx, 0, cz]} rotation={[0, facing, 0]}>
        {positions.map(([px, pz], i) => (
          <group key={i} position={[px, 0, pz]}>
            <Building models={models} seed={i} />
          </group>
        ))}

        <Billboard position={[0, 3.1, 0]}>
          <Text
            fontSize={0.28}
            color="#3A2A21"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.014}
            outlineColor="#FFF8F0"
          >
            {charity.name}
          </Text>
          <Text position={[0, -0.34, 0]} fontSize={0.21} color={charity.accent} anchorX="center" anchorY="bottom">
            {units} {unitLabel}
            {overflow > 0 ? ` (+${overflow} more)` : ""}
          </Text>
        </Billboard>
      </group>
    </>
  );
}

function Town({ charities, unitsByCharity }: { charities: Charity[]; unitsByCharity: Record<string, number> }) {
  const models = useTownModels();
  const angleStep = (Math.PI * 2) / charities.length;
  const centerFountain = models.fountains[0] as Object3D;

  return (
    <>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[9, 9, 0.3, 48]} />
        <meshStandardMaterial color="#A9C08C" />
      </mesh>

      <Clone object={centerFountain} scale={0.7} position={[0, 0.02, 0]} />

      {charities.map((charity, i) => (
        <District
          key={charity.id}
          charity={charity}
          units={unitsByCharity[charity.id] ?? 0}
          angle={i * angleStep - Math.PI / 2}
          models={models}
        />
      ))}
    </>
  );
}

interface ImpactScene3DProps {
  charities: Charity[];
  unitsByCharity: Record<string, number>;
}

export default function ImpactScene3D({ charities, unitsByCharity }: ImpactScene3DProps) {
  return (
    <Canvas shadows camera={{ position: [11, 9, 11], fov: 42 }} dpr={[1, 2]}>
      <color attach="background" args={["#F3E9DD"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 10, 4]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} />

      <Suspense fallback={null}>
        <Town charities={charities} unitsByCharity={unitsByCharity} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={20}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 - 0.05}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

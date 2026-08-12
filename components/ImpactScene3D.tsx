"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Clone, OrbitControls, useGLTF } from "@react-three/drei";
import { PlaneGeometry } from "three";
import type { Charity } from "@/lib/types";

const MAX_VISIBLE = 12;
const MODEL_BASE = "/models/town/";

// Sunflower-seed spiral: even, non-overlapping placement that grows outward
// as more buildings are added, instead of grouping by type.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPIRAL_SPACING = 1.55;
const SPIRAL_START = 3; // keeps the first few slots clear of the center fountain

function spiralPosition(index: number): readonly [number, number] {
  const i = index + SPIRAL_START;
  const r = SPIRAL_SPACING * Math.sqrt(i);
  const theta = i * GOLDEN_ANGLE;
  return [Math.cos(theta) * r, Math.sin(theta) * r];
}

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

interface Placement {
  charity: Charity;
  seed: number;
}

/** Round-robins across charities so neighboring buildings are usually different types. */
function buildPlacementOrder(charities: Charity[], unitsByCharity: Record<string, number>): Placement[] {
  const counts = charities.map((c) => Math.min(unitsByCharity[c.id] ?? 0, MAX_VISIBLE));
  const order: Placement[] = [];
  let round = 0;
  let remaining = counts.reduce((a, b) => a + b, 0);
  while (remaining > 0) {
    charities.forEach((charity, ci) => {
      if (round < counts[ci]) {
        order.push({ charity, seed: round });
        remaining--;
      }
    });
    round++;
  }
  return order;
}

function SpiralPath({ count }: { count: number }) {
  const steps = Math.max(count * 2, 8);
  const tiles = useMemo(
    () => Array.from({ length: steps }, (_, i) => spiralPosition(i / 2 - SPIRAL_START * 0.5)),
    [steps],
  );

  return (
    <>
      {tiles.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.021, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.26, 8]} />
          <meshStandardMaterial color="#C9B08A" />
        </mesh>
      ))}
    </>
  );
}

/** A large low-poly terrain: flat near the town, gently faceted further out. */
function Landscape() {
  const geometry = useMemo(() => {
    const size = 90;
    const segments = 32;
    const geo = new PlaneGeometry(size, size, segments, segments);
    const pos = geo.attributes.position;
    const townRadius = 14;
    const outerRadius = size / 2;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const falloff = Math.max(0, Math.min(1, (dist - townRadius) / (outerRadius - townRadius)));
      const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const noise = (hash - Math.floor(hash)) * 2 - 1;
      pos.setZ(i, noise * 1.6 * falloff);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <meshStandardMaterial color="#A0BE7E" flatShading />
    </mesh>
  );
}

function Town({ charities, unitsByCharity }: { charities: Charity[]; unitsByCharity: Record<string, number> }) {
  const models = useTownModels();
  const placements = useMemo(() => buildPlacementOrder(charities, unitsByCharity), [charities, unitsByCharity]);
  const centerFountain = models.fountains[0];

  return (
    <>
      <Landscape />
      <SpiralPath count={placements.length} />
      <Clone object={centerFountain} scale={0.7} position={[0, 0.02, 0]} />

      {placements.map((p, i) => {
        const [x, z] = spiralPosition(i);
        const Building = BUILDINGS[p.charity.id] ?? FoodStand;
        const facing = Math.atan2(z, x);
        return (
          <group key={`${p.charity.id}-${p.seed}`} position={[x, 0, z]} rotation={[0, facing, 0]}>
            <Building models={models} seed={p.seed} />
          </group>
        );
      })}
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
        maxDistance={26}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 - 0.05}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Clone, OrbitControls, useGLTF } from "@react-three/drei";
import { PlaneGeometry } from "three";
import type { Charity } from "@/lib/types";

const MAX_VISIBLE = 12;
const MODEL_BASE = "/models/town/";

// Two streets meeting at the town square: a main street running out along
// +X, and a cross street along +Z once the main street fills up. Both wind
// gently rather than running dead straight. Buildings line both sides,
// facing the road, and the road itself grows as more get added.
const ROAD_SPACING = 2.3;
const ROAD_AMPLITUDE = 1.5;
const ROAD_FREQUENCY = 0.3;
const ROAD_SETBACK = 1.4;
const MAIN_STREET_SLOTS = 12;

type RoadAxis = "main" | "cross";

function roadCenter(axis: RoadAxis, t: number): readonly [number, number] {
  const along = t * ROAD_SPACING;
  const wave = Math.sin(t * ROAD_FREQUENCY) * ROAD_AMPLITUDE;
  return axis === "main" ? [along, wave] : [wave, along];
}

function roadTangentAngle(axis: RoadAxis, t: number): number {
  const [x0, z0] = roadCenter(axis, t - 0.02);
  const [x1, z1] = roadCenter(axis, t + 0.02);
  return Math.atan2(z1 - z0, x1 - x0);
}

/** Where the i-th building along the street network sits, and which way it should face. */
function streetSlot(index: number): { position: readonly [number, number]; facing: number } {
  const axis: RoadAxis = index < MAIN_STREET_SLOTS ? "main" : "cross";
  const localIndex = index < MAIN_STREET_SLOTS ? index : index - MAIN_STREET_SLOTS;
  const side = localIndex % 2 === 0 ? 1 : -1;
  const t = Math.floor(localIndex / 2) + 1;

  const [cx, cz] = roadCenter(axis, t);
  const tangent = roadTangentAngle(axis, t);
  const perpendicular = tangent + Math.PI / 2;

  const bx = cx + Math.cos(perpendicular) * ROAD_SETBACK * side;
  const bz = cz + Math.sin(perpendicular) * ROAD_SETBACK * side;
  const facing = perpendicular + (side > 0 ? Math.PI : 0);

  return { position: [bx, bz], facing };
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

/** A paved strip of tiles following one road's centerline out to `lengthT`. */
function RoadStrip({ axis, lengthT }: { axis: RoadAxis; lengthT: number }) {
  const tiles = useMemo(() => {
    const stepsPerUnit = 1.8;
    const count = Math.max(Math.ceil(lengthT * stepsPerUnit), 2);
    return Array.from({ length: count + 1 }, (_, i) => {
      const t = (i / count) * lengthT;
      const [x, z] = roadCenter(axis, t);
      const angle = roadTangentAngle(axis, t);
      return { x, z, angle };
    });
  }, [axis, lengthT]);

  return (
    <>
      {tiles.map(({ x, z, angle }, i) => (
        <mesh key={i} position={[x, 0.021, z]} rotation={[-Math.PI / 2, 0, angle]} receiveShadow>
          <planeGeometry args={[1.7, 1.15]} />
          <meshStandardMaterial color="#C9B08A" />
        </mesh>
      ))}
    </>
  );
}

/** A large low-poly terrain: flat near the town, gently faceted further out. */
function Landscape() {
  const geometry = useMemo(() => {
    // Sized to comfortably cover the cross street's worst case (all five
    // charities maxed out at 12 buildings each spills ~48 onto the cross
    // street, reaching roughly 55 units out).
    const size = 160;
    const segments = 40;
    const geo = new PlaneGeometry(size, size, segments, segments);
    const pos = geo.attributes.position;
    const townRadius = 16;
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

  const mainSlotsUsed = Math.min(placements.length, MAIN_STREET_SLOTS);
  const crossSlotsUsed = Math.max(placements.length - MAIN_STREET_SLOTS, 0);
  const mainLengthT = mainSlotsUsed > 0 ? Math.ceil(mainSlotsUsed / 2) + 0.5 : 0;
  const crossLengthT = crossSlotsUsed > 0 ? Math.ceil(crossSlotsUsed / 2) + 0.5 : 0;

  return (
    <>
      <Landscape />
      {mainLengthT > 0 && <RoadStrip axis="main" lengthT={mainLengthT} />}
      {crossLengthT > 0 && <RoadStrip axis="cross" lengthT={crossLengthT} />}
      <Clone object={centerFountain} scale={0.7} position={[0, 0.02, 0]} />

      {placements.map((p, i) => {
        const { position, facing } = streetSlot(i);
        const [x, z] = position;
        const Building = BUILDINGS[p.charity.id] ?? FoodStand;
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

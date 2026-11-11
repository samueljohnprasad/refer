// ponytail: exact full-fidelity Happi panda rig and thought cloud from .agents/onboarding.html
import React from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  ClipPath,
  G,
  Path,
  Circle,
  Ellipse,
  Rect,
  Line,
} from 'react-native-svg';

export interface HappiGuideStageProps {
  weather: number;
  size?: 'hero' | 'compact' | 'mini';
}

const INK = '#252525';

export function HappiGuideStage({
  weather,
  size = 'compact',
}: HappiGuideStageProps): React.JSX.Element {
  const isHero = size === 'hero';
  const isMini = size === 'mini';
  const width = isHero ? 220 : isMini ? 76 : 148;
  const height = isHero ? 220 : isMini ? 76 : 148;

  // Cloud parting calculation matching prototype
  const cloudColor = weather > 0.5 ? '#a9bfa0' : '#e4eee0';
  const sunOpacity = Math.max(0, Math.min(1, 1.15 - weather * 1.4));

  return (
    <View style={{ width, height }} className="items-center justify-center">
      <Svg viewBox="44 0 236 240" width="100%" height="100%">
        <Defs>
          <ClipPath id="happi-eye-clip-stage">
            <Ellipse cx={99} cy={99} rx={18.5} ry={17.5} />
            <Ellipse cx={165.5} cy={102.75} rx={18} ry={17.75} />
          </ClipPath>
        </Defs>

        {/* Sun */}
        <G opacity={sunOpacity} transform="translate(240, 36)">
          <Circle r={11} fill="#F5B942" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i * Math.PI) / 4;
            return (
              <Line
                key={i}
                x1={Math.cos(a) * 14}
                y1={Math.sin(a) * 14}
                x2={Math.cos(a) * 18}
                y2={Math.sin(a) * 18}
                stroke="#F5B942"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
        </G>

        {/* Thought Cloud Prop */}
        <G fill={cloudColor}>
          <Rect x={220} y={29} width={50} height={12} rx={6} />
          <Circle cx={229} cy={30} r={11} />
          <Circle cx={245} cy={22} r={14} />
          <Circle cx={260} cy={31} r={10} />
        </G>

        {/* Floor shadow */}
        <Ellipse cx={130} cy={229} rx={54} ry={8} fill="#BCD0AF" />

        {/* Panda Body & Legs */}
        <G>
          {/* Feet */}
          <Path
            d="M97 200 L99 218 C100 226 105 229 111 229 C118 229 123 226 124 219 L125 206 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />
          <Path
            d="M135 206 L136 219 C137 226 142 229 149 229 C155 229 160 226 161 218 L163 200 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />

          {/* Torso */}
          <Path
            d="M96 150 C92 172 93 196 98 210 C104 216 156 216 162 210 C167 196 168 172 164 150 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />
          <Path
            d="M104 166 C100 180 100 196 104 206 C116 212 144 212 156 206 C160 196 160 180 156 166 C150 158 110 158 104 166 Z"
            fill="#FFF"
          />
          {/* Heart on chest */}
          <Path
            d="M131.5 183 C127 175 117 177 118.5 186 C119.5 192 126 196 131.5 199.5 C137 196 143.5 192 144.5 186 C146 177 136 175 131.5 183 Z"
            fill="#C8BEE6"
          />
          <Path d="M118 205 Q130 209.5 142.5 205.5" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />

          {/* Right Arm */}
          <Path d="M149 158 A11 11 0 0 1 171 158 L171 172 A11 11 0 0 1 149 172 Z" fill={INK} stroke={INK} strokeWidth={5.5} />
          <Path d="M149 172 A11 11 0 0 1 171 172 L172.5 186 A12.5 12.5 0 0 1 147.5 186 Z" fill={INK} stroke={INK} strokeWidth={5.5} />

          {/* Left Arm waving */}
          <Path d="M87 158 A11 11 0 0 1 109 158 L109 172 A11 11 0 0 1 87 172 Z" fill={INK} stroke={INK} strokeWidth={5.5} />
          <Path d="M87 172 A11 11 0 0 1 109 172 L110.5 186 A12.5 12.5 0 0 1 85.5 186 Z" fill={INK} stroke={INK} strokeWidth={5.5} />

          {/* Ears */}
          <Path
            d="M60 36 C66 22 86 18 98 26 C108 33 108 50 100 60 C90 70 70 70 62 60 C56 53 56 44 60 36 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />
          <Path
            d="M164 40 C172 30 192 30 200 42 C207 53 205 68 196 74 C186 80 170 76 165 66 C161 58 160 48 164 40 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />

          {/* Head */}
          <Path
            d="M66 64 C84 46 104 40 118 40 C124 35 132 33 136 37 C158 38 182 44 196 64 C208 82 212 106 208 124 C204 144 186 158 160 163 C140 166 122 166 102 163 C76 158 55 142 52 112 C51 92 56 76 66 64 Z"
            fill="#FFF"
            stroke={INK}
            strokeWidth={5.5}
            strokeLinejoin="round"
          />
          <Path
            d="M131 35 Q138 38 136 47 Q135 52 132 51 M141 45 Q146 49 144 55"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Eye patches */}
          <Ellipse cx={97.5} cy={99} rx={25.5} ry={25} fill={INK} transform="rotate(-8 97.5 99)" />
          <Ellipse cx={166} cy={102.5} rx={25.5} ry={25.5} fill={INK} transform="rotate(6 166 102.5)" />

          {/* Eyes whites */}
          <Ellipse cx={99} cy={99} rx={18.5} ry={17.5} fill="#FFF" />
          <Ellipse cx={165.5} cy={102.75} rx={18} ry={17.75} fill="#FFF" />

          {/* Pupils & highlights */}
          <Circle cx={100.5} cy={101} r={14} fill={INK} />
          <Circle cx={164.5} cy={105} r={14} fill={INK} />
          <Circle cx={95.5} cy={93.5} r={3.3} fill="#FFF" />
          <Circle cx={91.5} cy={99.5} r={2} fill="#FFF" />
          <Circle cx={159.5} cy={97} r={3} fill="#FFF" />
          <Circle cx={155.5} cy={103} r={2} fill="#FFF" />

          {/* Cheeks */}
          <Ellipse cx={99} cy={129} rx={24} ry={12} fill="#F9DEE1" opacity={0.6} />
          <Ellipse cx={165.5} cy={133} rx={24} ry={12} fill="#F9DEE1" opacity={0.6} />

          {/* Nose & Mouth */}
          <Ellipse cx={131.75} cy={113.75} rx={7} ry={4.6} fill={INK} />
          <Path
            d="M121 122 Q123.5 127.5 127 126 Q130 125 132 122.5 Q134 125.5 137 126 Q140.5 127.5 142.5 122.5"
            fill="none"
            stroke={INK}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
}

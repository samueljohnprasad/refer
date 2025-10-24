declare module 'victory-native-v4' {
  import { ReactNode } from 'react';

  export interface ChartBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export interface CartesianChartProps {
    data: any[];
    xKey: string;
    yKeys: string[];
    domainPadding?: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
    axisOptions?: {
      font?: any;
      tickCount?: { x?: number; y?: number };
      formatXLabel?: (value: number) => string;
      formatYLabel?: (value: number) => string;
      labelColor?: string;
      labelPosition?: { x?: string; y?: string };
      axisSide?: { x?: string; y?: string };
    };
    children?: ((props: { points: any; chartBounds: ChartBounds }) => ReactNode) | ReactNode;
  }

  export interface LineProps {
    points: Point[];
    color?: string;
    strokeWidth?: number;
    curveType?: 'linear' | 'natural' | 'step' | 'catmullRom';
  }

  export interface AreaProps {
    points: Point[];
    y0?: number;
    color?: string;
    opacity?: number;
    curveType?: 'linear' | 'natural' | 'step' | 'catmullRom';
  }

  export const CartesianChart: React.FC<CartesianChartProps>;
  export const Line: React.FC<LineProps>;
  export const Area: React.FC<AreaProps>;
  export const useChartPressState: (initialState?: any) => any;
}

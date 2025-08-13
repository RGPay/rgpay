import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";

// Defining interface with the proper echarts option type
interface ReactEChartsProps {
  option: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
}

const ReactECharts: React.FC<ReactEChartsProps> = ({
  option,
  style,
  className,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: echarts.ECharts | undefined;

    if (chartRef.current) {
      chart = echarts.init(chartRef.current);
      // Avoid versioned type conflicts between @types/echarts (v4) and echarts (v5)
      (chart as any).setOption(option as any);
    }

    function resizeChart() {
      chart?.resize();
    }

    window.addEventListener("resize", resizeChart);

    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [option]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "300px", ...style }}
      className={className}
    />
  );
};

export default ReactECharts;

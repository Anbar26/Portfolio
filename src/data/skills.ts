import {
  siPytorch, siTensorflow, siKeras, siScikitlearn, siOpencv, siHuggingface,
  siPython, siTypescript, siJavascript, siR, siPostgresql, siPandas, siNumpy, siGit,
  siGooglecloud, siDocker, siKubernetes, siMlflow, siJupyter,
} from "simple-icons";

// AWS was removed from simple-icons over branding — use a filled cloud glyph in AWS orange.
export const awsIcon = {
  title: "AWS",
  hex: "FF9900",
  path: "M6.5 20q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48Q3.35 9.57 5.25 9.15q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 6.07 19 9q1.73.2 2.86 1.5Q23 11.79 23 13.5q0 1.87-1.31 3.19Q20.37 18 18.5 18H6.5Z",
};

export type Glyph = { title: string; hex: string; path: string };

/**
 * Three groups — deliberately three, because the Skills section renders them as
 * the three cards of the Flip transition. Adding a fourth group would need the
 * stacked-fan offsets in globals.css to grow too.
 */
export const skillGroups: {
  title: string;
  items: { icon: Glyph; label: string }[];
}[] = [
  {
    title: "Machine Learning & AI",
    items: [
      { icon: siPytorch, label: "PyTorch" },
      { icon: siTensorflow, label: "TensorFlow" },
      { icon: siKeras, label: "Keras" },
      { icon: siScikitlearn, label: "scikit-learn" },
      { icon: siOpencv, label: "OpenCV" },
      { icon: siHuggingface, label: "Hugging Face" },
    ],
  },
  {
    title: "Programming & Data",
    items: [
      { icon: siPython, label: "Python" },
      { icon: siTypescript, label: "TypeScript" },
      { icon: siJavascript, label: "JavaScript" },
      { icon: siR, label: "R" },
      { icon: siPostgresql, label: "SQL" },
      { icon: siPandas, label: "pandas" },
      { icon: siNumpy, label: "NumPy" },
      { icon: siGit, label: "Git" },
    ],
  },
  {
    title: "Platforms & Tools",
    items: [
      { icon: awsIcon, label: "AWS" },
      { icon: siGooglecloud, label: "GCP" },
      { icon: siDocker, label: "Docker" },
      { icon: siKubernetes, label: "Kubernetes" },
      { icon: siMlflow, label: "MLflow" },
      { icon: siJupyter, label: "Jupyter" },
    ],
  },
];

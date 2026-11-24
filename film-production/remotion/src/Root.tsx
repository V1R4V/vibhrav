import {
  Composition,
  cancelRender,
  continueRender,
  delayRender,
} from "remotion";
import { NuraContext } from "./NuraContext";
import { Nura } from "./Nura";
import { StudyFlow } from "./StudyFlow";
import { Vyaya } from "./Vyaya";
import { fontsReady } from "./system";

const handle = delayRender("Load product typography");
fontsReady.then(() => continueRender(handle)).catch(cancelRender);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NuraContext"
        component={NuraContext}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1620}
      />
      <Composition
        id="Nura"
        component={Nura}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1380}
      />
      <Composition
        id="StudyFlow"
        component={StudyFlow}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1320}
      />
      <Composition
        id="Vyaya"
        component={Vyaya}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1020}
      />
    </>
  );
};

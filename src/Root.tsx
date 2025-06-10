import "./index.css";
import { Composition } from "remotion";
import { continueRender, delayRender, staticFile } from "remotion";
import {StartBridgeAd} from './StartBridgeAd';
import {CreeFicheAd} from './CreeFicheAd';

const robotoBold = delayRender();
const robotoLight = delayRender();
const robotoMedium = delayRender();
const robotoRegular = delayRender();
const robotoMonoMedium = delayRender();

Promise.all([
  loadFont(staticFile("Roboto-Bold.ttf"), "Roboto-Bold", { handle: robotoBold }),
  loadFont(staticFile("Roboto-Light.ttf"), "Roboto-Light", { handle: robotoLight }),
  loadFont(staticFile("Roboto-Medium.ttf"), "Roboto-Medium", { handle: robotoMedium }),
  loadFont(staticFile("Roboto-Regular.ttf"), "Roboto-Regular", { handle: robotoRegular }),
  loadFont(staticFile("RobotoMono-Medium.ttf"), "RobotoMono-Medium", { handle: robotoMonoMedium }),
])
  .then(() => {
    continueRender(robotoBold);
    continueRender(robotoLight);
    continueRender(robotoMedium);
    continueRender(robotoRegular);
    continueRender(robotoMonoMedium);
  })
  .catch((err) => console.error("Error loading font", err));

function loadFont(url: string, family: string, { handle }: { handle: any }) {
  const font = new FontFace(family, `url(${url})`);
  font.load().then(() => {
    document.fonts.add(font);
  });
  return font.ready;
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StartBridgeAd"
        component={StartBridgeAd}
        durationInFrames={1440}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CreeFicheAd"
        component={CreeFicheAd}
        durationInFrames={1290}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
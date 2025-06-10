// src/CreeFicheAd.tsx
import {
  AbsoluteFill,
  Audio,
  Img,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import React from 'react';

/* ───────────────────────── HELPERS ───────────────────────── */

// Réutilisation du composant SlideText avec backdrop-filter
const SlideText: React.FC<{
  children: React.ReactNode;
  from: number;
  duration: number;
  exit?: boolean;
  bg?: string;
  textBg?: string;
  backdropBlur?: string;
}> = ({ children, from, duration, exit = true, bg = 'transparent', textBg = 'transparent', backdropBlur = '0px' }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // entrée (slide-in) depuis la droite
  const progressIn = spring({
    fps,
    frame: frame - from,
    config: { damping: 200, mass: 1 },
  });
  const translateX = interpolate(progressIn, [0, 1], [width, 0]);
  const opacityIn = progressIn;

  // sortie (slide-out) vers la gauche si exit = true
  const progressOut = exit
    ? spring({
        fps,
        frame: frame - (from + duration - fps * 0.5),
        config: { damping: 200, mass: 1 },
      })
    : 0;
  const translateXOut = interpolate(progressOut, [0, 1], [0, -width]);
  const opacityOut = exit ? interpolate(progressOut, [0, 1], [1, 0]) : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        backdropFilter: `blur(${backdropBlur})`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        fontFamily: 'Roboto-Bold, sans-serif',
        fontWeight: 700,
        fontSize: 80,
        color: 'white',
        textAlign: 'center',
        transform: `translateX(${translateX + translateXOut}px)`,
        opacity: opacityIn * opacityOut,
      }}
    >
      <span style={{ backgroundColor: textBg, padding: '20px 30px', borderRadius: '50px' }}>
        {children}
      </span>
    </AbsoluteFill>
  );
};

// Composant pour les transitions avant/après
const BeforeAfterTransition: React.FC<{
  from: number;
  duration: number;
  beforeImage: string;
  afterImage: string;
}> = ({ from, duration, beforeImage, afterImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vérifier si nous sommes dans la plage de temps active
  const localFrame = frame - from;
  const isActive = localFrame >= 0 && localFrame <= duration;
  
  // Si nous ne sommes pas dans la plage active, ne rien afficher
  if (!isActive) {
    return null;
  }
  
  // Sortie du before, entrée du after
  const progress = spring({
    fps,
    frame: localFrame,
    config: { damping: 20, mass: 0.5 },
  });

  const beforeOpacity = interpolate(progress, [0, 0.5], [1, 0], {
    extrapolateRight: 'clamp',
  });
  const afterOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <SafeImage
        src={staticFile(beforeImage)}
        alt={`Before image: ${beforeImage}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: beforeOpacity,
        }}
        fallbackText={`Error loading ${beforeImage}`}
      />
      <SafeImage
        src={staticFile(afterImage)}
        alt={`After image: ${afterImage}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: afterOpacity,
        }}
        fallbackText={`Error loading ${afterImage}`}
      />
    </AbsoluteFill>
  );
};

// Composant pour le logo StartBridge animé
const AnimatedLogo: React.FC<{ from: number; duration: number }> = ({
  from,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vérifier si nous sommes dans la plage de temps active
  const localFrame = frame - from;
  const isActive = localFrame >= 0 && localFrame <= duration;
  
  // Si nous ne sommes pas dans la plage active, ne rien afficher
  if (!isActive) {
    return null;
  }

  const progress = spring({
    fps,
    frame: localFrame,
    config: { damping: 30, mass: 0.8 },
  });

  const scale = interpolate(progress, [0, 0.3, 1], [0.8, 1.1, 1]);
  const opacity = interpolate(progress, [0, 0.2], [0, 1]);
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          textAlign: 'center',
          fontFamily: 'Roboto-Bold, sans-serif',
          fontSize: 120,
          color: '#0089e6',
          padding: '20px 40px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 137, 230, 0.2)',
        }}
      >
        StartBridge
      </div>
    </AbsoluteFill>
  );
};

// Bouton CTA animé
const AnimatedCTAButton: React.FC<{ from: number; duration: number }> = ({
  from,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vérifier si nous sommes dans la plage de temps active
  const localFrame = frame - from;
  const isActive = localFrame >= 0 && localFrame <= duration || frame >= from; // Toujours afficher après le début
  
  // Si nous ne sommes pas dans la plage active, ne rien afficher
  if (!isActive) {
    return null;
  }

  const progress = spring({
    fps,
    frame: localFrame,
    config: { damping: 20, mass: 0.6 },
  });

  const scale = interpolate(progress, [0, 0.6, 0.8], [0.8, 1.1, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1]);
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          padding: '20px 40px',
          backgroundColor: '#e3a41b',
          borderRadius: '50px',
          fontFamily: 'Roboto-Bold, sans-serif',
          fontSize: 60,
          color: 'white',
          marginBottom: 60,
          cursor: 'pointer',
        }}
      >
        Créer ma fiche
      </div>

      <div
        style={{
          opacity: opacity,
          fontSize: 36,
          fontFamily: 'Roboto-Regular, sans-serif',
          color: '#333',
          marginTop: 20,
        }}
      >
        → Essayez maintenant sur startbridge.io
      </div>
    </AbsoluteFill>
  );
};

// Composant d'image avec fallback en cas d'erreur (réutilisé de StartBridgeAd)
const SafeImage: React.FC<{
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  fallbackText?: string;
}> = ({ src, alt = '', style = {}, fallbackText }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div
        style={{
          ...style,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#555',
          fontSize: '24px',
        }}
      >
        {fallbackText || 'Image non disponible'}
      </div>
    );
  }

  return (
    <Img
      src={src}
      alt={alt}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

// Composant pour les captures d'écran avec zoom
const ScreenCapture: React.FC<{
  from: number;
  duration: number;
  imageSrc: string;
}> = ({ from, duration, imageSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculer la progression uniquement si nous sommes dans la plage de temps désirée
  const localFrame = frame - from;
  const isActive = localFrame >= 0 && localFrame <= duration;
  
  // Utiliser une progression forcée à 0 ou 1 pour éviter les problèmes de timing
  const progress = isActive
    ? spring({
        fps,
        frame: localFrame,
        config: { damping: 100, mass: 1 },
      })
    : 0;

  const scale = interpolate(progress, [0, 1], [0.95, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1]);
  
  // Si nous ne sommes pas dans la plage active, ne rien afficher
  if (!isActive) {
    return null;
  }
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '90%',
          height: '80%',
          overflow: 'hidden',
          borderRadius: 10,
          boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      >
        <SafeImage
          src={staticFile(imageSrc)}
          alt={`Screen capture: ${imageSrc}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          fallbackText={`Error loading ${imageSrc}`}
        />
      </div>
    </AbsoluteFill>
  );
};

// Capture vidéo avec zoom
const VideoCapture: React.FC<{
  from: number;
  duration: number;
  videoSrc: string;
  startFrom?: number;
}> = ({ from, duration, videoSrc, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - from;
  const isActive = localFrame >= 0 && localFrame <= duration;

  const progress = isActive
    ? spring({
        fps,
        frame: localFrame,
        config: { damping: 100, mass: 1 },
      })
    : 0;

  const scale = interpolate(progress, [0, 1], [0.95, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1]);

  if (!isActive) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '90%',
          height: '80%',
          overflow: 'hidden',
          borderRadius: 10,
          boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      >
        <Video
          src={staticFile(videoSrc)}
          startFrom={startFrom}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Composant pour le défilement d'images (livre blanc)
const MethodScroll: React.FC<{
  from: number;
  duration: number;
  imageFiles: string[];
}> = ({ from, duration, imageFiles }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!imageFiles || imageFiles.length === 0) {
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey' }}>
        <p style={{color: 'white', fontSize: 30, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>MethodScroll: <br />No images provided.</p>
      </AbsoluteFill>
    );
  }

  const localFrame = frame - from;
  if (localFrame < 0 || localFrame > duration) {
    return null;
  }

  const totalImages = imageFiles.length;
  const totalScrollDistance = height * Math.max(0, totalImages - 1);
  
  // Ensure duration is not zero to prevent division by zero
  const scrollProgressRatio = duration > 0 ? localFrame / duration : 0;
  const scrollProgressAmount = scrollProgressRatio * totalScrollDistance;

  const shiftY = -scrollProgressAmount;

  return (
    <AbsoluteFill style={{ backgroundColor: 'white', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: shiftY,
          left: 0,
          width: width,
          height: height * totalImages,
        }}
      >
        {imageFiles.map((filename, i) => (
          <SafeImage
            key={filename + i} // Use a more unique key
            src={staticFile(filename)}
            fallbackText={`Image ${filename} non disponible`}
            style={{
              position: 'absolute',
              top: i * height,
              left: 0,
              width: width,
              height: height,
              objectFit: 'contain', // 'contain' might be better for document pages
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── MAIN COMP ───────────────────────── */

export const CreeFicheAd: React.FC = () => {

  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Suppression du fond noir de base pour mieux voir la vidéo */}
      {/* <AbsoluteFill style={{ backgroundColor: '#000', zIndex: 1 }} /> */}
      
      {/* Intégration de la vidéo existante en arrière-plan avec beaucoup plus de visibilité */}
      <Video
        src={staticFile('cree_une_fiche.mp4')}
        startFrom={0}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.9, // Fortement augmenté pour une visibilité maximale
          zIndex: 2,
        }}
      />

      {/* SCÈNE 1 — [0:00–0:04] */}
      {frame >= fps * 0 && frame < fps * 4 && (
        <SlideText from={fps * 0} duration={fps * 4} bg="rgba(0,0,0,0.3)" backdropBlur="5px">
          Vous avez une idée innovante ? <br />
          Voici comment la rendre concrète.
        </SlideText>
      )}

      {/* SCÈNE 2 — [0:04–0:10] */}
      {frame >= fps * 4 && frame < fps * 10 && (
        <>
          <AbsoluteFill style={{ zIndex: 5 }}>
            <VideoCapture
              from={fps * 4}
              duration={fps * 6}
              videoSrc="cree_une_fiche.mp4"
              startFrom={0}
            />
          </AbsoluteFill>

          <AbsoluteFill style={{ zIndex: 10 }}>
            <SlideText from={fps * 4} duration={fps * 6} bg="rgba(0,0,0,0.3)" backdropBlur="5px">
              Sur StartBridge, vous commencez par une fiche projet guidée.
            </SlideText>
          </AbsoluteFill>
        </>
      )}

      {/* SCÈNE 3 — [0:10–0:18] */}
      {frame >= fps * 10 && frame < fps * 18 && (
        <>
          <AbsoluteFill style={{ zIndex: 5 }}>
            <ScreenCapture
              from={fps * 10}
              duration={fps * 8}
              imageSrc="startbridge-methodo-1.png"
            />
          </AbsoluteFill>
          
          <AbsoluteFill style={{ zIndex: 10 }}>
            <SlideText from={fps * 10} duration={fps * 8} bg="rgba(0,0,0,0.3)" backdropBlur="5px">
              Étape par étape, vous structurez <br />
              votre projet. Sans jargon.
            </SlideText>
          </AbsoluteFill>
        </>
      )}

      {/* SCÈNE 4 — [0:18–0:26] */}
      {frame >= fps * 18 && frame < fps * 26 && (
        <>
          <AbsoluteFill style={{ zIndex: 5 }}>
            <MethodScroll
              from={fps * 18}
              duration={fps * 8}
              imageFiles={[
                'startbridge-methodo-1.png',
                'startbridge-methodo-2.png',
                'startbridge-methodo-3.png',
                'startbridge-methodo-4.png',
                'startbridge-methodo-5.png',
              ]}
            />
          </AbsoluteFill>
          
          <AbsoluteFill style={{ zIndex: 10 }}>
            <SlideText from={fps * 18} duration={fps * 5} bg="rgba(0,0,0,0.3)" backdropBlur="5px">
              Et pour vous aider : un livre blanc <br />
              illustré, clair et visuel.
            </SlideText>
          </AbsoluteFill>
        </>
      )}

      {/* SCÈNE 5 — [0:26–0:31] */}
      {frame >= fps * 26 && frame < fps * 31 && (
        <>
          <AbsoluteFill style={{ zIndex: 5 }}>
            <BeforeAfterTransition
              from={fps * 26}
              duration={fps * 5}
              beforeImage="startbridge-methodo-3.png"
              afterImage="startbridge-methodo-4.png"
            />
          </AbsoluteFill>
          
          <AbsoluteFill style={{ zIndex: 10 }}>
            <SlideText from={fps * 26} duration={fps * 5} bg="rgba(0,0,0,0.3)" backdropBlur="5px">
              Résultat : un projet clair, crédible… <br />
              prêt à rencontrer des partenaires.
            </SlideText>
          </AbsoluteFill>
        </>
      )}

      {/* SCÈNE 6 — [0:31–0:36] */}
      {frame >= fps * 31 && frame < fps * 36 && (
        <>
          <AbsoluteFill style={{ zIndex: 5 }}>
            <AnimatedLogo from={fps * 31} duration={fps * 5} />
          </AbsoluteFill>
          
          <AbsoluteFill style={{ zIndex: 10 }}>
            <SlideText from={fps * 31} duration={fps * 5} bg="rgba(0,0,0,0.2)" backdropBlur="3px">
              StartBridge. <br />
              Structurez. Connectez. Avancez.
            </SlideText>
          </AbsoluteFill>
        </>
      )}

      {/* SCÈNE 7 — [0:36–0:43] */}
      {frame >= fps * 36 && frame < fps * 43 && (
        <AbsoluteFill style={{ zIndex: 5 }}>
          <AnimatedCTAButton from={fps * 36} duration={fps * 7} />
        </AbsoluteFill>
      )}

      {/* Musique de fond */}
      <Audio
        src={staticFile('bg-music.mp3')}
        startFrom={0}
        endAt={fps * 40}
        volume={(f) =>
          interpolate(
            f,
            [0, fps * 30, fps * 38],
            [0.5, 0.5, 0.2],
            { extrapolateRight: 'clamp' }
          )
        }
      />
    </AbsoluteFill>
  );
};

// src/StartBridgeAd.tsx
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import React from 'react';

/* ───────────────────────── HELPERS ───────────────────────── */

const SlideText: React.FC<{
	children: React.ReactNode;
	from: number;
	duration: number;
	exit?: boolean;
	bg?: string;
		textBg?: string; // Nouvelle prop pour le fond du texte
	backdropBlur?: string; // Nouvelle prop pour le flou de l'arrière-plan
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

/* ───────────────────────── MAIN COMP ───────────────────────── */

export const StartBridgeAd: React.FC = () => {
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill>
			{/* Fond dégradé fixe (bleu→orange) */}
			<GradientBackground />

			{/* 0 – 4 s : “Une idée géniale. Mais zéro plan.” */}
			<SlideText from={0} duration={fps * 4} bg="rgba(0,0,0,0.5)" backdropBlur="10px">
				Une idée géniale. Mais zéro plan.
			</SlideText>

			{/* 4 – 8 s : “Ni ingénieur·e. Ni designer. Juste un cerveau en feu.” */}
			<SlideText from={fps * 4} duration={fps * 4} bg="rgba(0,0,0,0.6)" backdropBlur="10px">
				Ni ingénieur·e. Ni designer. Juste un cerveau en feu.
			</SlideText>

			{/* 8 – 12 s : “OK… mais par où je commence ?” */}
			<SlideText from={fps * 8} duration={fps * 4} bg="rgba(0,0,0,0.7)" backdropBlur="10px">
				OK… mais par où je commence ?
			</SlideText>

			{/* 12 – 12,5 s : glitch rapide */}
			<GlitchCut from={fps * 12} duration={fps * 0.5} />

			{/* 12,5 – 18 s : UIShot zoom+rotation */}
			<UIShot from={fps * 12.5} duration={fps * 5.5} />

			{/* 18 – 22 s : “Start Bridge transforme tes idées en projets réels.” */}
			<SlideText from={fps * 18} duration={fps * 4} bg="rgba(0,0,0,0.55)" backdropBlur="10px">
				Start Bridge transforme tes idées en projets réels.
			</SlideText>

			{/* 22 – 26 s : “Ingénieur·e fraîchement diplômé·e ?…” */}
			<SlideText from={fps * 22} duration={fps * 4} bg="rgba(0,0,0,0.6)" backdropBlur="10px">
				Ingénieur·e fraîchement diplômé·e ?  
				Bricoleur·se du dimanche ?  
				Rêveur·se ambitieux·se ?  
				Tu vas kiffer.
			</SlideText>

			{/*** 26 – 42 s : SCROLL DES 5 IMAGES (uniquement durant cette plage) ***/}
			<MethodScroll from={fps * 26} duration={fps * 16} />

			{/* 34 – 38 s : texte juste après le scroll */}
			<SlideText from={fps * 34} duration={fps * 4} bg="rgba(0,0,0,0.8)" backdropBlur="10px" textBg="black">
				Tu viens de voir le guide :  
				se préparer, créer, structurer.  
				Maintenant, passe à l’action.
			</SlideText>

			{/* 38 – 42 s : “Aujourd’hui : j’ai une roadmap, des maquettes, et une équipe.” */}
			<SlideText from={fps * 38} duration={fps * 4} bg="rgba(0,0,0,0.8)" backdropBlur="10px" textBg="black">
				Aujourd’hui : j’ai une roadmap,  
				des maquettes, et une équipe.
			</SlideText>

			{/* 42 – 46 s : “Finie la galère solo.” */}
			<SlideText from={fps * 42} duration={fps * 4} bg="rgba(0,0,0,0.8)" backdropBlur="10px" textBg="black">
				Finie la galère solo.
			</SlideText>

			{/* 46 – 52 s : CTA Final */}
			<SlideText from={fps * 46} duration={fps * 6} bg="rgba(0,0,0,0.8)" backdropBlur="10px" textBg="black">
				Start Bridge — Passe à l’action, maintenant. 🚀
			</SlideText>

			{/* Musique : s’arrête vers 48 s (frame 1440) */}
			<Audio
				src={staticFile('bg-music.mp3')}
				startFrom={0}
				endAt={fps * 48}
				volume={(f) =>
					interpolate(
						f,
						[0, fps * 40, fps * 46],
						[0.6, 0.6, 0.9],
						{ extrapolateRight: 'clamp' }
					)
				}
			/>
		</AbsoluteFill>
	);
};

/* ─────────────────── SCROLL DES IMAGES ─────────────────── */

/**
 * MethodScroll
 *  - N’apparaît que si frame ∈ [from, from+duration].
 *  - Défile 5 images plein écran verticalement, stackées sans espace.
 */
// Composant d'image avec fallback en cas d'erreur
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

const MethodScroll: React.FC<{ from: number; duration: number }> = ({
	from,
	duration,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Si on n'est pas encore arrivé au scroll, ou si on l'a déjà dépassé → rien à afficher
	if (frame < from || frame > from + duration) {
		return null;
	}

	const totalImages = 5;
	const localFrame = frame - from; // compte à rebours interne (0 → duration)
	const totalScrollDistance = height * (totalImages - 1); // distance totale pour défiler toutes les images
	// Progrès du scroll : de 0 à totalScrollDistance en fonction des localFrame
	const scrollProgress = (localFrame / duration) * totalScrollDistance;

	const shiftY = -scrollProgress;

	// Images préchargées pour éviter les problèmes de rendu
	const images = [
		'startbridge-methodo-1.png',
		'startbridge-methodo-2.png',
		'startbridge-methodo-3.png',
		'startbridge-methodo-4.png',
		'startbridge-methodo-5.png',
	];

	return (
		<AbsoluteFill style={{ backgroundColor: 'white' }}>
			<div
				style={{
					position: 'absolute',
					top: shiftY,
					left: 0,
					width: width,
					height: height * totalImages, // conteneur de 5× la hauteur
				}}
			>
				{images.map((filename, i) => (
					<SafeImage
						key={i}
						src={staticFile(filename)}
						fallbackText={`Image ${i + 1} non disponible`}
						style={{
							position: 'absolute',
							top: i * height,
							left: 0,
							width: width,
							height: height,
							objectFit: 'contain',
						}}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};

/* ─────────────────── AUTRES COMPOSANTS ─────────────────── */

/**
 * UIShot
 *  - Affiche la capture d’écran de l’app (startbridge-ui.png)
 *    avec un léger zoom et rotation en entrée.
 */
const UIShot: React.FC<{ from: number; duration: number }> = ({
	from,
	duration,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const progress = spring({
		fps,
		frame: frame - from,
		config: { damping: 50, mass: 1 },
	});
	const scale = interpolate(progress, [0, 1], [1.2, 1]);
	const rotate = interpolate(progress, [0, 1], [4, 0]);
	const opacity = interpolate(progress, [0, 0.1], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `scale(${scale}) rotate(${rotate}deg)`,
				opacity: opacity,
			}}
		>
			<Img
				src={staticFile('startbridge-ui.png')}
				style={{ width: '100%', height: '100%', objectFit: 'cover' }}
			/>
		</AbsoluteFill>
	);
};

/**
 * GlitchCut
 *  - Flash noir + micro-déplacement aléatoire pendant la durée donnée.
 */
const GlitchCut: React.FC<{ from: number; duration: number }> = ({
	from,
	duration,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const inWindow = frame >= from && frame <= from + duration;
	if (!inWindow) {
		return null;
	}

	const offset = Math.random() * 20 - 10;
	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'black',
				transform: `translate(${offset}px, ${-offset}px)`,
			}}
		/>
	);
};

/**
 * GradientBackground
 *  - Dégradé fixe entre #0089e6 (bleu) et #e55e00 (orange).
 */
const GradientBackground: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0089e6 0%, #e55e00 100%)',
			}}
		/>
	);
};

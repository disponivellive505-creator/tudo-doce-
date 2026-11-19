import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  Heart,
  Menu,
  Minus,
  Play,
  Plus,
  Send,
  Snowflake,
  Sparkles,
  Star,
  Truck,
  User,
  Users,
  X,
} from 'lucide-react';

interface SlideItem {
  id: number;
  photo: string;
  video?: string;
  photoPos: string;
  titleLines: string[][];
  isExploreLayout: boolean;
  captionTitle: string;
  captionDesc: string;
}

interface ThumbItem {
  id: number;
  slideIndex: number;
  label: string;
  photo: string;
  photoPos?: string;
}

interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  unitLabel: string;
  price: number;
  priceFormatted: string;
  rating: string;
  reviewsCount: number;
  photo: string;
  objectPos: string;
  video?: string;
  gallery: string[];
  description: string;
}

interface FlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Uploaded Christmas assets from /public/assets/aistudio/
const ASSETS = {
  logo: '/assets/aistudio/Logo_luxuoso_Tudo__Doce_f0449b04.png',
  quemSouEu: '/assets/aistudio/quem_sou_eu_fdd23a5f.jpg',
  commercialVideo:
    '/assets/aistudio/Christmas_food_commercial_direction_934c4fa1_1080p_564ab9f3.mp4',
  chefHero: '/assets/aistudio/image_c1a8b5e7.png',
  chefVideo: '/assets/aistudio/Pastry_chef_presenting_Christmas__1f0e3849_1080p_81c001bf.mp4',
  cakeVideo: '/assets/aistudio/Chocolate_cake_animation_assembly_c9e87d42_1080p_39da515f.mp4',
  chocoCake: '/assets/aistudio/image_2cd68658.png',
  roseCake: '/assets/aistudio/image_05ce8b78.png',
  panettone: '/assets/aistudio/image_d27384e0.png',
  pudim: '/assets/aistudio/image_697e2d32.png',
  taca: '/assets/aistudio/image_ceeb4184.png',
};

const SLIDES: SlideItem[] = [
  {
    id: 0,
    photo: ASSETS.chefHero,
    video: ASSETS.chefVideo,
    photoPos: 'center 32%',
    titleLines: [['NATAL', 'TUDO+', 'DOCE']],
    isExploreLayout: false,
    captionTitle: 'Doces de Natal',
    captionDesc:
      'Descubra nossos bolos artesanais, panetones trufados e sobremesas para iluminar sua ceia',
  },
  {
    id: 1,
    photo: ASSETS.chocoCake,
    video: ASSETS.cakeVideo,
    photoPos: 'center 52%',
    titleLines: [['ESCOLHA', 'SUA', 'CEIA']],
    isExploreLayout: false,
    captionTitle: 'Bolos Festivos',
    captionDesc:
      'Camadas de chocolate belga, ganache cremosa, cerejas frescas e laços de cetim feitos à mão',
  },
  {
    id: 2,
    photo: ASSETS.panettone,
    video: ASSETS.commercialVideo,
    photoPos: 'center 48%',
    titleLines: [['SABORES'], ['DE NATAL']],
    isExploreLayout: true,
    captionTitle: 'Panetones & Kits',
    captionDesc:
      'Panetones trufados de avelã, taças da felicidade e presentes natalinos prontos para encantar',
  },
];

// Top -> Middle -> Bottom column order (exact rail choreography)
const THUMBNAILS: ThumbItem[] = [
  {
    id: 0,
    slideIndex: 2,
    label: 'Panetones & Kits — Panetone Trufado de Avelã',
    photo: ASSETS.panettone,
    photoPos: '48% 45%',
  },
  {
    id: 1,
    slideIndex: 1,
    label: 'Bolos Festivos — Bolo Floresta de Natal',
    photo: ASSETS.chocoCake,
    photoPos: 'center center',
  },
  {
    id: 2,
    slideIndex: 0,
    label: 'Doces de Natal — Confeitaria Tudo+ Doce',
    photo: ASSETS.chefHero,
    photoPos: '50% 25%',
  },
];

const PRODUCTS: ProductItem[] = [
  {
    id: 'bolo-floresta-natal',
    name: 'Bolo Floresta de Natal',
    subtitle: 'Bolos Festivos · 20 fatias',
    category: 'Bolos Festivos',
    unitLabel: '/bolo',
    price: 240,
    priceFormatted: 'R$ 240',
    rating: '4,9',
    reviewsCount: 148,
    photo: ASSETS.chocoCake,
    objectPos: '48% 50%',
    video: ASSETS.cakeVideo,
    gallery: [ASSETS.roseCake, ASSETS.taca, ASSETS.chefHero],
    description:
      'Massa fofinha de cacau 50% intercalada com camadas generosas de mousse e ganache de chocolate belga meio amargo, envolvido em acetato com laço verde natalino de cetim, finalizado com raspas nobres e cerejas frescas selecionadas no dia da entrega.',
  },
  {
    id: 'bolo-rosas-morango',
    name: 'Bolo Rosas de Morango',
    subtitle: 'Bolos Festivos · 18 fatias',
    category: 'Bolos Festivos',
    unitLabel: '/bolo',
    price: 225,
    priceFormatted: 'R$ 225',
    rating: '4,9',
    reviewsCount: 132,
    photo: ASSETS.roseCake,
    objectPos: '50% 48%',
    video: ASSETS.commercialVideo,
    gallery: [ASSETS.chocoCake, ASSETS.taca, ASSETS.chefHero],
    description:
      'Camadas delicadas de massa de chocolate intenso com creme branco aveludado de baunilha e geleia artesanal de frutas vermelhas, arrematado com laço magenta em cetim e topo esculpido em flores de chocolate rubi.',
  },
  {
    id: 'panetone-trufado-avela',
    name: 'Panetone Trufado Avelã',
    subtitle: 'Panetones · 1,2 kg',
    category: 'Panetones',
    unitLabel: '/unidade',
    price: 165,
    priceFormatted: 'R$ 165',
    rating: '4,9',
    reviewsCount: 184,
    photo: ASSETS.panettone,
    objectPos: '49% 46%',
    video: ASSETS.commercialVideo,
    gallery: [ASSETS.chocoCake, ASSETS.pudim, ASSETS.chefHero],
    description:
      'Fermentação natural lenta de 36 horas com gotas nobres e frutas cristalizadas macias, recheado generosamente com trufa cremosa de gianduia, cobertura escorrida de chocolate belga, avelãs tostadas e medalhão dourado Tudo+ Doce.',
  },
  {
    id: 'taca-da-felicidade',
    name: 'Taça da Felicidade',
    subtitle: 'Taças · 10 porções',
    category: 'Taças',
    unitLabel: '/taça',
    price: 145,
    priceFormatted: 'R$ 145',
    rating: '4,8',
    reviewsCount: 119,
    photo: ASSETS.taca,
    objectPos: '51% 46%',
    video: ASSETS.commercialVideo,
    gallery: [ASSETS.roseCake, ASSETS.pudim, ASSETS.chocoCake],
    description:
      'Servida em taça de cristal pronta para ir direto ao centro da mesa natalina: camadas fartas de creme de ninho cozido lentamente, cubos de brownie úmido, ganache brilhante, raspas de chocolate e morangos frescos.',
  },
  {
    id: 'pudim-real-baunilha',
    name: 'Pudim Real de Baunilha',
    subtitle: 'Sobremesas · 12 fatias',
    category: 'Sobremesas',
    unitLabel: '/unidade',
    price: 110,
    priceFormatted: 'R$ 110',
    rating: '4,9',
    reviewsCount: 164,
    photo: ASSETS.pudim,
    objectPos: '48% 52%',
    video: ASSETS.commercialVideo,
    gallery: [ASSETS.taca, ASSETS.panettone, ASSETS.chefHero],
    description:
      'Receita clássica de família com textura ultracremosa e lisinha, infusionada com favas naturais de baunilha de Madagascar e banhada em calda âmbar brilhante de caramelo artesanal.',
  },
  {
    id: 'dupla-mini-panetones',
    name: 'Dupla Mini Panetones',
    subtitle: 'Panetones · Kit Presente',
    category: 'Panetones',
    unitLabel: '/kit',
    price: 89,
    priceFormatted: 'R$ 89',
    rating: '4,8',
    reviewsCount: 96,
    photo: ASSETS.panettone,
    objectPos: '80% 66%',
    video: ASSETS.commercialVideo,
    gallery: [ASSETS.panettone, ASSETS.pudim, ASSETS.roseCake],
    description:
      'Kit encantador com dois mini panetones trufados de chocolate e avelãs tostadas, finalizados com forminhas natalinas vermelhas e laços de cetim prontos para presentear pessoas especiais.',
  },
  {
    id: 'mesa-completa-natal',
    name: 'Mesa Completa de Natal',
    subtitle: 'Combo Ceia · 35 pessoas',
    category: 'Combos Ceia',
    unitLabel: '/combo',
    price: 690,
    priceFormatted: 'R$ 690',
    rating: '5,0',
    reviewsCount: 74,
    photo: ASSETS.chefHero,
    objectPos: '50% 42%',
    video: ASSETS.chefVideo,
    gallery: [ASSETS.chocoCake, ASSETS.roseCake, ASSETS.panettone],
    description:
      'A coleção completa de Natal assinada pela chef da Tudo+ Doce: inclui 1 Bolo Floresta de Natal, 1 Bolo Rosas de Morango, 1 Panetone Trufado de Avelã, 1 Taça da Felicidade e 1 Pudim Real de Baunilha com entrega refrigerada agendada.',
  },
  {
    id: 'fatia-gourmet-floresta',
    name: 'Fatia Gourmet Floresta',
    subtitle: 'Bolos Festivos · Degustação',
    category: 'Bolos Festivos',
    unitLabel: '/fatia',
    price: 34,
    priceFormatted: 'R$ 34',
    rating: '4,9',
    reviewsCount: 210,
    photo: ASSETS.chocoCake,
    objectPos: '85% 74%',
    video: ASSETS.cakeVideo,
    gallery: [ASSETS.chocoCake, ASSETS.roseCake, ASSETS.taca],
    description:
      'Fatia alta e estruturada do nosso Bolo Floresta de Natal, perfeita para degustação prévia da ceia ou para presentear em caixinha natalina com laço dourado e cereja fresca no topo.',
  },
];

const CATEGORIES = [
  'Todos os Doces',
  'Bolos Festivos',
  'Panetones',
  'Taças',
  'Sobremesas',
  'Combos Ceia',
];

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MONTH_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const WEEKDAYS_MON = ['Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa', 'Do'];

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function formatShortDate(d: Date) {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

function formatFullDate(d: Date) {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}, ${d.getFullYear()}`;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

interface ProductCardProps {
  product: ProductItem;
  index: number;
  liked: boolean;
  isPopping: boolean;
  isVisible: boolean;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onSelect: (product: ProductItem, rect: FlightRect) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  liked,
  isPopping,
  isVisible,
  onToggleLike,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    onSelect(product, { left: r.left, top: r.top, width: r.width, height: r.height });
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      data-clickable="true"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`kt-stay-card group text-left outline-none focus-visible:ring-2 focus-visible:ring-[#24171a] ${
        isVisible ? 'is-inview' : ''
      }`}
      style={{
        transitionDelay: isVisible ? `${(index % 4) * 90}ms` : '0ms',
      }}
    >
      <img
        src={product.photo}
        alt={product.name}
        className="kt-stay-card-img block select-none"
        style={{ objectPosition: product.objectPos }}
        draggable={false}
      />

      {/* Bottom darkening gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(36,16,20,0.04) 0%, rgba(36,16,20,0) 40%, rgba(36,16,20,0.3) 68%, rgba(28,12,16,0.86) 100%)',
        }}
      />

      {/* Top-left price pill */}
      <div
        className="pointer-events-none absolute left-3 top-3 rounded-[6px] px-[9px] py-[5px] text-[11.5px] leading-none text-[#24171a]"
        style={{
          background: 'rgba(255,255,255,0.86)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <span className="font-semibold tabular-nums">{product.priceFormatted}</span>
        <span className="font-normal opacity-60">{product.unitLabel}</span>
      </div>

      {/* Top-right 30px white heart button */}
      <button
        type="button"
        aria-label={liked ? `Remover ${product.name} dos favoritos` : `Salvar ${product.name}`}
        data-clickable="true"
        onClick={(e) => onToggleLike(product.id, e)}
        className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/92 shadow-sm transition-transform duration-200 hover:scale-110"
      >
        <Heart
          size={15}
          strokeWidth={1.9}
          className={isPopping ? 'kt-heart-pop' : ''}
          color={liked ? '#e63956' : '#24171a'}
          fill={liked ? '#e63956' : 'none'}
        />
      </button>

      {/* Bottom-left metadata */}
      <div className="pointer-events-none absolute inset-x-3.5 bottom-3.5 text-white">
        <h3 className="truncate text-[15.5px] font-semibold leading-snug tracking-[-0.01em] text-white">
          {product.name}
        </h3>
        <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-white/85">
          <Sparkles size={11} strokeWidth={1.8} className="shrink-0 opacity-90" />
          <span className="truncate">{product.subtitle}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center gap-[2px]">
            {[0, 1, 2, 3, 4].map((s) => (
              <Star
                key={s}
                size={11}
                strokeWidth={1.5}
                color="#e8a925"
                fill="#e8a925"
              />
            ))}
          </div>
          <span className="text-[11.5px] font-medium tabular-nums text-white/95">
            {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Viewport metrics for exact right-rail geometry
  const [viewport, setViewport] = useState(() => ({
    vw: typeof window !== 'undefined' ? window.innerWidth : 1440,
    vh: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));

  // Nav state
  const [navScrolled, setNavScrolled] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [editionMenuOpen, setEditionMenuOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'Retirada · Ateliê' | 'Delivery · Natal'>(
    'Delivery · Natal'
  );
  const [customOrderModalOpen, setCustomOrderModalOpen] = useState(false);

  // Hero & intro states
  const [activeSlide, setActiveSlide] = useState(0);
  const [captionSlide, setCaptionSlide] = useState(0);
  const [captionShown, setCaptionShown] = useState(false);
  const [introTitles, setIntroTitles] = useState(false);
  const [introThumbs, setIntroThumbs] = useState(false);
  const [introThumbsDone, setIntroThumbsDone] = useState(false);
  const [introRings, setIntroRings] = useState(false);
  const [introSearch, setIntroSearch] = useState(false);

  // Search / order bar state
  const [selectedCategory, setSelectedCategory] = useState('Todos os Doces');
  const [activeField, setActiveField] = useState<'cat' | 'pickup' | 'eve' | 'guests'>('pickup');
  const [openPopover, setOpenPopover] = useState<null | 'cat' | 'calendar' | 'guests'>(null);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(11); // Dezembro 2026
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [eveDate, setEveDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(8);
  const [children, setChildren] = useState(2);
  const [guestsTouched, setGuestsTouched] = useState(false);

  // Products & Quem Sou Eu states
  const [productsVisible, setProductsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [portraitTilt, setPortraitTilt] = useState({ rx: 0, ry: 0 });
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [poppingId, setPoppingId] = useState<string | null>(null);

  // Detail page + shared-element flight state
  const [detailProduct, setDetailProduct] = useState<ProductItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blocksShown, setBlocksShown] = useState(false);
  const [flightActive, setFlightActive] = useState(false);
  const [flightPhoto, setFlightPhoto] = useState<string | null>(null);
  const [flightObjPos, setFlightObjPos] = useState<string>('center center');
  const [activePreviewImg, setActivePreviewImg] = useState<string | null>(null);
  const [playingDetailVideo, setPlayingDetailVideo] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [ordered, setOrdered] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  // DOM refs for 60/120fps direct animation
  const cursorRef = useRef<HTMLDivElement>(null);
  const slideStackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const mistRef = useRef<HTMLDivElement>(null);
  const bottomCloudsRef = useRef<HTMLDivElement>(null);
  const topCloudRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const navRightRef = useRef<HTMLDivElement>(null);
  const navLeftRef = useRef<HTMLDivElement>(null);

  // Detail refs
  const detailOverlayRef = useRef<HTMLDivElement>(null);
  const detailHeroRef = useRef<HTMLDivElement>(null);
  const flightElRef = useRef<HTMLDivElement>(null);

  // Mutable animation refs
  const activeSlideRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const wipeRafRef = useRef<number | null>(null);
  const captionTimerRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const kenBurnsStartRef = useRef(performance.now());
  const currentLiveScaleRef = useRef(1.04);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const detailProductRef = useRef<ProductItem | null>(null);
  const flightRafRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    detailProductRef.current = detailProduct;
  }, [detailProduct]);

  const isRecMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('rec');
  }, []);

  // Viewport resize observer
  useEffect(() => {
    const onResize = () => {
      setViewport({ vw: window.innerWidth, vh: window.innerHeight });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Custom grey dot cursor
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        el.classList.remove('is-visible');
        return;
      }
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.classList.add('is-visible');

      const target = e.target as HTMLElement | null;
      const clickable = target?.closest(
        'a, button, [role="button"], [data-clickable="true"], input, select'
      );
      if (clickable) {
        el.classList.add('is-hover');
      } else {
        el.classList.remove('is-hover');
      }

      const nx = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const ny = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      pointerTargetRef.current = { x: -nx * 0.6, y: -ny * 0.5 };
    };

    const handleDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      el.classList.add('is-down');
    };

    const handleUp = () => {
      el.classList.remove('is-down');
    };

    const handleLeave = () => {
      el.classList.remove('is-visible');
      el.classList.remove('is-down');
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    window.addEventListener('blur', handleUp);
    document.documentElement.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('blur', handleUp);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  // Intro choreography on load (exact timing preserved)
  useEffect(() => {
    SLIDES.forEach((_, idx) => {
      const sEl = slideRefs.current[idx];
      const pEl = photoRefs.current[idx];
      if (sEl) {
        sEl.style.visibility = idx === 0 ? 'visible' : 'hidden';
        sEl.style.zIndex = idx === 0 ? '3' : '1';
        sEl.style.maskImage = 'none';
        sEl.style.webkitMaskImage = 'none';
      }
      if (pEl) {
        pEl.style.transform = 'translate3d(0%, 0%, 0) scale(1.04)';
      }
    });

    const t1 = window.setTimeout(() => setIntroTitles(true), 250);
    const t2 = window.setTimeout(() => setIntroThumbs(true), 350);
    const t2Done = window.setTimeout(() => setIntroThumbsDone(true), 1350);
    const t3 = window.setTimeout(() => setIntroRings(true), 420);
    const t4 = window.setTimeout(() => setIntroSearch(true), 360);
    const t5 = window.setTimeout(() => setCaptionShown(true), 900);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t2Done);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, []);

  // Continuous Ken Burns + pointer parallax rAF loop
  useEffect(() => {
    let rafId = 0;
    const tick = (now: number) => {
      const cur = pointerCurrentRef.current;
      const tgt = pointerTargetRef.current;
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;

      if (!isTransitioningRef.current && !detailProductRef.current) {
        const elapsed = Math.min(12, Math.max(0, (now - kenBurnsStartRef.current) / 1000));
        const scale = 1.04 + elapsed * 0.0035;
        currentLiveScaleRef.current = scale;
        const activePhoto = photoRefs.current[activeSlideRef.current];
        if (activePhoto) {
          activePhoto.style.transform = `translate3d(${cur.x.toFixed(3)}%, ${cur.y.toFixed(3)}%, 0) scale(${scale.toFixed(5)})`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Signature soft misty right-to-left wipe transition (1.25s easeInOutCubic)
  const goToSlide = useCallback((nextIdx: number) => {
    const prevIdx = activeSlideRef.current;
    if (nextIdx === prevIdx) return;

    if (wipeRafRef.current !== null) {
      cancelAnimationFrame(wipeRafRef.current);
      wipeRafRef.current = null;
    }

    isTransitioningRef.current = true;
    activeSlideRef.current = nextIdx;
    setActiveSlide(nextIdx);
    setCaptionShown(false);

    if (captionTimerRef.current !== null) {
      window.clearTimeout(captionTimerRef.current);
    }
    captionTimerRef.current = window.setTimeout(() => {
      setCaptionSlide(nextIdx);
      setCaptionShown(true);
    }, 650);

    SLIDES.forEach((_, idx) => {
      const sEl = slideRefs.current[idx];
      if (!sEl) return;
      if (idx === prevIdx) {
        sEl.style.visibility = 'visible';
        sEl.style.zIndex = '2';
        sEl.style.maskImage = 'none';
        sEl.style.webkitMaskImage = 'none';
      } else if (idx === nextIdx) {
        sEl.style.visibility = 'visible';
        sEl.style.zIndex = '3';
        const initMask =
          'linear-gradient(to left, rgba(0,0,0,1) -35%, rgba(0,0,0,0.6) -17.5%, rgba(0,0,0,0) 0%)';
        sEl.style.maskImage = initMask;
        sEl.style.webkitMaskImage = initMask;
      } else {
        sEl.style.visibility = 'hidden';
        sEl.style.zIndex = '1';
        sEl.style.maskImage = 'none';
        sEl.style.webkitMaskImage = 'none';
      }
    });

    const inSlideEl = slideRefs.current[nextIdx];
    const outSlideEl = slideRefs.current[prevIdx];
    const inPhotoEl = photoRefs.current[nextIdx];
    const outPhotoEl = photoRefs.current[prevIdx];
    const mistEl = mistRef.current;

    const outStartScale = currentLiveScaleRef.current;
    const duration = 1250;
    const startTime = performance.now();

    const step = (now: number) => {
      const rawT = Math.min(1, (now - startTime) / duration);
      const p = easeInOutCubic(rawT);

      const solidStop = p * 135 - 35;
      const midStop = p * 135 - 17.5;
      const clearStop = p * 135;

      if (inSlideEl) {
        const maskStr = `linear-gradient(to left, rgba(0,0,0,1) ${solidStop.toFixed(2)}%, rgba(0,0,0,0.6) ${midStop.toFixed(2)}%, rgba(0,0,0,0) ${clearStop.toFixed(2)}%)`;
        inSlideEl.style.maskImage = maskStr;
        inSlideEl.style.webkitMaskImage = maskStr;
      }

      const px = pointerCurrentRef.current.x;
      const py = pointerCurrentRef.current.y;

      if (inPhotoEl) {
        const inScale = lerp(1.12, 1.04, p);
        const inTx = lerp(2, 0, p) + px;
        inPhotoEl.style.transform = `translate3d(${inTx.toFixed(3)}%, ${py.toFixed(3)}%, 0) scale(${inScale.toFixed(5)})`;
      }

      if (outPhotoEl) {
        const outScale = lerp(outStartScale, 1.09, p);
        const outTx = lerp(0, -2, p) + px;
        outPhotoEl.style.transform = `translate3d(${outTx.toFixed(3)}%, ${py.toFixed(3)}%, 0) scale(${outScale.toFixed(5)})`;
      }

      if (mistEl) {
        const vwNow = window.innerWidth;
        const edgeX = ((100 - midStop) / 100) * vwNow - vwNow * 0.17;
        const mistOpacity = Math.sin(Math.PI * rawT) * 0.95;
        mistEl.style.transform = `translate3d(${edgeX.toFixed(1)}px, 0, 0)`;
        mistEl.style.opacity = mistOpacity.toFixed(3);
      }

      if (rawT < 1) {
        wipeRafRef.current = requestAnimationFrame(step);
      } else {
        wipeRafRef.current = null;
        if (inSlideEl) {
          inSlideEl.style.maskImage = 'none';
          inSlideEl.style.webkitMaskImage = 'none';
        }
        if (outSlideEl) {
          outSlideEl.style.visibility = 'hidden';
          outSlideEl.style.zIndex = '1';
        }
        if (mistEl) {
          mistEl.style.opacity = '0';
        }
        kenBurnsStartRef.current = performance.now();
        currentLiveScaleRef.current = 1.04;
        isTransitioningRef.current = false;
      }
    };

    wipeRafRef.current = requestAnimationFrame(step);
  }, []);

  // Auto-advance every 5.2s
  const resetAutoAdvance = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearInterval(autoTimerRef.current);
    }
    autoTimerRef.current = window.setInterval(() => {
      if (detailProductRef.current || document.hidden) return;
      const next = (activeSlideRef.current + 1) % SLIDES.length;
      goToSlide(next);
    }, 5200);
  }, [goToSlide]);

  useEffect(() => {
    resetAutoAdvance();
    return () => {
      if (autoTimerRef.current !== null) window.clearInterval(autoTimerRef.current);
      if (wipeRafRef.current !== null) cancelAnimationFrame(wipeRafRef.current);
      if (captionTimerRef.current !== null) window.clearTimeout(captionTimerRef.current);
    };
  }, [resetAutoAdvance]);

  const handleThumbClick = (slideIndex: number) => {
    goToSlide(slideIndex);
    resetAutoAdvance();
  };

  // Scroll choreography & navbar solid switch
  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      ticking = false;
      const sy = window.scrollY;
      const vh = Math.max(window.innerHeight, 680);

      setNavScrolled(sy > window.innerHeight * 0.3);

      if (slideStackRef.current) {
        slideStackRef.current.style.transform = `translate3d(0, ${(sy * 0.42).toFixed(2)}px, 0)`;
      }
      if (bottomCloudsRef.current) {
        const scale = 1 + (0.35 * sy) / vh;
        bottomCloudsRef.current.style.transform = `translate3d(0, ${(-sy * 0.38).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      }
      if (topCloudRef.current) {
        const op = clamp(sy / (0.45 * vh), 0, 1);
        topCloudRef.current.style.opacity = op.toFixed(3);
        topCloudRef.current.style.transform = `translate3d(0, ${(-sy * 0.18).toFixed(2)}px, 0)`;
      }
      if (railRef.current) {
        const railOp = clamp(1 - sy / (0.5 * vh), 0, 1);
        railRef.current.style.transform = `translate3d(0, ${(sy * 0.2).toFixed(2)}px, 0)`;
        railRef.current.style.opacity = railOp.toFixed(3);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for products grid entrance
  useEffect(() => {
    const section = productsSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setProductsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver for "Quem Sou Eu" curtain & seal reveal
  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setAboutVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Outside click closes search popovers and nav dropdowns
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchShellRef.current && !searchShellRef.current.contains(target)) {
        setOpenPopover(null);
      }
      if (navRightRef.current && !navRightRef.current.contains(target)) {
        setNavMenuOpen(false);
      }
      if (navLeftRef.current && !navLeftRef.current.contains(target)) {
        setEditionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close detail page with .55s fade out
  const closeDetail = useCallback(() => {
    if (!detailProductRef.current) return;
    setDetailOpen(false);
    setFlightActive(false);
    if (flightRafRef.current !== null) {
      cancelAnimationFrame(flightRafRef.current);
      flightRafRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setDetailProduct(null);
      setFlightPhoto(null);
      setPlayingDetailVideo(false);
      document.body.style.overflow = '';
      closeTimerRef.current = null;
    }, 560);
  }, []);

  // Escape closes modals or detail page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (filmModalOpen) setFilmModalOpen(false);
        else if (customOrderModalOpen) setCustomOrderModalOpen(false);
        else if (openPopover) setOpenPopover(null);
        else if (detailProductRef.current) closeDetail();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filmModalOpen, customOrderModalOpen, openPopover, closeDetail]);

  // Right rail geometry math (exact wireframe match)
  const railLayout = useMemo(() => {
    const vw = viewport.vw;
    const heroH = Math.max(viewport.vh, 680);
    const cx = vw * 0.855;
    const startY = 74 + heroH * 0.085;
    const activeSize = clamp(vw * 0.113, 96, 190);
    const inactiveSize = clamp(vw * 0.054, 46, 92);
    const gap = Math.max(vw * 0.009, 8);
    const activeThumbIdx = 2 - activeSlide;

    let y = startY;
    const thumbs = THUMBNAILS.map((t, i) => {
      const isActive = i === activeThumbIdx;
      const size = isActive ? activeSize : inactiveSize;
      const top = y;
      const left = cx - size / 2;
      const centerY = y + size / 2;
      y += size + gap;
      return { ...t, isActive, size, top, left, centerY };
    });

    const activeThumb = thumbs[activeThumbIdx];
    const r1 = activeSize / 2 + vw * 0.05;
    const r2 = activeSize / 2 + vw * 0.108;
    const connW = Math.max(vw * 0.047, 40);
    const connLeft = cx - activeSize / 2 - vw * 0.008 - connW;
    const connTop = activeThumb.centerY - 1.5;
    const captionRightEdge = connLeft - Math.max(16, vw * 0.015);
    const captionRightCss = vw - captionRightEdge;
    const barHeight = Math.max(vw * 0.065, 84);

    return {
      cx,
      thumbs,
      activeCenterY: activeThumb.centerY,
      r1,
      r2,
      connW,
      connLeft,
      connTop,
      captionRightCss,
      barHeight,
    };
  }, [viewport, activeSlide]);

  // Toggle favorite heart with pop animation
  const handleToggleLike = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    setPoppingId(id);
    window.setTimeout(() => {
      setPoppingId((curr) => (curr === id ? null : curr));
    }, 380);
  }, []);

  // Open detail page with 900ms shared-element flight
  const openProductDetail = useCallback((product: ProductItem, fromRect: FlightRect) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (flightRafRef.current !== null) {
      cancelAnimationFrame(flightRafRef.current);
      flightRafRef.current = null;
    }

    setOpenPopover(null);
    setNavMenuOpen(false);
    setEditionMenuOpen(false);
    setDetailProduct(product);
    setActivePreviewImg(null);
    setPlayingDetailVideo(false);
    setOrderQty(1);
    setOrdered(false);
    setRatingOpen(false);
    setUserRating(0);
    setBlocksShown(false);
    setFlightPhoto(product.photo);
    setFlightObjPos(product.objectPos);
    setFlightActive(true);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      if (detailOverlayRef.current) {
        detailOverlayRef.current.scrollTop = 0;
      }
      setDetailOpen(true);

      requestAnimationFrame(() => {
        const targetEl = detailHeroRef.current;
        const flyEl = flightElRef.current;
        if (!targetEl || !flyEl) {
          setFlightActive(false);
          setBlocksShown(true);
          return;
        }

        const toRect = targetEl.getBoundingClientRect();

        flyEl.style.left = `${fromRect.left}px`;
        flyEl.style.top = `${fromRect.top}px`;
        flyEl.style.width = `${fromRect.width}px`;
        flyEl.style.height = `${fromRect.height}px`;
        flyEl.style.borderRadius = '12px';

        window.setTimeout(() => {
          setBlocksShown(true);
        }, 250);

        const duration = 900;
        const start = performance.now();

        const animateFlight = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const p = easeInOutCubic(t);

          const curLeft = lerp(fromRect.left, toRect.left, p);
          const curTop = lerp(fromRect.top, toRect.top, p);
          const curW = lerp(fromRect.width, toRect.width, p);
          const curH = lerp(fromRect.height, toRect.height, p);
          const curR = lerp(12, 10, p);

          if (flightElRef.current) {
            flightElRef.current.style.left = `${curLeft}px`;
            flightElRef.current.style.top = `${curTop}px`;
            flightElRef.current.style.width = `${curW}px`;
            flightElRef.current.style.height = `${curH}px`;
            flightElRef.current.style.borderRadius = `${curR}px`;
          }

          if (t < 1) {
            flightRafRef.current = requestAnimationFrame(animateFlight);
          } else {
            flightRafRef.current = null;
            setFlightActive(false);
          }
        };

        flightRafRef.current = requestAnimationFrame(animateFlight);
      });
    });
  }, []);

  const handleGoHome = () => {
    setNavMenuOpen(false);
    setEditionMenuOpen(false);
    if (detailProduct) {
      closeDetail();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToProducts = () => {
    setOpenPopover(null);
    if (detailProduct) {
      closeDetail();
      window.setTimeout(() => {
        productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 580);
    } else {
      productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToAbout = () => {
    setOpenPopover(null);
    setNavMenuOpen(false);
    if (detailProduct) {
      closeDetail();
      window.setTimeout(() => {
        aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 580);
    } else {
      aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePanettoneSpotlight = () => {
    if (detailProduct) {
      closeDetail();
    }
    goToSlide(2);
    resetAutoAdvance();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calendar date selection
  const handlePickDate = (date: Date) => {
    const pickedTime = startOfDay(date);
    if (!pickupDate || (pickupDate && eveDate) || activeField === 'pickup') {
      setPickupDate(date);
      setEveDate(null);
      setActiveField('eve');
      return;
    }
    const inTime = startOfDay(pickupDate);
    if (pickedTime <= inTime) {
      setPickupDate(date);
      setEveDate(null);
      setActiveField('eve');
      return;
    }
    setEveDate(date);
    setActiveField('guests');
    setOpenPopover('guests');
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(calendarYear, calendarMonth + delta, 1);
    setCalendarYear(next.getFullYear());
    setCalendarMonth(next.getMonth());
  };

  const monthCells = useMemo(
    () => getMonthGrid(calendarYear, calendarMonth),
    [calendarYear, calendarMonth]
  );

  const totalGuests = adults + children;
  const guestsSubLabel = guestsTouched
    ? `${totalGuests} ${totalGuests === 1 ? 'pessoa' : 'pessoas'}`
    : 'Quantas pessoas';

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos os Doces') return PRODUCTS;
    const exact = PRODUCTS.filter((p) => p.category === selectedCategory);
    return exact.length > 0 ? exact : PRODUCTS;
  }, [selectedCategory]);

  const similarProducts = useMemo(() => {
    if (!detailProduct) return [];
    return PRODUCTS.filter((p) => p.id !== detailProduct.id).slice(0, 4);
  }, [detailProduct]);

  const savedCount = Object.values(likedIds).filter(Boolean).length;
  const navIsSolid = navScrolled || Boolean(detailProduct);

  // Default Christmas Eve dates
  const detailPickupLabel = pickupDate ? formatFullDate(pickupDate) : '23 Dez, 2026';
  const detailEveLabel = eveDate ? formatFullDate(eveDate) : '24 Dez, 2026';

  const captionData = SLIDES[captionSlide];

  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      {/* Custom grey dot cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`kt-cursor ${isRecMode ? 'is-rec' : ''}`}
      />

      {/* Fixed Navigation Bar */}
      <header className={`kt-nav ${navIsSolid ? 'is-solid' : ''}`}>
        {/* Left side: Luxury Medallion Logo + Wordmark | 1x42 divider | Natal 2026 chevron */}
        <div ref={navLeftRef} className="relative flex items-center">
          <button
            type="button"
            onClick={handleGoHome}
            className="group flex items-center gap-3 whitespace-nowrap leading-none"
          >
            <span className="kt-logo-medallion h-[42px] w-[42px]">
              <img src={ASSETS.logo} alt="Logo Tudo+ Doce" draggable={false} />
            </span>
            <span className="text-[24px] font-light tracking-[-0.015em]">Tudo+ Doce</span>
          </button>

          <span
            aria-hidden="true"
            className="kt-nav-divider mx-[24px] block h-[42px] w-[1px] bg-current opacity-45"
          />

          <button
            type="button"
            onClick={() => setEditionMenuOpen((v) => !v)}
            className="kt-nav-visitors flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-normal opacity-95 transition-opacity hover:opacity-100"
          >
            <span>Natal 2026</span>
            <ChevronDown
              size={13}
              strokeWidth={1.7}
              className={`transition-transform duration-200 ${editionMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {editionMenuOpen && (
            <div className="kt-popover absolute left-[195px] top-[56px] w-[215px] rounded-[14px] bg-white p-2 text-[#24171a] shadow-[0_18px_48px_rgba(68,26,32,0.18)]">
              <button
                type="button"
                onClick={() => {
                  setEditionMenuOpen(false);
                  scrollToProducts();
                }}
                className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-medium hover:bg-[#fdf4f1]"
              >
                <span>Cardápio de Natal</span>
                <Check size={14} className="text-[#c8233c]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditionMenuOpen(false);
                  scrollToAbout();
                }}
                className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] text-[#634a50] hover:bg-[#fdf4f1]"
              >
                <span>Quem Sou Eu</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditionMenuOpen(false);
                  setCustomOrderModalOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] text-[#634a50] hover:bg-[#fdf4f1]"
              >
                <span>Encomendas Corporativas</span>
              </button>
            </div>
          )}
        </div>

        {/* Center links */}
        <nav aria-label="Navegação principal" className="kt-nav-center flex items-center gap-[44px]">
          <button type="button" onClick={scrollToProducts} className="kt-nav-link">
            Cardápio
          </button>
          <button type="button" onClick={scrollToAbout} className="kt-nav-link">
            Quem Sou Eu
          </button>
          <button
            type="button"
            onClick={() => {
              if (detailProduct) closeDetail();
              window.setTimeout(
                () => {
                  document
                    .getElementById('kt-contact')
                    ?.scrollIntoView({ behavior: 'smooth' });
                },
                detailProduct ? 580 : 0
              );
            }}
            className="kt-nav-link"
          >
            Contato
          </button>
        </nav>

        {/* Right side: Encomenda sob medida, snowflake icon, bordered user pill */}
        <div ref={navRightRef} className="relative flex items-center gap-5">
          <button
            type="button"
            onClick={() => setCustomOrderModalOpen(true)}
            className="kt-nav-host whitespace-nowrap text-[14px] font-normal opacity-95 transition-opacity hover:opacity-100"
          >
            Kit Corporativo
          </button>

          <button
            type="button"
            aria-label={`Modo de entrega: ${deliveryMode}`}
            title={deliveryMode}
            onClick={() =>
              setDeliveryMode((prev) =>
                prev === 'Delivery · Natal' ? 'Retirada · Ateliê' : 'Delivery · Natal'
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-full opacity-95 transition-opacity hover:opacity-100"
          >
            <Snowflake size={18} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Menu do cliente"
            onClick={() => setNavMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-[9px] border-[1.5px] border-current px-2.5 py-[5px] transition-opacity hover:opacity-90"
          >
            <Menu size={16} strokeWidth={1.7} />
            <span
              className="flex h-[22px] w-[22px] items-center justify-center rounded-full"
              style={{
                backgroundColor: 'currentColor',
              }}
            >
              <User
                size={13}
                strokeWidth={2}
                color={navIsSolid ? '#f6d8d2' : '#532a32'}
                fill={navIsSolid ? '#f6d8d2' : '#532a32'}
              />
            </span>
          </button>

          {navMenuOpen && (
            <div className="kt-popover absolute right-0 top-[54px] w-[230px] rounded-[16px] bg-white p-2 text-[#24171a] shadow-[0_20px_54px_rgba(68,26,32,0.2)]">
              <div className="border-b border-[#24171a]/8 px-3 py-2 text-[12px] text-[#947b80]">
                Tudo+ Doce · {deliveryMode}
              </div>
              <button
                type="button"
                onClick={() => {
                  setNavMenuOpen(false);
                  scrollToProducts();
                }}
                className="mt-1 flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13.5px] font-medium hover:bg-[#fdf4f1]"
              >
                <span>Doces Favoritos</span>
                <span className="text-[12px] tabular-nums text-[#947b80]">{savedCount}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNavMenuOpen(false);
                  handlePanettoneSpotlight();
                }}
                className="flex w-full items-center rounded-[10px] px-3 py-2 text-left text-[13.5px] hover:bg-[#fdf4f1]"
              >
                Ver Panetones Trufados
              </button>
              <button
                type="button"
                onClick={() => {
                  setNavMenuOpen(false);
                  setCustomOrderModalOpen(true);
                }}
                className="flex w-full items-center rounded-[10px] px-3 py-2 text-left text-[13.5px] hover:bg-[#fdf4f1]"
              >
                Encomenda Personalizada
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="kt-hero">
        {/* Stacked slides container (lags on scroll: +0.42 * scrollY) */}
        <div
          ref={slideStackRef}
          className="absolute inset-0 will-change-transform"
          style={{ zIndex: 1 }}
        >
          {SLIDES.map((slide, sIdx) => {
            let wordCounter = 0;
            return (
              <div
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[sIdx] = el;
                }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  visibility: sIdx === 0 ? 'visible' : 'hidden',
                  zIndex: sIdx === 0 ? 3 : 1,
                }}
              >
                {/* Photo + optional live looping video layer (inset -3%, base scale 1.04) */}
                <div
                  ref={(el) => {
                    photoRefs.current[sIdx] = el;
                  }}
                  className="absolute -inset-[3%] bg-cover bg-no-repeat will-change-transform"
                  style={{
                    backgroundImage: `url("${slide.photo}")`,
                    backgroundPosition: slide.photoPos,
                    transform: 'translate3d(0%, 0%, 0) scale(1.04)',
                  }}
                >
                  {slide.video && (
                    <video
                      src={slide.video}
                      poster={slide.photo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                      style={{ objectPosition: slide.photoPos }}
                    />
                  )}
                </div>

                {/* Warm holiday cocoa-rose top tint behind nav and giant title */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(64,26,34,0.52) 0%, rgba(72,32,40,0.16) 30%, transparent 52%)',
                    zIndex: 2,
                  }}
                />

                {/* Giant gradient-faded title inside slide (wipes together with photo/video) */}
                <h1
                  className={`kt-slide-title ${
                    slide.isExploreLayout
                      ? 'kt-slide-title-explore'
                      : 'kt-slide-title-default'
                  }`}
                >
                  {slide.titleLines.map((line, lIdx) => (
                    <span key={lIdx} className="block">
                      {line.map((word, wIdx) => {
                        const myIndex = wordCounter++;
                        const revealed = sIdx === 0 ? introTitles : true;
                        return (
                          <span
                            key={`${lIdx}-${wIdx}`}
                            className="kt-word-mask"
                            style={{
                              marginRight: wIdx < line.length - 1 ? '0.24em' : '0',
                            }}
                          >
                            <span
                              className={`kt-word-inner ${revealed ? 'is-revealed' : ''}`}
                              style={{
                                transitionDelay: sIdx === 0 ? `${myIndex * 90}ms` : '0ms',
                              }}
                            >
                              {word}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </h1>
              </div>
            );
          })}
        </div>

        {/* Mist band riding along the right-to-left wipe edge */}
        <div ref={mistRef} aria-hidden="true" className="kt-mist-band" />

        {/* Subtle golden Christmas bokeh sparkles in the hero atmosphere */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          {[
            { left: '12%', top: '26%', size: 8, delay: '0s' },
            { left: '28%', top: '18%', size: 6, delay: '1.1s' },
            { left: '46%', top: '24%', size: 9, delay: '2.2s' },
            { left: '65%', top: '19%', size: 7, delay: '0.6s' },
            { left: '78%', top: '34%', size: 8, delay: '1.8s' },
            { left: '21%', top: '62%', size: 7, delay: '2.7s' },
          ].map((sp, i) => (
            <span
              key={i}
              className="kt-sparkle"
              style={{
                left: sp.left,
                top: sp.top,
                width: `${sp.size}px`,
                height: `${sp.size}px`,
                animationDelay: sp.delay,
              }}
            />
          ))}
        </div>

        {/* Bottom volumetric holiday mist bank (screen-blended, dual drifting copies, top-masked) */}
        <div ref={bottomCloudsRef} aria-hidden="true" className="kt-cloud-bank">
          <div className="kt-cloud-copy kt-cloud-back" />
          <div className="kt-cloud-copy kt-cloud-front" />
        </div>

        {/* Top volumetric mist layer (flipped vertically, fades in on scroll) */}
        <div ref={topCloudRef} aria-hidden="true" className="kt-cloud-top">
          <div className="kt-cloud-top-inner" />
        </div>

        {/* Bottom champagne-blush fade melting seamlessly into #f6d8d2 */}
        <div aria-hidden="true" className="kt-bottom-fade" />

        {/* Right rail: concentric rings, round Christmas thumbnails, connector & caption */}
        <div ref={railRef} className="kt-rail">
          <div
            aria-hidden="true"
            className="kt-ring"
            style={{
              left: `${railLayout.cx - railLayout.r1}px`,
              top: `${railLayout.activeCenterY - railLayout.r1}px`,
              width: `${railLayout.r1 * 2}px`,
              height: `${railLayout.r1 * 2}px`,
              opacity: introRings ? 1 : 0,
            }}
          />
          <div
            aria-hidden="true"
            className="kt-ring"
            style={{
              left: `${railLayout.cx - railLayout.r2}px`,
              top: `${railLayout.activeCenterY - railLayout.r2}px`,
              width: `${railLayout.r2 * 2}px`,
              height: `${railLayout.r2 * 2}px`,
              opacity: introRings ? 1 : 0,
            }}
          />

          {railLayout.thumbs.map((thumb, idx) => (
            <div
              key={thumb.id}
              className="kt-thumb-wrap"
              style={{
                top: `${thumb.top}px`,
                left: `${thumb.left}px`,
                width: `${thumb.size}px`,
                height: `${thumb.size}px`,
              }}
            >
              <button
                type="button"
                aria-label={thumb.label}
                aria-pressed={thumb.isActive}
                data-clickable="true"
                onClick={() => handleThumbClick(thumb.slideIndex)}
                className={`kt-thumb-btn ${introThumbs ? 'is-intro-in' : ''}`}
                style={{
                  transitionDelay: introThumbsDone ? '0ms' : `${idx * 140}ms`,
                }}
              >
                <span
                  aria-hidden="true"
                  className={`kt-thumb-halo ${thumb.isActive ? 'is-active' : ''}`}
                />
                <img
                  src={thumb.photo}
                  alt={thumb.label}
                  draggable={false}
                  className="h-full w-full rounded-full object-cover select-none"
                  style={{ objectPosition: thumb.photoPos || 'center center' }}
                />
              </button>
            </div>
          ))}

          {/* Horizontal white connector line */}
          <div
            aria-hidden="true"
            className={`kt-connector ${captionShown ? 'is-shown' : ''}`}
            style={{
              top: `${railLayout.connTop}px`,
              left: `${railLayout.connLeft}px`,
              width: `${railLayout.connW}px`,
            }}
          />

          {/* Caption block anchored left of connector */}
          <div
            className="kt-caption"
            style={{
              top: `${railLayout.activeCenterY}px`,
              right: `${railLayout.captionRightCss}px`,
            }}
          >
            <div
              aria-hidden="true"
              className={`kt-caption-bar ${captionShown ? 'is-shown' : ''}`}
              style={{ height: `${railLayout.barHeight}px` }}
            />
            <div className={`kt-caption-text ${captionShown ? 'is-shown' : ''}`}>
              <h2
                className="font-light leading-[1.12] tracking-[-0.01em] text-white"
                style={{
                  fontSize: 'clamp(26px, 2.75vw, 40px)',
                  textShadow: '0 4px 22px rgba(48, 16, 22, 0.45)',
                }}
              >
                {captionData.captionTitle}
              </h2>
              <p
                className="mt-1.5 max-w-[255px] font-normal leading-[1.45] text-white/90"
                style={{
                  fontSize: 'clamp(12px, 1vw, 14.5px)',
                  textShadow: '0 2px 14px rgba(48, 16, 22, 0.45)',
                }}
              >
                {captionData.captionDesc}
              </p>
            </div>
          </div>
        </div>

        {/* White Floating Order / Search Bar + Date Range & Guests Popovers */}
        <div
          ref={searchShellRef}
          className={`kt-search-shell ${introSearch ? 'is-intro-in' : ''}`}
        >
          <div className="kt-search-bar">
            {/* Field 1: Category */}
            <button
              type="button"
              data-clickable="true"
              onClick={() => {
                setActiveField('cat');
                setOpenPopover((p) => (p === 'cat' ? null : 'cat'));
              }}
              className={`kt-search-field is-dest ${
                activeField === 'cat' ? 'is-raised' : ''
              }`}
            >
              <Gift
                size={16}
                strokeWidth={1.6}
                className="shrink-0 text-[#c8233c] opacity-90"
              />
              <div className="min-w-0">
                <div className="truncate text-[21px] font-medium leading-tight text-[#24171a] max-[640px]:text-[16px]">
                  {selectedCategory === 'Todos os Doces' ? 'Natal 2026' : selectedCategory}
                </div>
                <div className="truncate text-[13px] leading-tight text-[#947b80] max-[640px]:text-[11.5px]">
                  {selectedCategory === 'Todos os Doces'
                    ? 'Escolha o doce'
                    : 'Categoria natalina'}
                </div>
              </div>
            </button>

            {/* Field 2: Retirada (starts raised) */}
            <button
              type="button"
              data-clickable="true"
              onClick={() => {
                setActiveField('pickup');
                setOpenPopover((p) =>
                  p === 'calendar' && activeField === 'pickup' ? null : 'calendar'
                );
              }}
              className={`kt-search-field ${
                activeField === 'pickup' ? 'is-raised' : ''
              }`}
            >
              <Calendar
                size={16}
                strokeWidth={1.6}
                className="shrink-0 text-[#24171a] opacity-85"
              />
              <div className="min-w-0">
                <div className="truncate text-[21px] font-medium leading-tight text-[#24171a] max-[640px]:text-[16px]">
                  Retirada
                </div>
                <div className="truncate text-[13px] leading-tight text-[#947b80] max-[640px]:text-[11.5px]">
                  {pickupDate ? formatShortDate(pickupDate) : 'Escolher data'}
                </div>
              </div>
            </button>

            {/* Field 3: Ceia / Entrega */}
            <button
              type="button"
              data-clickable="true"
              onClick={() => {
                setActiveField('eve');
                setOpenPopover((p) =>
                  p === 'calendar' && activeField === 'eve' ? null : 'calendar'
                );
              }}
              className={`kt-search-field ${
                activeField === 'eve' ? 'is-raised' : ''
              }`}
            >
              <Calendar
                size={16}
                strokeWidth={1.6}
                className="shrink-0 text-[#24171a] opacity-85"
              />
              <div className="min-w-0">
                <div className="truncate text-[21px] font-medium leading-tight text-[#24171a] max-[640px]:text-[16px]">
                  Entrega
                </div>
                <div className="truncate text-[13px] leading-tight text-[#947b80] max-[640px]:text-[11.5px]">
                  {eveDate ? formatShortDate(eveDate) : 'Data da ceia'}
                </div>
              </div>
            </button>

            {/* Field 4: Convidados */}
            <button
              type="button"
              data-clickable="true"
              onClick={() => {
                setActiveField('guests');
                setOpenPopover((p) => (p === 'guests' ? null : 'guests'));
              }}
              className={`kt-search-field ${
                activeField === 'guests' ? 'is-raised' : ''
              }`}
            >
              <Users
                size={16}
                strokeWidth={1.6}
                className="shrink-0 text-[#24171a] opacity-85"
              />
              <div className="min-w-0">
                <div className="truncate text-[21px] font-medium leading-tight text-[#24171a] max-[640px]:text-[16px]">
                  Convidados
                </div>
                <div className="truncate text-[13px] leading-tight text-[#947b80] max-[640px]:text-[11.5px]">
                  {guestsSubLabel}
                </div>
              </div>
            </button>

            {/* Black paper-plane send button */}
            <button
              type="button"
              aria-label="Ver doces de Natal"
              data-clickable="true"
              onClick={scrollToProducts}
              className="kt-send-btn"
            >
              <Send size={17} strokeWidth={1.9} className="-translate-x-[1px] translate-y-[1px]" />
            </button>
          </div>

          {/* Category Popover */}
          {openPopover === 'cat' && (
            <div className="kt-popover absolute left-0 top-[calc(100%+12px)] z-30 w-[260px] rounded-[18px] bg-white p-3 shadow-[0_24px_64px_rgba(95,40,46,0.2)]">
              <div className="px-2.5 pb-2 pt-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#947b80]">
                Coleção de Natal
              </div>
              <div className="grid gap-1">
                {CATEGORIES.map((cat) => {
                  const isSel = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveField('pickup');
                        setOpenPopover('calendar');
                      }}
                      className={`flex items-center justify-between rounded-[10px] px-3 py-2 text-left text-[14px] transition-colors ${
                        isSel
                          ? 'bg-[#fae1dc] font-semibold text-[#24171a]'
                          : 'text-[#24171a] hover:bg-[#fdf4f1]'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSel && <Check size={14} className="text-[#c8233c]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar Popover */}
          {openPopover === 'calendar' && (
            <div className="kt-popover absolute left-1/2 top-[calc(100%+12px)] z-30 w-[294px] -translate-x-1/2 rounded-[18px] bg-white p-5 shadow-[0_24px_64px_rgba(95,40,46,0.22)]">
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Mês anterior"
                  onClick={() => shiftMonth(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#24171a] transition-colors hover:bg-[#fdf4f1]"
                >
                  <ChevronLeft size={17} strokeWidth={1.8} />
                </button>
                <div className="text-[15px] font-semibold text-[#24171a]">
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </div>
                <button
                  type="button"
                  aria-label="Próximo mês"
                  onClick={() => shiftMonth(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#24171a] transition-colors hover:bg-[#fdf4f1]"
                >
                  <ChevronRight size={17} strokeWidth={1.8} />
                </button>
              </div>

              <div className="mb-1.5 grid grid-cols-7 text-center">
                {WEEKDAYS_MON.map((day) => (
                  <div
                    key={day}
                    className="flex h-[28px] w-[34px] items-center justify-center text-[11.5px] font-medium text-[#947b80]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {monthCells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="h-[34px] w-[34px]" />;
                  }

                  const cellTime = startOfDay(cell);
                  const inTime = pickupDate ? startOfDay(pickupDate) : null;
                  const outTime = eveDate ? startOfDay(eveDate) : null;

                  const isStart = sameDay(cell, pickupDate);
                  const isEnd = sameDay(cell, eveDate);
                  const isBetween =
                    inTime !== null &&
                    outTime !== null &&
                    cellTime > inTime &&
                    cellTime < outTime;

                  const isDisabled =
                    activeField === 'eve' &&
                    inTime !== null &&
                    outTime === null &&
                    cellTime < inTime;

                  return (
                    <button
                      key={cellTime}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handlePickDate(cell)}
                      className={`flex h-[34px] w-[34px] items-center justify-center text-[13px] font-medium tabular-nums transition-colors ${
                        isStart || isEnd
                          ? 'rounded-[9px] bg-[#24171a] text-white'
                          : isBetween
                          ? 'bg-[#fae1dc] text-[#24171a]'
                          : isDisabled
                          ? 'pointer-events-none text-[#947b80]/35'
                          : 'rounded-[9px] text-[#24171a] hover:bg-[#fdf4f1]'
                      }`}
                    >
                      {cell.getDate()}
                    </button>
                  );
                })}
              </div>

              {(pickupDate || eveDate) && (
                <div className="mt-3 flex items-center justify-between border-t border-[#24171a]/8 pt-2.5 text-[12px] text-[#634a50]">
                  <span>
                    {pickupDate ? formatShortDate(pickupDate) : '—'} →{' '}
                    {eveDate ? formatShortDate(eveDate) : 'Escolha entrega'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPickupDate(null);
                      setEveDate(null);
                      setActiveField('pickup');
                    }}
                    className="font-medium text-[#24171a] underline-offset-2 hover:underline"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Guests Popover */}
          {openPopover === 'guests' && (
            <div className="kt-popover absolute right-0 top-[calc(100%+12px)] z-30 w-[280px] rounded-[18px] bg-white p-5 shadow-[0_24px_64px_rgba(95,40,46,0.22)]">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <div className="text-[15px] font-semibold text-[#24171a]">Adultos</div>
                  <div className="text-[12.5px] text-[#947b80]">Na sua ceia</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Diminuir adultos"
                    disabled={adults <= 1}
                    onClick={() => {
                      setAdults((a) => Math.max(1, a - 1));
                      setGuestsTouched(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24171a]/20 text-[#24171a] transition-colors hover:border-[#24171a] disabled:opacity-30"
                  >
                    <Minus size={14} strokeWidth={1.8} />
                  </button>
                  <span className="w-6 text-center text-[15px] font-semibold tabular-nums text-[#24171a]">
                    {adults}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar adultos"
                    onClick={() => {
                      setAdults((a) => Math.min(40, a + 1));
                      setGuestsTouched(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24171a]/20 text-[#24171a] transition-colors hover:border-[#24171a]"
                  >
                    <Plus size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#24171a]/8 pt-4">
                <div>
                  <div className="text-[15px] font-semibold text-[#24171a]">Crianças</div>
                  <div className="text-[12.5px] text-[#947b80]">2 a 12 anos</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Diminuir crianças"
                    disabled={children <= 0}
                    onClick={() => {
                      setChildren((c) => Math.max(0, c - 1));
                      setGuestsTouched(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24171a]/20 text-[#24171a] transition-colors hover:border-[#24171a] disabled:opacity-30"
                  >
                    <Minus size={14} strokeWidth={1.8} />
                  </button>
                  <span className="w-6 text-center text-[15px] font-semibold tabular-nums text-[#24171a]">
                    {children}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar crianças"
                    onClick={() => {
                      setChildren((c) => Math.min(20, c + 1));
                      setGuestsTouched(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24171a]/20 text-[#24171a] transition-colors hover:border-[#24171a]"
                  >
                    <Plus size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* "Doces Recomendados para o Natal" SECTION */}
      <section ref={productsSectionRef} id="cardapio" className="kt-stays-section">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2
            className="font-serif-display font-normal leading-tight text-[#24171a]"
            style={{ fontSize: 'clamp(26px, 2.45vw, 36px)' }}
          >
            Doces Recomendados para o Natal
          </h2>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Todos os Doces');
              productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="shrink-0 whitespace-nowrap rounded-[20px] border-[1.4px] border-[#24171a] px-[22px] py-[7px] text-[13.5px] font-medium text-[#24171a] transition-colors duration-300 hover:bg-[#24171a] hover:text-white"
          >
            {selectedCategory === 'Todos os Doces' ? 'Ver Todos' : 'Mostrar Todos (8)'}
          </button>
        </div>

        <div className="kt-stays-grid">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              liked={Boolean(likedIds[product.id])}
              isPopping={poppingId === product.id}
              isVisible={productsVisible}
              onToggleLike={handleToggleLike}
              onSelect={openProductDetail}
            />
          ))}
        </div>
      </section>

      {/* "Quem Sou Eu" — Animated Editorial Section with Portrait Curtain Reveal, 3D Tilt & Floating Luxury Logo */}
      <section ref={aboutSectionRef} id="quem-sou-eu" className="kt-about-section">
        <div className="kt-about-grid">
          {/* Left: Studio Portrait with Vertical Curtain Wipe, 3D Pointer Tilt & Orbiting Gold Medallion */}
          <div className="relative mx-auto w-full max-w-[490px]">
            {/* Concentric golden rings echoing the hero rail motif */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 -top-8 h-[170px] w-[170px] rounded-full border border-[#c89238]/28 transition-all duration-1000"
              style={{
                opacity: aboutVisible ? 1 : 0,
                transform: aboutVisible ? 'scale(1)' : 'scale(0.75)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-14 -top-14 h-[220px] w-[220px] rounded-full border border-[#c8233c]/14 transition-all duration-1000"
              style={{
                opacity: aboutVisible ? 1 : 0,
                transform: aboutVisible ? 'scale(1)' : 'scale(0.75)',
                transitionDelay: '120ms',
              }}
            />

            <div
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                setPortraitTilt({ rx: -ny * 7, ry: nx * 7 });
              }}
              onMouseLeave={() => setPortraitTilt({ rx: 0, ry: 0 })}
              style={{
                perspective: '1000px',
              }}
            >
              <div
                className={`kt-about-portrait-frame ${aboutVisible ? 'is-inview' : ''}`}
                style={{
                  transform: `rotateX(${portraitTilt.rx.toFixed(2)}deg) rotateY(${portraitTilt.ry.toFixed(2)}deg)`,
                  transition:
                    portraitTilt.rx === 0 && portraitTilt.ry === 0
                      ? 'clip-path 1.15s var(--out), transform 0.65s var(--out)'
                      : 'clip-path 1.15s var(--out), transform 0.14s linear',
                }}
              >
                <img
                  src={ASSETS.quemSouEu}
                  alt="Confeiteira fundadora da Tudo+ Doce"
                  className="kt-about-portrait-img"
                  draggable={false}
                />
                {/* Soft blush bottom gradient grounding the studio portrait into the warm page */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(246,216,210,0) 0%, rgba(76,20,30,0.42) 100%)',
                  }}
                />
                <div className="pointer-events-none absolute bottom-5 left-6 text-white">
                  <div className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-white/85">
                    Chef Confeiteira · Fundadora
                  </div>
                  <div className="font-serif-display mt-0.5 text-[22px] leading-tight">
                    Ateliê Tudo+ Doce
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Luxury Gold Medallion Seal with rotating dashed golden halo */}
            <div className={`kt-about-seal-orbit ${aboutVisible ? 'is-inview' : ''}`}>
              <div className="kt-about-seal-float relative">
                <span aria-hidden="true" className="kt-about-ring-dashed" />
                <div className="kt-logo-medallion h-[108px] w-[108px] max-[640px]:h-[86px] max-[640px]:w-[86px]">
                  <img
                    src={ASSETS.logo}
                    alt="Selo Luxuoso Tudo+ Doce"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Story + Interactive Christmas Commercial Film Preview */}
          <div className="flex flex-col">
            <div
              className={`kt-about-reveal flex items-center gap-3 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#c8233c] ${
                aboutVisible ? 'is-inview' : ''
              }`}
              style={{ transitionDelay: '80ms' }}
            >
              <span className="h-[1.5px] w-8 bg-[#c8233c]" />
              <span>Quem Sou Eu</span>
            </div>

            <h2
              className={`kt-about-reveal font-serif-display mt-3 font-normal leading-[1.12] text-[#24171a] ${
                aboutVisible ? 'is-inview' : ''
              }`}
              style={{
                fontSize: 'clamp(30px, 3vw, 44px)',
                transitionDelay: '160ms',
              }}
            >
              A alma doce por trás de cada receita do seu Natal
            </h2>

            <p
              className={`kt-about-reveal mt-5 text-[15.5px] leading-[1.72] text-[#634a50] ${
                aboutVisible ? 'is-inview' : ''
              }`}
              style={{ transitionDelay: '240ms' }}
            >
              A <strong className="font-semibold text-[#24171a]">Tudo+ Doce</strong> nasceu do meu
              amor por transformar receitas afetivas em lembranças inesquecíveis à mesa. Cada bolo
              festivo, panetone trufado e pudim de baunilha é preparado pessoalmente no meu ateliê —
              do ponto exato da ganache belga até o laço de cetim amarrado à mão antes de chegar à
              sua ceia.
            </p>

            {/* Clean unboxed editorial metadata */}
            <div
              className={`kt-about-reveal mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[#24171a]/10 py-4 text-[13.5px] font-medium text-[#24171a] ${
                aboutVisible ? 'is-inview' : ''
              }`}
              style={{ transitionDelay: '320ms' }}
            >
              <span>100% Artesanal</span>
              <span aria-hidden="true" className="text-[#c8233c]">
                ·
              </span>
              <span>Chocolate Belga Nobre</span>
              <span aria-hidden="true" className="text-[#c8233c]">
                ·
              </span>
              <span>Produção Limitada de Natal</span>
            </div>

            {/* Interactive Commercial Film Card */}
            <div
              className={`kt-about-reveal mt-7 ${aboutVisible ? 'is-inview' : ''}`}
              style={{ transitionDelay: '400ms' }}
            >
              <button
                type="button"
                data-clickable="true"
                onClick={() => setFilmModalOpen(true)}
                className="group relative block w-full overflow-hidden rounded-[16px] bg-[#24171a] text-left shadow-[0_18px_46px_rgba(88,28,36,0.22)] transition-transform duration-500 hover:-translate-y-1"
                style={{ aspectRatio: '16 / 8.2' }}
              >
                <video
                  src={ASSETS.commercialVideo}
                  poster={ASSETS.panettone}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(36,16,20,0.78) 0%, rgba(36,16,20,0.28) 55%, rgba(36,16,20,0.12) 100%)',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="max-w-[65%] text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f5cf86]">
                      Bastidores & Campanha
                    </div>
                    <div className="font-serif-display mt-1 text-[21px] leading-snug max-[640px]:text-[17px]">
                      Assista ao Filme de Natal Tudo+ Doce
                    </div>
                  </div>
                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c8233c] group-hover:border-[#c8233c]">
                    <Play size={20} fill="currentColor" className="translate-x-[1px]" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet minimal footer with Luxury Medallion Logo */}
      <footer
        id="kt-contact"
        className="border-t border-[#24171a]/8 px-[clamp(20px,9.5vw,170px)] py-10 text-[13px] text-[#634a50]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="kt-logo-medallion h-[38px] w-[38px]">
              <img src={ASSETS.logo} alt="Tudo+ Doce" draggable={false} />
            </span>
            <span className="text-[20px] font-light text-[#24171a]">Tudo+ Doce</span>
            <span className="opacity-50">·</span>
            <span>Ateliê de Confeitaria Artesanal · Edição de Natal</span>
          </div>
          <div className="flex items-center gap-6">
            <span>encomendas@tudomaisdoce.com.br</span>
            <span>WhatsApp (11) 99420-1225</span>
          </div>
        </div>
      </footer>

      {/* SHARED-ELEMENT FLIGHT OVERLAY */}
      {flightActive && flightPhoto && (
        <div
          ref={flightElRef}
          aria-hidden="true"
          className="pointer-events-none fixed z-[80] overflow-hidden shadow-[0_20px_50px_rgba(90,38,44,0.24)]"
        >
          <img
            src={flightPhoto}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: flightObjPos }}
          />
        </div>
      )}

      {/* FIXED FULL-SCREEN PRODUCT DETAIL PAGE */}
      {detailProduct && (
        <div
          ref={detailOverlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={detailProduct.name}
          className={`kt-detail-overlay ${detailOpen ? 'is-open' : ''}`}
        >
          <div className="kt-detail-inner">
            {/* Breadcrumb */}
            <nav
              aria-label="Navegação estrutural"
              className={`kt-detail-block mb-6 flex flex-wrap items-center gap-2 text-[12.5px] text-[#24171a] ${
                blocksShown ? 'is-shown' : ''
              }`}
              style={{ transitionDelay: '0ms' }}
            >
              <button
                type="button"
                onClick={closeDetail}
                className="font-medium underline-offset-4 hover:underline"
              >
                Início
              </button>
              <span className="opacity-45">›</span>
              <button
                type="button"
                onClick={closeDetail}
                className="opacity-80 hover:opacity-100"
              >
                Cardápio de Natal
              </button>
              <span className="opacity-45">›</span>
              <button
                type="button"
                onClick={closeDetail}
                className="opacity-80 hover:opacity-100"
              >
                {detailProduct.category}
              </button>
              <span className="opacity-45">›</span>
              <span className="text-[#947b80]">{detailProduct.name}</span>
            </nav>

            {/* Two-column detail layout (1.18fr / 1fr) */}
            <div className="kt-detail-grid">
              {/* Left Column: Main product photo/video + 3 gallery thumbnails */}
              <div>
                <div
                  ref={detailHeroRef}
                  className="relative w-full overflow-hidden rounded-[10px] bg-[#edd1cb]"
                  style={{
                    aspectRatio: '512 / 445',
                    opacity: flightActive ? 0 : 1,
                  }}
                >
                  {playingDetailVideo && detailProduct.video ? (
                    <video
                      src={detailProduct.video}
                      poster={detailProduct.photo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={activePreviewImg || detailProduct.photo}
                      alt={detailProduct.name}
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: activePreviewImg
                          ? 'center center'
                          : detailProduct.objectPos,
                      }}
                    />
                  )}

                  {/* Heart button */}
                  <button
                    type="button"
                    aria-label={
                      likedIds[detailProduct.id] ? 'Remover dos favoritos' : 'Favoritar doce'
                    }
                    onClick={(e) => handleToggleLike(detailProduct.id, e)}
                    className="absolute right-4 top-4 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/92 shadow-md transition-transform duration-200 hover:scale-110"
                  >
                    <Heart
                      size={17}
                      strokeWidth={1.9}
                      className={poppingId === detailProduct.id ? 'kt-heart-pop' : ''}
                      color={likedIds[detailProduct.id] ? '#e63956' : '#24171a'}
                      fill={likedIds[detailProduct.id] ? '#e63956' : 'none'}
                    />
                  </button>

                  {/* Optional video toggle button when product has a real 1080p video */}
                  {detailProduct.video && !activePreviewImg && (
                    <button
                      type="button"
                      onClick={() => setPlayingDetailVideo((v) => !v)}
                      className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full bg-[#24171a]/82 px-4 py-2 text-[12.5px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-[#c8233c]"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>{playingDetailVideo ? 'Ver foto principal' : 'Ver preparo em vídeo'}</span>
                    </button>
                  )}

                  {activePreviewImg && (
                    <button
                      type="button"
                      onClick={() => setActivePreviewImg(null)}
                      className="absolute bottom-3.5 left-3.5 rounded-full bg-[#24171a]/82 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-[#24171a]"
                    >
                      Voltar para foto principal
                    </button>
                  )}
                </div>

                {/* Three square gallery thumbnails with 16px gap */}
                <div
                  className={`kt-detail-block mt-4 grid grid-cols-3 gap-[16px] ${
                    blocksShown ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '70ms' }}
                >
                  {detailProduct.gallery.map((thumbUrl, i) => {
                    const isThird = i === 2;
                    const isActivePreview = activePreviewImg === thumbUrl;
                    return (
                      <button
                        key={`${thumbUrl}-${i}`}
                        type="button"
                        onClick={() => {
                          setPlayingDetailVideo(false);
                          setActivePreviewImg((curr) =>
                            curr === thumbUrl ? null : thumbUrl
                          );
                        }}
                        className={`kt-interior-thumb relative aspect-square w-full overflow-hidden rounded-[10px] ${
                          isActivePreview ? 'ring-2 ring-[#c8233c] ring-offset-2' : ''
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`${detailProduct.name} detalhe ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {isThird && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#24171a]/48 text-[22px] font-semibold text-white backdrop-blur-[1px]">
                            +9
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Title, Chef, About, Order Card, Rating Row, Highlights */}
              <div className="flex flex-col">
                <div
                  className={`kt-detail-block ${blocksShown ? 'is-shown' : ''}`}
                  style={{ transitionDelay: '140ms' }}
                >
                  <h1
                    className="font-serif-display font-normal leading-[1.12] text-[#24171a]"
                    style={{ fontSize: 'clamp(28px, 2.7vw, 38px)' }}
                  >
                    {detailProduct.name}
                  </h1>
                  <div className="mt-3 flex items-center gap-2.5 text-[13.5px] text-[#634a50]">
                    <span>Feito à mão por</span>
                    <img
                      src={ASSETS.quemSouEu}
                      alt="Chef Tudo+ Doce"
                      className="h-[24px] w-[24px] rounded-full object-cover ring-1 ring-[#c89238]/50"
                      style={{ objectPosition: '50% 18%' }}
                    />
                    <span className="font-semibold text-[#24171a]">Confeitaria Tudo+ Doce</span>
                    <span className="kt-logo-medallion h-[22px] w-[22px]">
                      <img src={ASSETS.logo} alt="Selo Tudo+ Doce" draggable={false} />
                    </span>
                  </div>
                </div>

                {/* About */}
                <div
                  className={`kt-detail-block mt-6 ${blocksShown ? 'is-shown' : ''}`}
                  style={{ transitionDelay: '210ms' }}
                >
                  <h2 className="font-serif-display text-[21px] font-normal text-[#24171a]">
                    Sobre {detailProduct.name}
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-[1.68] text-[#634a50]">
                    {detailProduct.description}
                  </p>
                </div>

                {/* Order Card */}
                <div
                  className={`kt-detail-block mt-6 rounded-[18px] border border-[#24171a]/6 bg-white p-6 shadow-[0_16px_44px_rgba(110,48,54,0.11)] ${
                    blocksShown ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '280ms' }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[26px] font-bold tabular-nums text-[#24171a]">
                        R$ {(detailProduct.price * orderQty).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[14px] text-[#947b80]">
                        {orderQty > 1 ? `(${orderQty} un.)` : detailProduct.unitLabel}
                      </span>
                    </div>
                    <span className="text-[12.5px] text-[#634a50]">{detailProduct.subtitle}</span>
                  </div>

                  {/* Pale blush-grey dates box */}
                  <div className="mt-4 grid grid-cols-2 divide-x divide-[#24171a]/8 rounded-[12px] bg-[#f8f3f2] px-1 py-3">
                    <div className="px-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#947b80]">
                        Retirada
                      </div>
                      <div className="mt-1 text-[14px] font-semibold text-[#24171a]">
                        {detailPickupLabel}
                      </div>
                    </div>
                    <div className="px-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#947b80]">
                        Ceia / Entrega
                      </div>
                      <div className="mt-1 text-[14px] font-semibold text-[#24171a]">
                        {detailEveLabel}
                      </div>
                    </div>
                  </div>

                  {/* Quantity row with - / + steppers */}
                  <div className="mt-4 flex items-center justify-between px-1">
                    <div>
                      <div className="text-[14px] font-semibold text-[#24171a]">Quantidade</div>
                      <div className="text-[12px] text-[#947b80]">
                        Embalagem natalina com laço inclusa
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        disabled={orderQty <= 1}
                        onClick={() => setOrderQty((q) => Math.max(1, q - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24171a]/18 text-[#24171a] transition-colors hover:border-[#24171a] disabled:opacity-30"
                      >
                        <Minus size={14} strokeWidth={1.8} />
                      </button>
                      <span className="w-6 text-center text-[15px] font-semibold tabular-nums text-[#24171a]">
                        {orderQty}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => setOrderQty((q) => Math.min(15, q + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24171a]/18 text-[#24171a] transition-colors hover:border-[#24171a]"
                      >
                        <Plus size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>

                  {/* Festive crimson CTA -> turns Christmas pine green "Encomendado ✓" */}
                  <button
                    type="button"
                    onClick={() => setOrdered(true)}
                    className={`mt-5 flex h-[48px] w-full items-center justify-center rounded-full text-[15px] font-semibold text-white transition-all duration-300 ${
                      ordered
                        ? 'bg-[#1f7a4c] shadow-[0_10px_24px_rgba(31,122,76,0.3)]'
                        : 'bg-[#c8233c] shadow-[0_10px_24px_rgba(200,35,60,0.32)] hover:brightness-105'
                    }`}
                  >
                    {ordered ? 'Encomendado ✓' : 'Encomendar Agora'}
                  </button>
                </div>

                {/* Rating row between hairlines */}
                <div
                  className={`kt-detail-block mt-6 border-y border-[#24171a]/10 py-4 ${
                    blocksShown ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '350ms' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[20px] font-bold tabular-nums text-[#24171a]">
                          {userRating > 0
                            ? (
                                (parseFloat(detailProduct.rating.replace(',', '.')) *
                                  detailProduct.reviewsCount +
                                  userRating) /
                                (detailProduct.reviewsCount + 1)
                              )
                                .toFixed(1)
                                .replace('.', ',')
                            : detailProduct.rating}
                        </span>
                        <span className="text-[12.5px] text-[#947b80]">
                          ({detailProduct.reviewsCount + (userRating > 0 ? 1 : 0)} avaliações)
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-[3px]">
                        {[0, 1, 2, 3, 4].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            strokeWidth={1.5}
                            color="#e63956"
                            fill="#e63956"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Three overlapping circular thumbnails */}
                    <div className="flex items-center">
                      {[ASSETS.chefHero, ASSETS.roseCake, ASSETS.taca].map((av, idx) => (
                        <img
                          key={av}
                          src={av}
                          alt={`Avaliação ${idx + 1}`}
                          className="h-[38px] w-[38px] rounded-full border-2 border-white object-cover shadow-sm"
                          style={{
                            marginLeft: idx === 0 ? 0 : '-10px',
                            objectPosition: idx === 0 ? '50% 20%' : 'center center',
                          }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setRatingOpen((r) => !r)}
                      className="rounded-full border-[1.3px] border-[#24171a]/25 px-4 py-1.5 text-[13px] font-medium text-[#24171a] transition-colors hover:border-[#24171a] hover:bg-[#24171a] hover:text-white"
                    >
                      {userRating > 0 ? `Nota ${userRating}/5` : 'Avaliar'}
                    </button>
                  </div>

                  {ratingOpen && (
                    <div className="mt-3 flex items-center justify-between rounded-[12px] bg-[#fdf4f1] px-4 py-2.5">
                      <span className="text-[13px] font-medium text-[#24171a]">
                        Sua nota para {detailProduct.name}:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            aria-label={`Avaliar com ${starVal} estrelas`}
                            onClick={() => {
                              setUserRating(starVal);
                              setRatingOpen(false);
                            }}
                            className="p-1 transition-transform hover:scale-125"
                          >
                            <Star
                              size={16}
                              color="#e63956"
                              fill={starVal <= userRating ? '#e63956' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Diferenciais 3x2 grid */}
                <div
                  className={`kt-detail-block mt-6 ${blocksShown ? 'is-shown' : ''}`}
                  style={{ transitionDelay: '420ms' }}
                >
                  <h3 className="font-serif-display text-[20px] font-normal text-[#24171a]">
                    Diferenciais
                  </h3>
                  <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-4 max-[480px]:grid-cols-2">
                    {[
                      { icon: Award, label: 'Chocolate Belga' },
                      { icon: Gift, label: 'Laço de Cetim' },
                      { icon: Truck, label: 'Entrega Refrigerada' },
                      { icon: ChefHat, label: '100% Artesanal' },
                      { icon: Clock, label: 'Feito no Dia' },
                      { icon: Sparkles, label: 'Cartão de Natal' },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 text-[13.5px] text-[#634a50]"
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.45}
                          className="shrink-0 text-[#24171a]"
                        />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Outros Doces de Natal (4 more cards) */}
            <div
              className={`kt-detail-block mt-16 ${blocksShown ? 'is-shown' : ''}`}
              style={{ transitionDelay: '490ms' }}
            >
              <h2
                className="font-serif-display mb-6 font-normal text-[#24171a]"
                style={{ fontSize: 'clamp(24px, 2.2vw, 32px)' }}
              >
                Outros Doces de Natal
              </h2>
              <div className="kt-stays-grid">
                {similarProducts.map((simProd, idx) => (
                  <ProductCard
                    key={simProd.id}
                    product={simProd}
                    index={idx}
                    liked={Boolean(likedIds[simProd.id])}
                    isPopping={poppingId === simProd.id}
                    isVisible={true}
                    onToggleLike={handleToggleLike}
                    onSelect={openProductDetail}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Christmas Commercial Film Modal */}
      {filmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filme de Natal Tudo+ Doce"
          onClick={() => setFilmModalOpen(false)}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-[#180c0f]/86 p-5 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="kt-popover relative w-full max-w-[960px] overflow-hidden rounded-[22px] bg-[#180c0f] shadow-[0_32px_90px_rgba(0,0,0,0.65)] ring-1 ring-[#f4c666]/35"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <span className="kt-logo-medallion h-[32px] w-[32px]">
                  <img src={ASSETS.logo} alt="Tudo+ Doce" draggable={false} />
                </span>
                <span className="font-serif-display text-[18px]">
                  Campanha Especial de Natal — Tudo+ Doce
                </span>
              </div>
              <button
                type="button"
                aria-label="Fechar vídeo"
                onClick={() => setFilmModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X size={19} strokeWidth={1.8} />
              </button>
            </div>
            <video
              src={ASSETS.commercialVideo}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-black object-cover"
            />
          </div>
        </div>
      )}

      {/* Kit Corporativo / Encomenda Sob Medida modal */}
      {customOrderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Encomenda personalizada de Natal"
          onClick={() => setCustomOrderModalOpen(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#24171a]/45 p-5 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="kt-popover w-full max-w-[440px] rounded-[22px] bg-white p-7 text-[#24171a] shadow-[0_28px_70px_rgba(48,18,24,0.28)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="kt-logo-medallion h-[46px] w-[46px]">
                  <img src={ASSETS.logo} alt="Tudo+ Doce" draggable={false} />
                </span>
                <div>
                  <h2 className="font-serif-display text-[24px] leading-tight">
                    Kits de Natal Sob Medida
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#634a50]">
                    Ateliê Tudo+ Doce · Natal 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fechar modal"
                onClick={() => setCustomOrderModalOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[#fdf4f1]"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[#634a50]">
              Monte presentes personalizados com panetones trufados, mini bolos e cartão exclusivo
              da Tudo+ Doce para sua equipe ou família.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCustomOrderModalOpen(false);
              }}
              className="mt-5 space-y-3.5"
            >
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#634a50]">
                  Seu nome ou empresa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Mariana Silva"
                  className="w-full rounded-[11px] border border-[#24171a]/15 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#24171a]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#634a50]">
                  Linha desejada
                </label>
                <select className="w-full rounded-[11px] border border-[#24171a]/15 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-[#24171a]">
                  {CATEGORIES.filter((c) => c !== 'Todos os Doces').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-2 h-[44px] w-full rounded-full bg-[#c8233c] text-[14.5px] font-semibold text-white transition-all hover:brightness-105"
              >
                Solicitar Orçamento de Natal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import type { GridSelection, NodeSelection, RangeSelection } from 'lexical';

import { $isAtNodeEnd as isAtNodeEnd } from '@lexical/selection';
import { $isRangeSelection as isRangeSelection, $isTextNode as isTextNode } from 'lexical';
import { useCallback } from 'react';
export * from './AutocompleteNode';
export * from './AutocompletePlugin.svelte';
export type SearchPromise = {
	dismiss: () => void;
	promise: Promise<null | string[]>;
};

export const uuid = Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, '')
	.substr(0, 5);

export const SELECTED_CLASSNAME = 'auto_selected';

// TODO lookup should be custom
export function search(
	selection: null | RangeSelection | NodeSelection | GridSelection
): [boolean, string] {
	if (!isRangeSelection(selection) || !selection.isCollapsed()) {
		return [false, ''];
	}
	const node = selection.getNodes()[0];
	const anchor = selection.anchor;
	// Check siblings?
	if (!isTextNode(node) || !node.isSimpleText() || !isAtNodeEnd(anchor)) {
		return [false, ''];
	}
	const word = [];
	const text = node.getTextContent();
	let i = node.getTextContentSize();
	let c;
	while (i-- && i >= 0 && (c = text[i]) !== ' ') {
		word.push(c);
	}
	if (word.length === 0) {
		return [false, ''];
	}
	return [true, word.reverse().join('')];
}

export class Suggestions {
	suggest = $state('');
}

// TODO query should be custom
export function useQuery(): (searchText: string) => SearchPromise {
	return useCallback((searchText: string) => {
		const server = new AutocompleteServer();
		console.time('query');
		const response = server.query(searchText);
		console.timeEnd('query');
		return response;
	}, []);
}

/*
 * Simulate an asynchronous autocomplete server (typical in more common use cases like GMail where
 * the data is not static).
 */
class AutocompleteServer {
	DATABASE = DICTIONARY;
	LATENCY = 200;

	query = (searchText: string): SearchPromise => {
		let isDismissed = false;

		const dismiss = () => {
			isDismissed = true;
		};
		const promise: Promise<null | string[]> = new Promise((resolve, reject) => {
			setTimeout(() => {
				if (isDismissed) {
					// TODO cache result
					return reject('Dismissed');
				}
				const searchTextLength = searchText.length;
				if (searchText === '' || searchTextLength < 4) {
					return resolve(null);
				}
				const char0 = searchText.charCodeAt(0);
				const isCapitalized = char0 >= 65 && char0 <= 90;
				const caseInsensitiveSearchText = isCapitalized
					? String.fromCharCode(char0 + 32) + searchText.substring(1)
					: searchText;
				const match = this.DATABASE.find(
					(dictionaryWord) => dictionaryWord.startsWith(caseInsensitiveSearchText) ?? null
				);
				if (match === undefined) {
					return resolve(null);
				}
				const matchCapitalized = isCapitalized
					? String.fromCharCode(match.charCodeAt(0) - 32) + match.substring(1)
					: match;
				const autocompleteChunk = ['hello', 'how are u'];
				if (autocompleteChunk.length == 0) {
					return resolve(null);
				}
				return resolve(autocompleteChunk);
			}, this.LATENCY);
		});

		return {
			dismiss,
			promise
		};
	};
}

// https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-long.txt
const DICTIONARY = [
	'information',
	'available',
	'copyright',
	'university',
	'management',
	'international',
	'development',
	'education',
	'community',
	'technology',
	'following',
	'resources',
	'including',
	'directory',
	'government',
	'department',
	'description',
	'insurance',
	'different',
	'categories',
	'conditions',
	'accessories',
	'september',
	'questions',
	'application',
	'financial',
	'equipment',
	'performance',
	'experience',
	'important',
	'activities',
	'additional',
	'something',
	'professional',
	'committee',
	'washington',
	'california',
	'reference',
	'companies',
	'computers',
	'president',
	'australia',
	'discussion',
	'entertainment',
	'agreement',
	'marketing',
	'association',
	'collection',
	'solutions',
	'electronics',
	'technical',
	'microsoft',
	'conference',
	'environment',
	'statement',
	'downloads',
	'applications',
	'requirements',
	'individual',
	'subscribe',
	'everything',
	'production',
	'commercial',
	'advertising',
	'treatment',
	'newsletter',
	'knowledge',
	'currently',
	'construction',
	'registered',
	'protection',
	'engineering',
	'published',
	'corporate',
	'customers',
	'materials',
	'countries',
	'standards',
	'political',
	'advertise',
	'environmental',
	'availability',
	'employment',
	'commission',
	'administration',
	'institute',
	'sponsored',
	'electronic',
	'condition',
	'effective',
	'organization',
	'selection',
	'corporation',
	'executive',
	'necessary',
	'according',
	'particular',
	'facilities',
	'opportunities',
	'appropriate',
	'statistics',
	'investment',
	'christmas',
	'registration',
	'furniture',
	'wednesday',
	'structure',
	'distribution',
	'industrial',
	'potential',
	'responsible',
	'communications',
	'associated',
	'foundation',
	'documents',
	'communication',
	'independent',
	'operating',
	'developed',
	'telephone',
	'population',
	'navigation',
	'operations',
	'therefore',
	'christian',
	'understand',
	'publications',
	'worldwide',
	'connection',
	'publisher',
	'introduction',
	'properties',
	'accommodation',
	'excellent',
	'opportunity',
	'assessment',
	'especially',
	'interface',
	'operation',
	'restaurants',
	'beautiful',
	'locations',
	'significant',
	'technologies',
	'manufacturer',
	'providing',
	'authority',
	'considered',
	'programme',
	'enterprise',
	'educational',
	'employees',
	'alternative',
	'processing',
	'responsibility',
	'resolution',
	'publication',
	'relations',
	'photography',
	'components',
	'assistance',
	'completed',
	'organizations',
	'otherwise',
	'transportation',
	'disclaimer',
	'membership',
	'recommended',
	'background',
	'character',
	'maintenance',
	'functions',
	'trademarks',
	'phentermine',
	'submitted',
	'television',
	'interested',
	'throughout',
	'established',
	'programming',
	'regarding',
	'instructions',
	'increased',
	'understanding',
	'beginning',
	'associates',
	'instruments',
	'businesses',
	'specified',
	'restaurant',
	'procedures',
	'relationship',
	'traditional',
	'sometimes',
	'themselves',
	'transport',
	'interesting',
	'evaluation',
	'implementation',
	'galleries',
	'references',
	'presented',
	'literature',
	'respective',
	'definition',
	'secretary',
	'networking',
	'australian',
	'magazines',
	'francisco',
	'individuals',
	'guidelines',
	'installation',
	'described',
	'attention',
	'difference',
	'regulations',
	'certificate',
	'directions',
	'documentation',
	'automotive',
	'successful',
	'communities',
	'situation',
	'publishing',
	'emergency',
	'developing',
	'determine',
	'temperature',
	'announcements',
	'historical',
	'ringtones',
	'difficult',
	'scientific',
	'satellite',
	'particularly',
	'functional',
	'monitoring',
	'architecture',
	'recommend',
	'dictionary',
	'accounting',
	'manufacturing',
	'professor',
	'generally',
	'continued',
	'techniques',
	'permission',
	'generation',
	'component',
	'guarantee',
	'processes',
	'interests',
	'paperback',
	'classifieds',
	'supported',
	'competition',
	'providers',
	'characters',
	'thousands',
	'apartments',
	'generated',
	'administrative',
	'practices',
	'reporting',
	'essential',
	'affiliate',
	'immediately',
	'designated',
	'integrated',
	'configuration',
	'comprehensive',
	'universal',
	'presentation',
	'languages',
	'compliance',
	'improvement',
	'pennsylvania',
	'challenge',
	'acceptance',
	'strategies',
	'affiliates',
	'multimedia',
	'certified',
	'computing',
	'interactive',
	'procedure',
	'leadership',
	'religious',
	'breakfast',
	'developer',
	'approximately',
	'recommendations',
	'comparison',
	'automatically',
	'minnesota',
	'adventure',
	'institutions',
	'assistant',
	'advertisement',
	'headlines',
	'yesterday',
	'determined',
	'wholesale',
	'extension',
	'statements',
	'completely',
	'electrical',
	'applicable',
	'manufacturers',
	'classical',
	'dedicated',
	'direction',
	'basketball',
	'wisconsin',
	'personnel',
	'identified',
	'professionals',
	'advantage',
	'newsletters',
	'estimated',
	'anonymous',
	'miscellaneous',
	'integration',
	'interview',
	'framework',
	'installed',
	'massachusetts',
	'associate',
	'frequently',
	'discussions',
	'laboratory',
	'destination',
	'intelligence',
	'specifications',
	'tripadvisor',
	'residential',
	'decisions',
	'industries',
	'partnership',
	'editorial',
	'expression',
	'provisions',
	'principles',
	'suggestions',
	'replacement',
	'strategic',
	'economics',
	'compatible',
	'apartment',
	'netherlands',
	'consulting',
	'recreation',
	'participants',
	'favorites',
	'translation',
	'estimates',
	'protected',
	'philadelphia',
	'officials',
	'contained',
	'legislation',
	'parameters',
	'relationships',
	'tennessee',
	'representative',
	'frequency',
	'introduced',
	'departments',
	'residents',
	'displayed',
	'performed',
	'administrator',
	'addresses',
	'permanent',
	'agriculture',
	'constitutes',
	'portfolio',
	'practical',
	'delivered',
	'collectibles',
	'infrastructure',
	'exclusive',
	'originally',
	'utilities',
	'philosophy',
	'regulation',
	'reduction',
	'nutrition',
	'recording',
	'secondary',
	'wonderful',
	'announced',
	'prevention',
	'mentioned',
	'automatic',
	'healthcare',
	'maintained',
	'increasing',
	'connected',
	'directors',
	'participation',
	'containing',
	'combination',
	'amendment',
	'guaranteed',
	'libraries',
	'distributed',
	'singapore',
	'enterprises',
	'convention',
	'principal',
	'certification',
	'previously',
	'buildings',
	'household',
	'batteries',
	'positions',
	'subscription',
	'contemporary',
	'panasonic',
	'permalink',
	'signature',
	'provision',
	'certainly',
	'newspaper',
	'liability',
	'trademark',
	'trackback',
	'americans',
	'promotion',
	'conversion',
	'reasonable',
	'broadband',
	'influence',
	'importance',
	'webmaster',
	'prescription',
	'specifically',
	'represent',
	'conservation',
	'louisiana',
	'javascript',
	'marketplace',
	'evolution',
	'certificates',
	'objectives',
	'suggested',
	'concerned',
	'structures',
	'encyclopedia',
	'continuing',
	'interracial',
	'competitive',
	'suppliers',
	'preparation',
	'receiving',
	'accordance',
	'discussed',
	'elizabeth',
	'reservations',
	'playstation',
	'instruction',
	'annotation',
	'differences',
	'establish',
	'expressed',
	'paragraph',
	'mathematics',
	'compensation',
	'conducted',
	'percentage',
	'mississippi',
	'requested',
	'connecticut',
	'personals',
	'immediate',
	'agricultural',
	'supporting',
	'collections',
	'participate',
	'specialist',
	'experienced',
	'investigation',
	'institution',
	'searching',
	'proceedings',
	'transmission',
	'characteristics',
	'experiences',
	'extremely',
	'verzeichnis',
	'contracts',
	'concerning',
	'developers',
	'equivalent',
	'chemistry',
	'neighborhood',
	'variables',
	'continues',
	'curriculum',
	'psychology',
	'responses',
	'circumstances',
	'identification',
	'appliances',
	'elementary',
	'unlimited',
	'printable',
	'enforcement',
	'hardcover',
	'celebrity',
	'chocolate',
	'hampshire',
	'bluetooth',
	'controlled',
	'requirement',
	'authorities',
	'representatives',
	'pregnancy',
	'biography',
	'attractions',
	'transactions',
	'authorized',
	'retirement',
	'financing',
	'efficiency',
	'efficient',
	'commitment',
	'specialty',
	'interviews',
	'qualified',
	'discovery',
	'classified',
	'confidence',
	'lifestyle',
	'consistent',
	'clearance',
	'connections',
	'inventory',
	'converter',
	'organisation',
	'objective',
	'indicated',
	'securities',
	'volunteer',
	'democratic',
	'switzerland',
	'parameter',
	'processor',
	'dimensions',
	'contribute',
	'challenges',
	'recognition',
	'submission',
	'encourage',
	'regulatory',
	'inspection',
	'consumers',
	'territory',
	'transaction',
	'manchester',
	'contributions',
	'continuous',
	'resulting',
	'cambridge',
	'initiative',
	'execution',
	'disability',
	'increases',
	'contractor',
	'examination',
	'indicates',
	'committed',
	'extensive',
	'affordable',
	'candidate',
	'databases',
	'outstanding',
	'perspective',
	'messenger',
	'tournament',
	'consideration',
	'discounts',
	'catalogue',
	'publishers',
	'caribbean',
	'reservation',
	'remaining',
	'depending',
	'expansion',
	'purchased',
	'performing',
	'collected',
	'absolutely',
	'featuring',
	'implement',
	'scheduled',
	'calculator',
	'significantly',
	'temporary',
	'sufficient',
	'awareness',
	'vancouver',
	'contribution',
	'measurement',
	'constitution',
	'packaging',
	'consultation',
	'northwest',
	'classroom',
	'democracy',
	'wallpaper',
	'merchandise',
	'resistance',
	'baltimore',
	'candidates',
	'charlotte',
	'biological',
	'transition',
	'preferences',
	'instrument',
	'classification',
	'physician',
	'hollywood',
	'wikipedia',
	'spiritual',
	'photographs',
	'relatively',
	'satisfaction',
	'represents',
	'pittsburgh',
	'preferred',
	'intellectual',
	'comfortable',
	'interaction',
	'listening',
	'effectively',
	'experimental',
	'revolution',
	'consolidation',
	'landscape',
	'dependent',
	'mechanical',
	'consultants',
	'applicant',
	'cooperation',
	'acquisition',
	'implemented',
	'directories',
	'recognized',
	'notification',
	'licensing',
	'textbooks',
	'diversity',
	'cleveland',
	'investments',
	'accessibility',
	'sensitive',
	'templates',
	'completion',
	'universities',
	'technique',
	'contractors',
	'subscriptions',
	'calculate',
	'alexander',
	'broadcast',
	'converted',
	'anniversary',
	'improvements',
	'specification',
	'accessible',
	'accessory',
	'typically',
	'representation',
	'arrangements',
	'conferences',
	'uniprotkb',
	'consumption',
	'birmingham',
	'afternoon',
	'consultant',
	'controller',
	'ownership',
	'committees',
	'legislative',
	'researchers',
	'unsubscribe',
	'molecular',
	'residence',
	'attorneys',
	'operators',
	'sustainable',
	'philippines',
	'statistical',
	'innovation',
	'employers',
	'definitions',
	'elections',
	'stainless',
	'newspapers',
	'hospitals',
	'exception',
	'successfully',
	'indonesia',
	'primarily',
	'capabilities',
	'recommendation',
	'recruitment',
	'organized',
	'improving',
	'expensive',
	'organisations',
	'explained',
	'programmes',
	'expertise',
	'mechanism',
	'jewellery',
	'eventually',
	'agreements',
	'considering',
	'innovative',
	'conclusion',
	'disorders',
	'collaboration',
	'detection',
	'formation',
	'engineers',
	'proposals',
	'moderator',
	'tutorials',
	'settlement',
	'collectables',
	'fantastic',
	'governments',
	'purchasing',
	'appointed',
	'operational',
	'corresponding',
	'descriptions',
	'determination',
	'animation',
	'productions',
	'telecommunications',
	'instructor',
	'approaches',
	'highlights',
	'designers',
	'melbourne',
	'scientists',
	'blackjack',
	'argentina',
	'possibility',
	'commissioner',
	'dangerous',
	'reliability',
	'unfortunately',
	'respectively',
	'volunteers',
	'attachment',
	'appointment',
	'workshops',
	'hurricane',
	'represented',
	'mortgages',
	'responsibilities',
	'carefully',
	'productivity',
	'investors',
	'underground',
	'diagnosis',
	'principle',
	'vacations',
	'calculated',
	'appearance',
	'incorporated',
	'notebooks',
	'algorithm',
	'valentine',
	'involving',
	'investing',
	'christopher',
	'admission',
	'terrorism',
	'parliament',
	'situations',
	'allocated',
	'corrections',
	'structural',
	'municipal',
	'describes',
	'disabilities',
	'substance',
	'prohibited',
	'addressed',
	'simulation',
	'initiatives',
	'concentration',
	'interpretation',
	'bankruptcy',
	'optimization',
	'substances',
	'discovered',
	'restrictions',
	'participating',
	'exhibition',
	'composition',
	'nationwide',
	'definitely',
	'existence',
	'commentary',
	'limousines',
	'developments',
	'immigration',
	'destinations',
	'necessarily',
	'attribute',
	'apparently',
	'surrounding',
	'mountains',
	'popularity',
	'postposted',
	'coordinator',
	'obviously',
	'fundamental',
	'substantial',
	'progressive',
	'championship',
	'sacramento',
	'impossible',
	'depression',
	'testimonials',
	'memorabilia',
	'cartridge',
	'explanation',
	'cincinnati',
	'subsection',
	'electricity',
	'permitted',
	'workplace',
	'confirmed',
	'wallpapers',
	'infection',
	'eligibility',
	'involvement',
	'placement',
	'observations',
	'vbulletin',
	'subsequent',
	'motorcycle',
	'disclosure',
	'establishment',
	'presentations',
	'undergraduate',
	'occupation',
	'donations',
	'associations',
	'citysearch',
	'radiation',
	'seriously',
	'elsewhere',
	'pollution',
	'conservative',
	'guestbook',
	'effectiveness',
	'demonstrate',
	'atmosphere',
	'experiment',
	'purchases',
	'federation',
	'assignment',
	'chemicals',
	'everybody',
	'nashville',
	'counseling',
	'acceptable',
	'satisfied',
	'measurements',
	'milwaukee',
	'medication',
	'warehouse',
	'shareware',
	'violation',
	'configure',
	'stability',
	'southwest',
	'institutional',
	'expectations',
	'independence',
	'metabolism',
	'personally',
	'excellence',
	'somewhere',
	'attributes',
	'recognize',
	'screening',
	'thumbnail',
	'forgotten',
	'intelligent',
	'edinburgh',
	'obligation',
	'regardless',
	'restricted',
	'republican',
	'merchants',
	'attendance',
	'arguments',
	'amsterdam',
	'adventures',
	'announcement',
	'appreciate',
	'regularly',
	'mechanisms',
	'customize',
	'tradition',
	'indicators',
	'emissions',
	'physicians',
	'complaint',
	'experiments',
	'afghanistan',
	'scholarship',
	'governance',
	'supplements',
	'camcorder',
	'implementing',
	'ourselves',
	'conversation',
	'capability',
	'producing',
	'precision',
	'contributed',
	'reproduction',
	'ingredients',
	'franchise',
	'complaints',
	'promotions',
	'rehabilitation',
	'maintaining',
	'environments',
	'reception',
	'correctly',
	'consequences',
	'geography',
	'appearing',
	'integrity',
	'discrimination',
	'processed',
	'implications',
	'functionality',
	'intermediate',
	'emotional',
	'platforms',
	'overnight',
	'geographic',
	'preliminary',
	'districts',
	'introduce',
	'promotional',
	'chevrolet',
	'specialists',
	'generator',
	'suspension',
	'correction',
	'authentication',
	'communicate',
	'supplement',
	'showtimes',
	'promoting',
	'machinery',
	'bandwidth',
	'probability',
	'dimension',
	'schedules',
	'admissions',
	'quarterly',
	'illustrated',
	'continental',
	'alternate',
	'achievement',
	'limitations',
	'automated',
	'passenger',
	'convenient',
	'orientation',
	'childhood',
	'flexibility',
	'jurisdiction',
	'displaying',
	'encouraged',
	'cartridges',
	'declaration',
	'automation',
	'advantages',
	'preparing',
	'recipient',
	'extensions',
	'athletics',
	'southeast',
	'alternatives',
	'determining',
	'personalized',
	'conditioning',
	'partnerships',
	'destruction',
	'increasingly',
	'migration',
	'basically',
	'conventional',
	'applicants',
	'occupational',
	'adjustment',
	'treatments',
	'camcorders',
	'difficulty',
	'collective',
	'coalition',
	'enrollment',
	'producers',
	'collector',
	'interfaces',
	'advertisers',
	'representing',
	'observation',
	'restoration',
	'convenience',
	'returning',
	'opposition',
	'container',
	'defendant',
	'confirmation',
	'supervisor',
	'peripherals',
	'bestsellers',
	'departure',
	'minneapolis',
	'interactions',
	'intervention',
	'attraction',
	'modification',
	'customized',
	'understood',
	'assurance',
	'happening',
	'amendments',
	'metropolitan',
	'compilation',
	'verification',
	'attractive',
	'recordings',
	'jefferson',
	'gardening',
	'obligations',
	'orchestra',
	'polyphonic',
	'outsourcing',
	'adjustable',
	'allocation',
	'discipline',
	'demonstrated',
	'identifying',
	'alphabetical',
	'dispatched',
	'installing',
	'voluntary',
	'photographer',
	'messaging',
	'constructed',
	'additions',
	'requiring',
	'engagement',
	'refinance',
	'calendars',
	'arrangement',
	'conclusions',
	'bibliography',
	'compatibility',
	'furthermore',
	'cooperative',
	'measuring',
	'jacksonville',
	'headquarters',
	'transfers',
	'transformation',
	'attachments',
	'administrators',
	'personality',
	'facilitate',
	'subscriber',
	'priorities',
	'bookstore',
	'parenting',
	'incredible',
	'commonwealth',
	'pharmaceutical',
	'manhattan',
	'workforce',
	'organizational',
	'portuguese',
	'everywhere',
	'discharge',
	'halloween',
	'hazardous',
	'methodology',
	'housewares',
	'reputation',
	'resistant',
	'democrats',
	'recycling',
	'qualifications',
	'slideshow',
	'variation',
	'transferred',
	'photograph',
	'distributor',
	'underlying',
	'wrestling',
	'photoshop',
	'gathering',
	'projection',
	'mathematical',
	'specialized',
	'diagnostic',
	'indianapolis',
	'corporations',
	'criticism',
	'automobile',
	'confidential',
	'statutory',
	'accommodations',
	'northeast',
	'downloaded',
	'paintings',
	'injection',
	'yorkshire',
	'populations',
	'protective',
	'initially',
	'indicator',
	'eliminate',
	'sunglasses',
	'preference',
	'threshold',
	'venezuela',
	'exploration',
	'sequences',
	'astronomy',
	'translate',
	'announces',
	'compression',
	'establishing',
	'constitutional',
	'perfectly',
	'instantly',
	'litigation',
	'submissions',
	'broadcasting',
	'horizontal',
	'terrorist',
	'informational',
	'ecommerce',
	'suffering',
	'prospective',
	'ultimately',
	'artificial',
	'spectacular',
	'coordination',
	'connector',
	'affiliated',
	'activation',
	'naturally',
	'subscribers',
	'mitsubishi',
	'underwear',
	'potentially',
	'constraints',
	'inclusive',
	'dimensional',
	'considerable',
	'selecting',
	'processors',
	'pantyhose',
	'difficulties',
	'complexity',
	'constantly',
	'barcelona',
	'presidential',
	'documentary',
	'territories',
	'palestinian',
	'legislature',
	'hospitality',
	'procurement',
	'theoretical',
	'exercises',
	'surveillance',
	'protocols',
	'highlight',
	'substitute',
	'inclusion',
	'hopefully',
	'brilliant',
	'evaluated',
	'assignments',
	'termination',
	'households',
	'authentic',
	'montgomery',
	'architectural',
	'louisville',
	'macintosh',
	'movements',
	'amenities',
	'virtually',
	'authorization',
	'projector',
	'comparative',
	'psychological',
	'surprised',
	'genealogy',
	'expenditure',
	'liverpool',
	'connectivity',
	'algorithms',
	'similarly',
	'collaborative',
	'excluding',
	'commander',
	'suggestion',
	'spotlight',
	'investigate',
	'connecting',
	'logistics',
	'proportion',
	'significance',
	'symposium',
	'essentials',
	'protecting',
	'transmitted',
	'screenshots',
	'intensive',
	'switching',
	'correspondence',
	'supervision',
	'expenditures',
	'separation',
	'testimony',
	'celebrities',
	'mandatory',
	'boundaries',
	'syndication',
	'celebration',
	'filtering',
	'luxembourg',
	'offensive',
	'deployment',
	'colleagues',
	'separated',
	'directive',
	'governing',
	'retailers',
	'occasionally',
	'attending',
	'recruiting',
	'instructional',
	'traveling',
	'permissions',
	'biotechnology',
	'prescribed',
	'catherine',
	'reproduced',
	'calculation',
	'consolidated',
	'occasions',
	'equations',
	'exceptional',
	'respondents',
	'considerations',
	'queensland',
	'musicians',
	'composite',
	'unavailable',
	'essentially',
	'designing',
	'assessments',
	'brunswick',
	'sensitivity',
	'preservation',
	'streaming',
	'intensity',
	'technological',
	'syndicate',
	'antivirus',
	'addressing',
	'discounted',
	'bangladesh',
	'constitute',
	'concluded',
	'desperate',
	'demonstration',
	'governmental',
	'manufactured',
	'graduation',
	'variations',
	'addiction',
	'springfield',
	'synthesis',
	'undefined',
	'unemployment',
	'enhancement',
	'newcastle',
	'performances',
	'societies',
	'brazilian',
	'identical',
	'petroleum',
	'norwegian',
	'retention',
	'exchanges',
	'soundtrack',
	'wondering',
	'profession',
	'separately',
	'physiology',
	'collecting',
	'participant',
	'scholarships',
	'recreational',
	'dominican',
	'friendship',
	'expanding',
	'provincial',
	'investigations',
	'medications',
	'rochester',
	'advertiser',
	'encryption',
	'downloadable',
	'sophisticated',
	'possession',
	'laboratories',
	'vegetables',
	'thumbnails',
	'stockings',
	'respondent',
	'destroyed',
	'manufacture',
	'wordpress',
	'vulnerability',
	'accountability',
	'celebrate',
	'accredited',
	'appliance',
	'compressed',
	'scheduling',
	'perspectives',
	'mortality',
	'christians',
	'therapeutic',
	'impressive',
	'accordingly',
	'architect',
	'challenging',
	'microwave',
	'accidents',
	'relocation',
	'contributors',
	'violations',
	'temperatures',
	'competitions',
	'discretion',
	'cosmetics',
	'repository',
	'concentrations',
	'christianity',
	'negotiations',
	'realistic',
	'generating',
	'christina',
	'congressional',
	'photographic',
	'modifications',
	'millennium',
	'achieving',
	'fisheries',
	'exceptions',
	'reactions',
	'macromedia',
	'companion',
	'divisions',
	'additionally',
	'fellowship',
	'victorian',
	'copyrights',
	'lithuania',
	'mastercard',
	'chronicles',
	'obtaining',
	'distribute',
	'decorative',
	'enlargement',
	'campaigns',
	'conjunction',
	'instances',
	'indigenous',
	'validation',
	'corruption',
	'incentives',
	'cholesterol',
	'differential',
	'scientist',
	'starsmerchant',
	'arthritis',
	'nevertheless',
	'practitioners',
	'transcript',
	'inflation',
	'compounds',
	'contracting',
	'structured',
	'reasonably',
	'graduates',
	'recommends',
	'controlling',
	'distributors',
	'arlington',
	'particles',
	'extraordinary',
	'indicating',
	'coordinate',
	'exclusively',
	'limitation',
	'widescreen',
	'illustration',
	'construct',
	'inquiries',
	'inspiration',
	'affecting',
	'downloading',
	'aggregate',
	'forecasts',
	'complicated',
	'shopzilla',
	'decorating',
	'expressions',
	'shakespeare',
	'connectors',
	'conflicts',
	'travelers',
	'offerings',
	'incorrect',
	'furnishings',
	'guatemala',
	'perception',
	'renaissance',
	'pathology',
	'ordinance',
	'photographers',
	'infections',
	'configured',
	'festivals',
	'possibilities',
	'contributing',
	'analytical',
	'circulation',
	'assumption',
	'jerusalem',
	'transexuales',
	'invention',
	'technician',
	'executives',
	'enquiries',
	'cognitive',
	'exploring',
	'registrar',
	'supporters',
	'withdrawal',
	'predicted',
	'saskatchewan',
	'cancellation',
	'ministers',
	'veterinary',
	'prostores',
	'relevance',
	'incentive',
	'butterfly',
	'mechanics',
	'numerical',
	'reflection',
	'accompanied',
	'invitation',
	'princeton',
	'spirituality',
	'meanwhile',
	'proprietary',
	'childrens',
	'thumbzilla',
	'porcelain',
	'pichunter',
	'translated',
	'columnists',
	'consensus',
	'delivering',
	'journalism',
	'intention',
	'undertaken',
	'statewide',
	'semiconductor',
	'illustrations',
	'happiness',
	'substantially',
	'identifier',
	'calculations',
	'conducting',
	'accomplished',
	'calculators',
	'impression',
	'correlation',
	'fragrance',
	'neighbors',
	'transparent',
	'charleston',
	'champions',
	'selections',
	'projectors',
	'inappropriate',
	'comparing',
	'vocational',
	'pharmacies',
	'introducing',
	'appreciated',
	'albuquerque',
	'distinguished',
	'projected',
	'assumptions',
	'shareholders',
	'developmental',
	'regulated',
	'anticipated',
	'completing',
	'comparable',
	'confusion',
	'copyrighted',
	'warranties',
	'documented',
	'paperbacks',
	'keyboards',
	'vulnerable',
	'reflected',
	'respiratory',
	'notifications',
	'transexual',
	'mainstream',
	'evaluating',
	'subcommittee',
	'maternity',
	'journalists',
	'foundations',
	'volleyball',
	'liabilities',
	'decreased',
	'tolerance',
	'creativity',
	'describing',
	'lightning',
	'quotations',
	'inspector',
	'bookmarks',
	'behavioral',
	'riverside',
	'bathrooms',
	'abilities',
	'initiated',
	'nonprofit',
	'lancaster',
	'suspended',
	'containers',
	'attitudes',
	'simultaneously',
	'integrate',
	'sociology',
	'screenshot',
	'exhibitions',
	'confident',
	'retrieved',
	'officially',
	'consortium',
	'recipients',
	'delicious',
	'traditions',
	'periodically',
	'hungarian',
	'referring',
	'transform',
	'educators',
	'vegetable',
	'humanities',
	'independently',
	'alignment',
	'henderson',
	'britannica',
	'competitors',
	'visibility',
	'consciousness',
	'encounter',
	'resolutions',
	'accessing',
	'attempted',
	'witnesses',
	'administered',
	'strengthen',
	'frederick',
	'aggressive',
	'advertisements',
	'sublimedirectory',
	'disturbed',
	'determines',
	'sculpture',
	'motivation',
	'pharmacology',
	'passengers',
	'quantities',
	'petersburg',
	'consistently',
	'powerpoint',
	'obituaries',
	'punishment',
	'appreciation',
	'subsequently',
	'providence',
	'restriction',
	'incorporate',
	'backgrounds',
	'treasurer',
	'lightweight',
	'transcription',
	'complications',
	'scripting',
	'remembered',
	'synthetic',
	'testament',
	'specifics',
	'partially',
	'wilderness',
	'generations',
	'tournaments',
	'sponsorship',
	'headphones',
	'proceeding',
	'volkswagen',
	'uncertainty',
	'breakdown',
	'reconstruction',
	'subsidiary',
	'strengths',
	'encouraging',
	'furnished',
	'terrorists',
	'comparisons',
	'beneficial',
	'distributions',
	'viewpicture',
	'threatened',
	'republicans',
	'discusses',
	'responded',
	'abstracts',
	'prediction',
	'pharmaceuticals',
	'thesaurus',
	'individually',
	'battlefield',
	'literally',
	'ecological',
	'appraisal',
	'consisting',
	'submitting',
	'citations',
	'geographical',
	'mozambique',
	'disclaimers',
	'championships',
	'sheffield',
	'finishing',
	'wellington',
	'prospects',
	'bulgarian',
	'aboriginal',
	'remarkable',
	'preventing',
	'productive',
	'boulevard',
	'compliant',
	'penalties',
	'imagination',
	'refurbished',
	'activated',
	'conferencing',
	'armstrong',
	'politicians',
	'trackbacks',
	'accommodate',
	'christine',
	'accepting',
	'precipitation',
	'isolation',
	'sustained',
	'approximate',
	'programmer',
	'greetings',
	'inherited',
	'incomplete',
	'chronicle',
	'legitimate',
	'biographies',
	'investigator',
	'plaintiff',
	'prisoners',
	'mediterranean',
	'nightlife',
	'architects',
	'entrepreneur',
	'freelance',
	'excessive',
	'screensaver',
	'valuation',
	'unexpected',
	'cigarette',
	'characteristic',
	'metallica',
	'consequently',
	'appointments',
	'narrative',
	'academics',
	'quantitative',
	'screensavers',
	'subdivision',
	'distinction',
	'livestock',
	'exemption',
	'sustainability',
	'formatting',
	'nutritional',
	'nicaragua',
	'affiliation',
	'relatives',
	'satisfactory',
	'revolutionary',
	'bracelets',
	'telephony',
	'breathing',
	'thickness',
	'adjustments',
	'graphical',
	'discussing',
	'aerospace',
	'meaningful',
	'maintains',
	'shortcuts',
	'voyeurweb',
	'extending',
	'specifies',
	'accreditation',
	'blackberry',
	'meditation',
	'microphone',
	'macedonia',
	'combining',
	'instrumental',
	'organizing',
	'moderators',
	'kazakhstan',
	'standings',
	'partition',
	'invisible',
	'translations',
	'commodity',
	'kilometers',
	'thanksgiving',
	'guarantees',
	'indication',
	'congratulations',
	'cigarettes',
	'controllers',
	'consultancy',
	'conventions',
	'coordinates',
	'responding',
	'physically',
	'stakeholders',
	'hydrocodone',
	'consecutive',
	'attempting',
	'representations',
	'competing',
	'peninsula',
	'accurately',
	'considers',
	'ministries',
	'vacancies',
	'parliamentary',
	'acknowledge',
	'thoroughly',
	'nottingham',
	'identifies',
	'questionnaire',
	'qualification',
	'modelling',
	'miniature',
	'interstate',
	'consequence',
	'systematic',
	'perceived',
	'madagascar',
	'presenting',
	'troubleshooting',
	'uzbekistan',
	'centuries',
	'magnitude',
	'richardson',
	'fragrances',
	'vocabulary',
	'earthquake',
	'fundraising',
	'geological',
	'assessing',
	'introduces',
	'webmasters',
	'computational',
	'acdbentity',
	'participated',
	'handhelds',
	'answering',
	'impressed',
	'conspiracy',
	'organizer',
	'combinations',
	'preceding',
	'cumulative',
	'amplifier',
	'arbitrary',
	'prominent',
	'lexington',
	'contacted',
	'recorders',
	'occasional',
	'innovations',
	'postcards',
	'reviewing',
	'explicitly',
	'transsexual',
	'citizenship',
	'informative',
	'girlfriend',
	'bloomberg',
	'hierarchy',
	'influenced',
	'abandoned',
	'complement',
	'mauritius',
	'checklist',
	'requesting',
	'lauderdale',
	'scenarios',
	'extraction',
	'elevation',
	'utilization',
	'beverages',
	'calibration',
	'efficiently',
	'entertaining',
	'prerequisite',
	'hypothesis',
	'medicines',
	'regression',
	'enhancements',
	'renewable',
	'intersection',
	'passwords',
	'consistency',
	'collectors',
	'azerbaijan',
	'astrology',
	'occurring',
	'supplemental',
	'travelling',
	'induction',
	'precisely',
	'spreading',
	'provinces',
	'widespread',
	'incidence',
	'incidents',
	'enhancing',
	'interference',
	'palestine',
	'listprice',
	'atmospheric',
	'knowledgestorm',
	'referenced',
	'publicity',
	'proposition',
	'allowance',
	'designation',
	'duplicate',
	'criterion',
	'civilization',
	'vietnamese',
	'tremendous',
	'corrected',
	'encountered',
	'internationally',
	'surrounded',
	'creatures',
	'commented',
	'accomplish',
	'vegetarian',
	'newfoundland',
	'investigated',
	'ambassador',
	'stephanie',
	'contacting',
	'vegetation',
	'findarticles',
	'specially',
	'infectious',
	'continuity',
	'phenomenon',
	'conscious',
	'referrals',
	'differently',
	'integrating',
	'revisions',
	'reasoning',
	'charitable',
	'annotated',
	'convinced',
	'burlington',
	'replacing',
	'researcher',
	'watershed',
	'occupations',
	'acknowledged',
	'equilibrium',
	'characterized',
	'privilege',
	'qualifying',
	'estimation',
	'pediatric',
	'techrepublic',
	'institutes',
	'brochures',
	'traveller',
	'appropriations',
	'suspected',
	'benchmark',
	'beginners',
	'instructors',
	'highlighted',
	'stationery',
	'unauthorized',
	'competent',
	'contributor',
	'demonstrates',
	'gradually',
	'desirable',
	'journalist',
	'afterwards',
	'religions',
	'explosion',
	'signatures',
	'disciplines',
	'daughters',
	'conversations',
	'simplified',
	'motherboard',
	'bibliographic',
	'champagne',
	'deviation',
	'superintendent',
	'housewives',
	'influences',
	'inspections',
	'irrigation',
	'hydraulic',
	'robertson',
	'penetration',
	'conviction',
	'omissions',
	'retrieval',
	'qualities',
	'prototype',
	'importantly',
	'apparatus',
	'explaining',
	'nomination',
	'empirical',
	'dependence',
	'sexuality',
	'polyester',
	'commitments',
	'suggesting',
	'remainder',
	'privileges',
	'televisions',
	'specializing',
	'commodities',
	'motorcycles',
	'concentrate',
	'reproductive',
	'molecules',
	'refrigerator',
	'intervals',
	'sentences',
	'exclusion',
	'workstation',
	'holocaust',
	'receivers',
	'disposition',
	'navigator',
	'investigators',
	'marijuana',
	'cathedral',
	'fairfield',
	'fascinating',
	'landscapes',
	'lafayette',
	'computation',
	'cardiovascular',
	'salvation',
	'predictions',
	'accompanying',
	'selective',
	'arbitration',
	'configuring',
	'editorials',
	'sacrifice',
	'removable',
	'convergence',
	'gibraltar',
	'anthropology',
	'malpractice',
	'reporters',
	'necessity',
	'rendering',
	'hepatitis',
	'nationally',
	'waterproof',
	'specialties',
	'humanitarian',
	'invitations',
	'functioning',
	'economies',
	'alexandria',
	'bacterial',
	'undertake',
	'continuously',
	'achievements',
	'convertible',
	'secretariat',
	'paragraphs',
	'adolescent',
	'nominations',
	'cancelled',
	'introductory',
	'reservoir',
	'occurrence',
	'worcester',
	'demographic',
	'disciplinary',
	'respected',
	'portraits',
	'interpreted',
	'evaluations',
	'elimination',
	'hypothetical',
	'immigrants',
	'complimentary',
	'helicopter',
	'performer',
	'commissions',
	'powerseller',
	'graduated',
	'surprising',
	'unnecessary',
	'dramatically',
	'yugoslavia',
	'characterization',
	'likelihood',
	'fundamentals',
	'contamination',
	'endangered',
	'compromise',
	'expiration',
	'namespace',
	'peripheral',
	'negotiation',
	'opponents',
	'nominated',
	'confidentiality',
	'electoral',
	'changelog',
	'alternatively',
	'greensboro',
	'controversial',
	'recovered',
	'upgrading',
	'frontpage',
	'demanding',
	'defensive',
	'forbidden',
	'programmers',
	'monitored',
	'installations',
	'deutschland',
	'practitioner',
	'motivated',
	'smithsonian',
	'examining',
	'revelation',
	'delegation',
	'dictionaries',
	'greenhouse',
	'transparency',
	'currencies',
	'survivors',
	'positioning',
	'descending',
	'temporarily',
	'frequencies',
	'reflections',
	'municipality',
	'detective',
	'experiencing',
	'fireplace',
	'endorsement',
	'psychiatry',
	'persistent',
	'summaries',
	'looksmart',
	'magnificent',
	'colleague',
	'adaptation',
	'paintball',
	'enclosure',
	'supervisors',
	'westminster',
	'distances',
	'absorption',
	'treasures',
	'transcripts',
	'disappointed',
	'continually',
	'communist',
	'collectible',
	'entrepreneurs',
	'creations',
	'acquisitions',
	'biodiversity',
	'excitement',
	'presently',
	'mysterious',
	'librarian',
	'subsidiaries',
	'stockholm',
	'indonesian',
	'therapist',
	'promising',
	'relaxation',
	'thereafter',
	'commissioners',
	'forwarding',
	'nightmare',
	'reductions',
	'southampton',
	'organisms',
	'telescope',
	'portsmouth',
	'advancement',
	'harassment',
	'generators',
	'generates',
	'replication',
	'inexpensive',
	'receptors',
	'interventions',
	'huntington',
	'internship',
	'aluminium',
	'snowboard',
	'beastality',
	'evanescence',
	'coordinated',
	'shipments',
	'antarctica',
	'chancellor',
	'controversy',
	'legendary',
	'beautifully',
	'antibodies',
	'examinations',
	'immunology',
	'departmental',
	'terminology',
	'gentleman',
	'reproduce',
	'convicted',
	'roommates',
	'threatening',
	'spokesman',
	'activists',
	'frankfurt',
	'encourages',
	'assembled',
	'restructuring',
	'terminals',
	'simulations',
	'sufficiently',
	'conditional',
	'crossword',
	'conceptual',
	'liechtenstein',
	'translator',
	'automobiles',
	'continent',
	'longitude',
	'challenged',
	'telecharger',
	'insertion',
	'instrumentation',
	'constraint',
	'groundwater',
	'strengthening',
	'insulation',
	'infringement',
	'subjective',
	'swaziland',
	'varieties',
	'mediawiki',
	'configurations'
];

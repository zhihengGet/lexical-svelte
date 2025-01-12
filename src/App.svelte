<script lang="ts">
	let { ...props } = $props();
	import './app.css';
	import 'uno.css';
	let EditorInstance: any = $state();
	$effect(() => {
		import('./Temp.svelte').then((v) => {
			EditorInstance = v.default;
		});
	});
	const dd = `
    <p data-chapter-comment-id='\"84d4f75d-cd55-4b5c-b537-5ae481e5c58d\"'>
	And so, after a time, I came to the mountains. Then, the course of my\njourney was altered, and I began to move along their bases, until, all\nat once, I saw that I had come opposite to a vast rift, opening into the\nmountains. Through this, I was borne, moving at no great speed. On\neither side of me, huge, scarped walls of rocklike substance rose sheer.\nFar overhead, I discerned a thin ribbon of red, where the mouth of the\nchasm opened, among inaccessible peaks. Within, was gloom, deep and\nsomber, and chilly silence. For a while, I went onward steadily, and\nthen, at last, I saw, ahead, a deep, red glow, that told me I was near\nupon the further opening of the gorge.</p>

    <p data-chapter-comment-id='\"82f72bca-cb2b-4f7f-905b-4f9743edffac\"'>A minute came and went, and I was at the exit of the chasm, staring out\nupon an enormous amphitheatre of mountains. Yet, of the mountains, and\nthe terrible grandeur of the place, I recked nothing; for I was\nconfounded with amazement to behold, at a distance of several miles and\noccupying the center of the arena, a stupendous structure built\napparently of green jade. Yet, in itself, it was not the discovery of\nthe building that had so astonished me; but the fact, which became every\nmoment more apparent, that in no particular, save in color and its\nenormous size, did the lonely structure vary from this house in which\nI live.</p>
	
    <p data-chapter-comment-id='\"22199b42-be43-417b-8bbc-42f95a1e9381\"'>For a while, I continued to stare, fixedly. Even then, I could scarcely\nbelieve that I saw aright. In my mind, a question formed, reiterating\nincessantly: 'What does it mean?' 'What does it mean?' and I was unable\nto make answer, even out of the depths of my imagination. I seemed\ncapable only of wonder and fear. For a time longer, I gazed, noting\ncontinually some fresh point of resemblance that attracted me. At last,\nwearied and sorely puzzled, I turned from it, to view the rest of the\nstrange place on to which I had intruded.
	</p>
    <p data-chapter-comment-id='\"b922a7e9-3073-4a4e-ab07-0a46ff354e99\"'>Hitherto, I had been so engrossed in my scrutiny of the House, that I\nhad given only a cursory glance 'round. Now, as I looked, I began to\nrealize upon what sort of a place I had come. The arena, for so I have\ntermed it, appeared a perfect circle of about ten to twelve miles in\ndiameter, the House, as I have mentioned before, standing in the center.\nThe surface of the place, like to that of the Plain, had a peculiar,\nmisty appearance, that was yet not mist.</p>
    <p data-chapter-comment-id='\"2c68a9f5-c572-4a10-8dcb-90691e717de7\"'>From a rapid survey, my glance passed quickly upward along the slopes\nof the circling mountains. How silent they were. I think that this same\nabominable stillness was more trying to me than anything that I had so\nfar seen or imagined. I was looking up, now, at the great crags,\ntowering so loftily. Up there, the impalpable redness gave a blurred\nappearance to everything.</p>
    <p data-chapter-comment-id='\"a72b0666-7526-4558-a502-a1d4dcbf3b6c\"'>And then, as I peered, curiously, a new terror came to me; for away up\namong the dim peaks to my right, I had descried a vast shape of\nblackness, giantlike. It grew upon my sight. It had an enormous equine\nhead, with gigantic ears, and seemed to peer steadfastly down into the\narena. There was that about the pose that gave me the impression of an\neternal watchfulness&mdash;of having warded that dismal place, through\nunknown eternities. Slowly, the monster became plainer to me; and then,\nsuddenly, my gaze sprang from it to something further off and higher\namong the crags. For a long minute, I gazed, fearfully. I was strangely\nconscious of something not altogether unfamiliar&mdash;as though something\nstirred in the back of my mind. The thing was black, and had four\ngrotesque arms. The features showed indistinctly, 'round the neck, I\nmade out several light-colored objects. Slowly, the details came to me,\nand I realized, coldly, that they were skulls. Further down the body was\nanother circling belt, showing less dark against the black trunk. Then,\neven as I puzzled to know what the thing was, a memory slid into my\nmind, and straightway, I knew that I was looking at a monstrous\nrepresentation of Kali, the Hindu goddess of death.</p>
    <p data-chapter-comment-id='\"1c483ab3-cf88-44d6-9a09-ab5af1932cc9\"'>Other remembrances of my old student days drifted into my thoughts. My\nglance fell back upon the huge beast-headed Thing. Simultaneously, I\nrecognized it for the ancient Egyptian god Set, or Seth, the Destroyer\nof Souls. With the knowledge, there came a great sweep of\nquestioning&mdash;'Two of the&mdash;!' I stopped, and endeavored to think. Things\nbeyond my imagination peered into my frightened mind. I saw, obscurely.\n'The old gods of mythology!' I tried to comprehend to what it was all\npointing. My gaze dwelt, flickeringly, between the two. 'If&mdash;'</p>
    <p data-chapter-comment-id='\"d55de7c7-a719-478c-a83e-9f2a8d04e733\"'>An idea came swiftly, and I turned, and glanced rapidly upward,\nsearching the gloomy crags, away to my left. Something loomed out under\na great peak, a shape of greyness. I wondered I had not seen it earlier,\nand then remembered I had not yet viewed that portion. I saw it more\nplainly now. It was, as I have said, grey. It had a tremendous head; but\nno eyes. That part of its face was blank.</p>
    <p data-chapter-comment-id='\"00af2ff5-8147-48c4-b93c-35b437a9bc3c\"'>Now, I saw that there were other things up among the mountains. Further\noff, reclining on a lofty ledge, I made out a livid mass, irregular and\nghoulish. It seemed without form, save for an unclean, half-animal face,\nthat looked out, vilely, from somewhere about its middle. And then I saw\nothers&mdash;there were hundreds of them. They seemed to grow out of the\nshadows. Several I recognized almost immediately as mythological\ndeities; others were strange to me, utterly strange, beyond the power of\na human mind to conceive.</p>
    <p data-chapter-comment-id='\"4b290623-24c7-451b-a7bf-bafada2da6ae\"'>On each side, I looked, and saw more, continually. The mountains were\nfull of strange things&mdash;Beast-gods, and Horrors so atrocious and bestial\nthat possibility and decency deny any further attempt to describe them.\nAnd I&mdash;I was filled with a terrible sense of overwhelming horror and\nfear and repugnance; yet, spite of these, I wondered exceedingly. Was\nthere then, after all, something in the old heathen worship, something\nmore than the mere deifying of men, animals, and elements? The thought\ngripped me&mdash;was there?</p>
    <p data-chapter-comment-id='\"84ecb083-295e-4a05-9278-db130640f3eb\"'>Later, a question repeated itself. What were they, those Beast-gods,\nand the others? At first, they had appeared to me just sculptured\nMonsters placed indiscriminately among the inaccessible peaks and\nprecipices of the surrounding mountains. Now, as I scrutinized them with\ngreater intentness, my mind began to reach out to fresh conclusions.\nThere was something about them, an indescribable sort of silent vitality\nthat suggested, to my broadening consciousness, a state of\nlife-in-death&mdash;a something that was by no means life, as we understand\nit; but rather an inhuman form of existence, that well might be likened\nto a deathless trance&mdash;a condition in which it was possible to imagine\ntheir continuing, eternally. 'Immortal!' the word rose in my thoughts\nunbidden; and, straightway, I grew to wondering whether this might be\nthe immortality of the gods.</p>
    <p data-chapter-comment-id='\"887c8e1f-d55a-485f-ab4e-9fa43eabbeb1\"'>And then, in the midst of my wondering and musing, something happened.\nUntil then, I had been staying just within the shadow of the exit of the\ngreat rift. Now, without volition on my part, I drifted out of the\nsemi-darkness and began to move slowly across the arena&mdash;toward the\nHouse. At this, I gave up all thoughts of those prodigious Shapes above\nme&mdash;and could only stare, frightenedly, at the tremendous structure\ntoward which I was being conveyed so remorselessly. Yet, though I\nsearched earnestly, I could discover nothing that I had not already\nseen, and so became gradually calmer.</p>
    <p data-chapter-comment-id='\"a03a51f1-bf01-48cd-abca-1acd3649f459\"'>Presently, I had reached a point more than halfway between the House\nand the gorge. All around was spread the stark loneliness of the place,\nand the unbroken silence. Steadily, I neared the great building. Then,\nall at once, something caught my vision, something that came 'round one\nof the huge buttresses of the House, and so into full view. It was a\ngigantic thing, and moved with a curious lope, going almost upright,\nafter the manner of a man. It was quite unclothed, and had a remarkable\nluminous appearance. Yet it was the face that attracted and frightened\nme the most. It was the face of a swine.</p>
    <p data-chapter-comment-id='\"b846c406-c58e-4705-acab-692133b162ca\"'>Silently, intently, I watched this horrible creature, and forgot my\nfear, momentarily, in my interest in its movements. It was making its\nway, cumbrously 'round the building, stopping as it came to each window\nto peer in and shake at the bars, with which&mdash;as in this house&mdash;they\nwere protected; and whenever it came to a door, it would push at it,\nfingering the fastening stealthily. Evidently, it was searching for an\ningress into the House.</p>

    <p data-chapter-comment-id='\"69d70be5-552f-4013-9565-f3ef11a25dc3\"'>
	I had come now to within less than a quarter of a mile of the great\nstructure, and still I was compelled forward. Abruptly, the Thing turned\nand gazed hideously in my direction. It opened its mouth, and, for the\nfirst time, the stillness of that abominable place was broken, by a\ndeep, booming note that sent an added thrill of apprehension through me.\nThen, immediately, I became aware that it was coming toward me, swiftly\nand silently. In an instant, it had covered half the distance that lay\nbetween. And still, I was borne helplessly to meet it. Only a hundred\nyards, and the brutish ferocity of the giant face numbed me with a\nfeeling of unmitigated horror. I could have screamed, in the supremeness\nof my fear; and then, in the very moment of my extremity and despair, I\nbecame conscious that I was looking down upon the arena, from a rapidly\nincreasing height. I was rising, rising. In an inconceivably short\nwhile, I had reached an altitude of many hundred feet. Beneath me, the\nspot that I had just left, was occupied by the foul Swine-creature. It\nhad gone down on all fours and was snuffing and rooting, like a\nveritable hog, at the surface of the arena. A moment and it rose to its\nfeet, clutching upward, with an expression of desire upon its face such\nas I have never seen in this world.
	
	</p>

    <p data-chapter-comment-id='\"3c4e8900-4dbb-4c81-ac5a-67ede95240d2\"'>Continually, I mounted higher. A few minutes, it seemed, and I had\nrisen above the great mountains&mdash;floating, alone, afar in the redness.\nAt a tremendous distance below, the arena showed, dimly; with the mighty\nHouse looking no larger than a tiny spot of green. The Swine-thing was\nno longer visible.</p>
    <p data-chapter-comment-id='\"9abb1c10-703d-43b0-927d-1d274ab60aeb\"'>Presently, I passed over the mountains, out above the huge breadth of\nthe plain. Far away, on its surface, in the direction of the ring-shaped\nsun, there showed a confused blur. I looked toward it, indifferently. It\nreminded me, somewhat, of the first glimpse I had caught of the\nmountain-amphitheatre.</p>
    <p data-chapter-comment-id='\"a8c48ab6-80d9-467e-a007-76c6e0227d42\"'>With a sense of weariness, I glanced upward at the immense ring of\nfire. What a strange thing it was! Then, as I stared, out from the dark\ncenter, there spurted a sudden flare of extraordinary vivid fire.\nCompared with the size of the black center, it was as naught; yet, in\nitself, stupendous. With awakened interest, I watched it carefully,\nnoting its strange boiling and glowing. Then, in a moment, the whole\nthing grew dim and unreal, and so passed out of sight. Much amazed, I\nglanced down to the Plain from which I was still rising. Thus, I\nreceived a fresh surprise. The Plain&mdash;everything had vanished, and only\na sea of red mist was spread far below me. Gradually as I stared this\ngrew remote, and died away into a dim far mystery of red against an\nunfathomable night. A while, and even this had gone, and I was wrapped\nin an impalpable, lightless gloom.</p>
    <p data-chapter-comment-id='\"fed421a9-ac8b-4fd4-a095-f73fb4f2e189\"'><br></p>
    <p data-chapter-comment-id='\"7d7dceef-79c7-4a82-979b-84c49c2fb469\"'><br></p>
    <p data-chapter-comment-id='\"916ffa64-f90a-4a7d-8547-d79833c8574a\"'></p>
    <hr style='\"width:'>
    <p data-chapter-comment-id='\"f2cc4cc7-a0ec-49c8-8aef-ad6aa2b21b28\"'></p>
    <p data-chapter-comment-id='\"1bbceb83-a693-4e53-9e37-fc6e55618095\"'><br></p>
    <p data-chapter-comment-id='\"20317838-2f2f-44b0-984c-4680819e8557\"'><br></p>
    <p data-chapter-comment-id='\"ef5fdb6e-9e75-40f1-a828-3cb7b0a1610d\"'><a name="%5C%22IV%5C%22"></a></p>
`;
	let s = $state({
		initialHTML: `<p class="PlaygroundEditorTheme__paragraph" data-chapter-comment-id="638a9df9-95d2-4d9a-81ed-f65a2bd0a9c5"><img src="http://127.0.0.1:5173/rest/api/upload/serve/chapter-attachments/images/7f4dec70-852c-411f-8ac1-ccf39d9c7853/01945732-a33e-74c0-af5a-ac82bb09e9ea/01945734-17fb-71fa-b73f-0bdf31992dc7/01945c63-28c8-78f1-8fcb-4a19e81bce65.jpeg" alt="" width="inherit" height="inherit"><img src="http://127.0.0.1:5173/rest/api/upload/serve/chapter-attachments/images/7f4dec70-852c-411f-8ac1-ccf39d9c7853/01945732-a33e-74c0-af5a-ac82bb09e9ea/01945734-17fb-71fa-b73f-0bdf31992dc7/01945c63-b74d-7d60-a178-3c115bf74116.jpeg" alt="" width="inherit" height="inherit"></p><p class="PlaygroundEditorTheme__paragraph" data-chapter-comment-id="c0cae97d-600d-4d1b-b72d-4b5695a4ce1b" dir="ltr"><span style="white-space: pre-wrap;">asdsad</span><img src="http://127.0.0.1:5173/rest/api/upload/serve/chapter-attachments/images/7f4dec70-852c-411f-8ac1-ccf39d9c7853/01945732-a33e-74c0-af5a-ac82bb09e9ea/01945734-17fb-71fa-b73f-0bdf31992dc7/01945c67-6c0c-7c1d-9dfb-8136dd0cd623.jpeg" alt="" width="inherit" height="inherit"><img src="http://127.0.0.1:5173/rest/api/upload/serve/chapter-attachments/images/7f4dec70-852c-411f-8ac1-ccf39d9c7853/01945732-a33e-74c0-af5a-ac82bb09e9ea/01945734-17fb-71fa-b73f-0bdf31992dc7/01945c65-e6ca-7bc2-a4cc-69ac827b30e1.jpeg" alt="" width="inherit" height="inherit"></p>`
	});
</script>

<button
	onclick={() => {
		//s.initialHTML = s.initialHTML.length == dd.length ? '<p>1</p>' : dd;
		const editor = document.getElementsByClassName('chapter_target').item(-1);
		/* editor.update((v) => {
			let a = document.querySelector('button svg');
			if (a) {
				a.classList.add('1');
			}
			console.log(a);
		}); */
	}}>Toggle Render Paragraphs</button
>
<div>
	<h1>Read only</h1>
	<div class="chapter_target"></div>
</div>

{#await EditorInstance}
	Dynamically loading Editor
{:then}
	<EditorInstance
		initialLifeCycle={{
			afterInitialHTMLRender: () => {
				setTimeout(() => {
					/* 		const last_target = document.getElementsByClassName('chapter_target').item(0);
					const content = document.getElementsByClassName('editor-container').item(0);
					last_target.append(content.cloneNode(true)); */
				}, 1000);
			}
		}}
		isAutocomplete={false}
		dev={true}
		imageUpload={true}
		config={{
			editable: true,
			upload: async () => {
				return 'https://placehold.co/600x400';
			}
		}}
		paragraphComment={true}
		initialHTML={s.initialHTML}
		isCharLimitUtf8={false}
		paragramComment={true}
		showToolbar={true}
	/>
{/await}

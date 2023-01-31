const {
    EMPTY,
    from,
    fromEvent,
    generate,
    interval,
    merge,
    noop
} = rxjs;
const {
    map,
    pluck,
    scan,
    sequenceEqual,
    switchMap,
    take,
    tap
} = rxjs.operators

const random = () => Math.floor(Math.random() * Math.floor(8));

document.querySelector(".reset").addEventListener('click',()=>{
    window.location.reload()
})

const setInfo = (text) =>
    (document.getElementById('info').innerHTML = text);
const displayLevelChange = () =>
    document
        .querySelectorAll('.child')
        .forEach((c) => (c.style.background = 'white'));

const checkIfGameOver$ = (randomSequence) => (
    userSequence
) =>
    from(userSequence).pipe(
        sequenceEqual(from(randomSequence)),
        tap(match =>
            !match && userSequence.length === randomSequence.length
                ? setInfo('GAME OVER!')
                : noop
        )
    );

const takePlayerInput$ = (randomSequence) => _ =>
    fromEvent(document, 'click').pipe(
        take(randomSequence.length),
        scan(
            (acc, curr) => [
                ...acc,
                parseInt(curr.target['id'])
            ],
            []
        ),
        switchMap(checkIfGameOver$(randomSequence)),
        switchMap(result =>
            result
                ? (displayLevelChange(), memoryGame$(randomSequence.length + 1))
                : EMPTY
        )
    );

const showSequenceToMemorize$ = (memorySize) => (
    randomSequence
) =>
    interval(1000).pipe(
        tap(i =>
            setInfo(i === memorySize - 1 ? `YOUR TURN` : `${memorySize - i} elements`)
        ),
        take(randomSequence.length),
        map(index => randomSequence[index]),
        tap(value => document.getElementById(`${value}`).click()),
        switchMap(takePlayerInput$(randomSequence))
    );

const memoryGame$ = memorySize =>
    generate(
        1,
        x => x <= memorySize,
        x => x + 1
    ).pipe(
        scan((acc, _) => [...acc, random() + 1], []),
        switchMap(showSequenceToMemorize$(memorySize))
    );

const elementClick$ = (event, color) =>
    fromEvent(document.querySelectorAll('.child'), event).pipe(
        pluck('srcElement'),
        tap((e) => (e.style.background = color))
    );

const clicks$ = merge(
    elementClick$('click', 'lightgray'),
    elementClick$('transitionend', '#2573C1')
);

const game$ = merge(clicks$, memoryGame$(2));

game$.subscribe();


// const setInfo = text => {
//     document.getElementById('info').innerHTML = text;
// };

// const displayLevelChange = () => {
//     document.querySelectorAll('.child').forEach(c => (c.style.background = 'gray'));
// };

// const checkIfGameOver$ = randomSequence => userSequence =>
//     fromEvent(document, 'click')
//         .pipe(
//             pluck('target', 'id'),
//             map(id => parseInt(id)),
//             scan((acc, curr) => [...acc, curr], []),
//             sequenceEqual(from(randomSequence)),
//             tap(match => {
//                 if (!match && userSequence.length === randomSequence.length) {
//                     setInfo('GAME OVER!');
//                 }
//             })
//         );

// const takePlayerInput$ = randomSequence => _ =>
//     fromEvent(document, 'click')
//         .pipe(
//             take(randomSequence.length),
//             scan((acc, curr) => [...acc, parseInt(curr.target['id'])], []),
//             switchMap(checkIfGameOver$(randomSequence)),
//             switchMap(result => {
//                 if (result) {
//                     displayLevelChange();
//                     return memoryGame$(randomSequence.length + 1);
//                 }
//                 return interval(0);
//             })
//         );

// const showSequenceToMemorize$ = memorySize => randomSequence =>
//     interval(1000)
//         .pipe(
//             take(memorySize),
//             tap(i => {
//                 setInfo(`Level ${memorySize}: remember the sequence`);
//                 document.getElementById(randomSequence[i]).style.background = 'white';
//             })
//         );

// const memoryGame$ = memorySize => {
//     const randomSequence = Array.from({ length: memorySize }, () => random());

//     return showSequenceToMemorize$(memorySize)(randomSequence).pipe(
//         switchMap(takePlayerInput$(randomSequence))
//     );
// };

// memoryGame$(1).subscribe();
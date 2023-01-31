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

document.querySelector(".reset").addEventListener('click', () => {
    window.location.reload()
})

const setInfo = (text) => {
    if (text === "GAME OVER!") {    
        document
        .querySelectorAll('.child')
        .forEach((c) => (c.style.background = '#8F0A22'));
        document.querySelector(".level").innerText = ``
    }
    return (document.getElementById('info').innerHTML = text)
};
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
) => interval(1000).pipe(
    tap(i =>
        setInfo(i === memorySize - 1 ? `YOUR TURN` : `${memorySize - i} elements`)
    ),
    take(randomSequence.length),
    map(index => randomSequence[index]),
    tap(value => document.getElementById(`${value}`).click()),
    switchMap(takePlayerInput$(randomSequence))
);

const memoryGame$ = memorySize => {
    console.log(memorySize, "memory")
    document.querySelector(".level").innerText = `Level ${memorySize-1}: remember the sequence`
    return generate(
        1,
        x => x <= memorySize,
        x => x + 1
    ).pipe(
        scan((acc, _) => [...acc, random() + 1], []),
        switchMap(showSequenceToMemorize$(memorySize))
    );
}

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


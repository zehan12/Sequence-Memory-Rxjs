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


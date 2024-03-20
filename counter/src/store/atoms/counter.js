import { atom, selector } from 'recoil';

//ATOM
export const countAtom = atom({
    key: "countAtom",
    default: 0
})

//SELECTOR
export const evenSelector = selector({
    key: "evenSelector",
    get: ({ get }) => {
        const count = get(countAtom);
        return count % 2;
    }
})
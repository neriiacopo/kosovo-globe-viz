import { create } from "zustand";

export let useStore = create((set, get) => ({
    active: "",
    leva: "",
}));

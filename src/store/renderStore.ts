import { create, type StateCreator } from 'zustand';

interface RenderState {
  renders: Record<string, string>;
  errors: Record<string, string | undefined>;
  setRender: (id: string, svg: string) => void;
  setError: (id: string, message: string) => void;
  clear: () => void;
}

const creator: StateCreator<RenderState> = (set) => ({
  renders: {},
  errors: {},
  setRender: (id, svg) =>
    set((state) => {
      const nextErrors = { ...state.errors };
      delete nextErrors[id];
      return {
        renders: { ...state.renders, [id]: svg },
        errors: nextErrors
      };
    }),
  setError: (id, message) =>
    set((state) => ({
      errors: { ...state.errors, [id]: message }
    })),
  clear: () => set({ renders: {}, errors: {} })
});

export const useRenderStore = create<RenderState>(creator);
